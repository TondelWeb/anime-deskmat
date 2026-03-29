// ─── CONFIG: replace placeholders with your product metadata ─────────────────
const PRINTIFY_PRODUCT_ID = "69c847c327ac868284004850"; // <-- Set to your real product ID
const PRINTIFY_VARIANT_ID = 65240; // <-- Set to your real variant ID (numeric)
// ─────────────────────────────────────────────────────────────────────────────

export interface ShippingAddress {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  country: string;
  region?: string; // state / province
  address1: string;
  address2?: string;
  city: string;
  zip: string;
}

interface PrintifyOrderResponse {
  id: string;
  status: string;
}

/**
 * Create an order in Printify for the given shipping details.
 *
 * @param externalId - Optional external identifier (e.g. Stripe session id)
 * @param shipping - Customer shipping details
 */
export async function createPrintifyOrder(
  externalId: string | undefined,
  shipping: ShippingAddress
): Promise<PrintifyOrderResponse> {
  const apiKey = process.env.PRINTIFY_API_KEY!;
  const shopId = process.env.PRINTIFY_SHOP_ID!;


  if (!apiKey) {
    console.error("[Printify] PRINTIFY_API_KEY is missing!");
    throw new Error("PRINTIFY_API_KEY is missing");
  }
  if (!shopId) {
    console.error("[Printify] PRINTIFY_SHOP_ID is missing!");
    throw new Error("PRINTIFY_SHOP_ID is missing");
  }
  console.log(`[Printify] apiKey exists:`, Boolean(apiKey));
  console.log(`[Printify] shopId:`, shopId);

  const payload = {
    external_id: externalId || undefined,
    label: `Order for ${shipping.first_name} ${shipping.last_name}`,
    line_items: [
      {
        product_id: PRINTIFY_PRODUCT_ID,
        variant_id: PRINTIFY_VARIANT_ID,
        quantity: 1,
      },
    ],
    shipping_method: 1,
    send_shipping_notification: true,
    address_to: {
      first_name: shipping.first_name,
      last_name: shipping.last_name,
      email: shipping.email,
      phone: shipping.phone || "",
      country: shipping.country,
      region: shipping.region || "",
      address1: shipping.address1,
      address2: shipping.address2 || "",
      city: shipping.city,
      zip: shipping.zip,
    },
  };
  console.log("[Printify] Request payload:", payload);

  const url = `https://api.printify.com/v1/shops/${shopId}/orders.json`;
  console.log("[Printify] Sending order to Printify", url);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    console.log("[Printify] Printify response:", text);
    if (!res.ok) {
      console.error("[Printify] API returned error", { status: res.status, body: text });
      throw new Error(`Printify API error ${res.status}: ${text}`);
    }
    const data = JSON.parse(text) as PrintifyOrderResponse;
    console.log("[Printify] Order created", { id: data.id, status: data.status });
    return data;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[Printify] Error sending to Printify:", message);
    throw err instanceof Error ? err : new Error(message);
  }
}

/**
 * Helper: extract shipping data from Stripe Checkout Session object.
 * Keeps the webhook code clean and typed.
 */
export function extractShippingFromStripe(
  session: import("stripe").Stripe.Checkout.Session
): ShippingAddress {
  const details = session.shipping_details;
  const customer = session.customer_details;

  if (!details?.address || !customer) {
    throw new Error("Stripe session missing shipping or customer details");
  }

  const name = details.name || customer.name || "";
  const [first_name, ...rest] = name.split(" ");
  const last_name = rest.join(" ") || "";

  return {
    first_name: first_name || "Customer",
    last_name,
    email: customer.email || "",
    phone: customer.phone || "",
    country: details.address.country || "",
    region: details.address.state || "",
    address1: details.address.line1 || "",
    address2: details.address.line2 || "",
    city: details.address.city || "",
    zip: details.address.postal_code || "",
  };
}
