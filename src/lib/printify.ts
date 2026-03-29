import type { Stripe } from "stripe";

export interface ShippingAddress {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  country: string;
  region?: string;
  address1: string;
  address2?: string;
  city: string;
  zip: string;
}

interface PrintifyOrderResponse {
  id: string;
  status: string;
}

// ─── extractShippingFromStripe ────────────────────────────────────────────────
//
// FIX: Original threw when shipping/customer was missing.
// That throw escaped the webhook's fulfillment try/catch, causing silent 500s.
// Now returns null so the caller can guard and return 200 gracefully.
//
export function extractShippingFromStripe(
  session: Stripe.Checkout.Session
): ShippingAddress | null {
  const details = session.shipping_details;
  const customer = session.customer_details;

  console.log("[Printify] extractShippingFromStripe called");
  console.log("[Printify] shipping_details:", JSON.stringify(details, null, 2));
  console.log("[Printify] customer_details:", JSON.stringify(customer, null, 2));

  // ❌ BEFORE: threw here — now returns null so caller can handle gracefully
  if (!details?.address) {
    console.error("[Printify] ❌ shipping_details.address is null or missing");
    return null;
  }
  if (!customer) {
    console.error("[Printify] ❌ customer_details is null or missing");
    return null;
  }
  if (!customer.email) {
    console.error("[Printify] ❌ customer_details.email is missing");
    return null;
  }

  const name = details.name ?? customer.name ?? "";
  const [rawFirst, ...rest] = name.trim().split(" ");
  const first_name = rawFirst || "Customer";
  const last_name = rest.join(" ") || "."; // Printify requires non-empty last_name

  const shipping: ShippingAddress = {
    first_name,
    last_name,
    email: customer.email,
    phone: customer.phone ?? "",
    country: details.address.country ?? "",
    region: details.address.state ?? "",
    address1: details.address.line1 ?? "",
    address2: details.address.line2 ?? "",
    city: details.address.city ?? "",
    zip: details.address.postal_code ?? "",
  };

  console.log("[Printify] ✅ Extracted shipping address:", JSON.stringify(shipping, null, 2));
  return shipping;
}

// ─── createPrintifyOrder ──────────────────────────────────────────────────────
//
// FIX: Original threw on missing env vars — those throws escaped the webhook
// catch block, returning 200 to Stripe but silently skipping Printify.
// Now returns null with detailed logs so the caller can handle it explicitly.
//
export async function createPrintifyOrder(
  externalId: string | undefined,
  shipping: ShippingAddress
): Promise<PrintifyOrderResponse | null> {

  // ── Validate env vars — log each one individually so you can see exactly
  //    which is missing in Vercel logs without guessing ──────────────────────
  const apiKey    = process.env.PRINTIFY_API_KEY;
  const shopId    = process.env.PRINTIFY_SHOP_ID;
  const productId = process.env.PRINTIFY_PRODUCT_ID;
  const variantRaw = process.env.PRINTIFY_VARIANT_ID;
  const variantId  = variantRaw ? Number(variantRaw) : NaN;

  console.log("[Printify] Env check:", {
    PRINTIFY_API_KEY:    apiKey    ? `set (${apiKey.slice(0, 6)}...)` : "❌ MISSING",
    PRINTIFY_SHOP_ID:    shopId    ? `set (${shopId})`                : "❌ MISSING",
    PRINTIFY_PRODUCT_ID: productId ? `set (${productId})`             : "❌ MISSING",
    PRINTIFY_VARIANT_ID: variantRaw
      ? `set → parsed as ${variantId} (${isNaN(variantId) ? "❌ NaN" : "✅ valid"})`
      : "❌ MISSING",
  });

  // ❌ BEFORE: these threw — now return null so webhook can still ack Stripe
  if (!apiKey) {
    console.error("[Printify] ❌ PRINTIFY_API_KEY is not set — cannot call Printify");
    return null;
  }
  if (!shopId) {
    console.error("[Printify] ❌ PRINTIFY_SHOP_ID is not set — cannot call Printify");
    return null;
  }
  if (!productId) {
    console.error("[Printify] ❌ PRINTIFY_PRODUCT_ID is not set — cannot call Printify");
    return null;
  }
  if (!variantRaw || isNaN(variantId)) {
    console.error("[Printify] ❌ PRINTIFY_VARIANT_ID is missing or not a valid number:", variantRaw);
    return null;
  }

  const payload = {
    external_id: externalId ?? undefined,
    label: `Order for ${shipping.first_name} ${shipping.last_name}`,
    line_items: [
      {
        product_id: productId,
        variant_id: variantId,
        quantity: 1,
      },
    ],
    shipping_method: 1,
    send_shipping_notification: true,
    address_to: {
      first_name: shipping.first_name,
      last_name:  shipping.last_name,
      email:      shipping.email,
      phone:      shipping.phone ?? "",
      country:    shipping.country,
      region:     shipping.region ?? "",
      address1:   shipping.address1,
      address2:   shipping.address2 ?? "",
      city:       shipping.city,
      zip:        shipping.zip,
    },
  };

  const url = `https://api.printify.com/v1/shops/${shopId}/orders.json`;

  // ── Log the full request BEFORE sending ─────────────────────────────────
  console.log("[Printify] 📤 Sending order to Printify:");
  console.log("[Printify] URL:", url);
  console.log("[Printify] Payload:", JSON.stringify(payload, null, 2));

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });
  } catch (networkErr: unknown) {
    // fetch() itself threw — network failure, DNS issue, etc.
    const msg = networkErr instanceof Error ? networkErr.message : String(networkErr);
    console.error("[Printify] ❌ Network error calling Printify API:", msg);
    return null;
  }

  // ── Log the FULL response regardless of success/failure ──────────────────
  const text = await res.text();
  console.log("[Printify] 📥 Printify response status:", res.status, res.statusText);
  console.log("[Printify] 📥 Printify response body:", text);

  if (!res.ok) {
    // ❌ BEFORE: threw here — now returns null and logs clearly
    console.error(`[Printify] ❌ Printify API returned ${res.status}:`, text);

    // Common status codes to help you debug without opening Printify docs:
    if (res.status === 401) console.error("[Printify] → 401 = API key is wrong or expired");
    if (res.status === 403) console.error("[Printify] → 403 = API key lacks permission for this shop");
    if (res.status === 404) console.error("[Printify] → 404 = shop_id or product_id not found");
    if (res.status === 422) console.error("[Printify] → 422 = payload validation failed (check variant_id, address fields)");

    return null;
  }

  let data: PrintifyOrderResponse;
  try {
    data = JSON.parse(text) as PrintifyOrderResponse;
  } catch (parseErr) {
    console.error("[Printify] ❌ Failed to parse Printify success response as JSON:", text);
    return null;
  }

  console.log("[Printify] ✅ Order created successfully:", JSON.stringify(data, null, 2));
  return data;
}