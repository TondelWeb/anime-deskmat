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

import type { Stripe } from "stripe";

export async function createPrintifyOrder(
  externalId: string | undefined,
  shipping: ShippingAddress
): Promise<PrintifyOrderResponse> {
  const apiKey = process.env.PRINTIFY_API_KEY;
  const shopId = process.env.PRINTIFY_SHOP_ID;
  const productId = process.env.PRINTIFY_PRODUCT_ID;
  const variantRaw = process.env.PRINTIFY_VARIANT_ID;
  const variantId = variantRaw ? Number(variantRaw) : NaN;

  if (!apiKey) throw new Error("PRINTIFY_API_KEY is missing");
  if (!shopId) throw new Error("PRINTIFY_SHOP_ID is missing");
  if (!productId) throw new Error("PRINTIFY_PRODUCT_ID is missing");
  if (!variantRaw || isNaN(variantId)) throw new Error("PRINTIFY_VARIANT_ID is missing or not a number");

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
      last_name: shipping.last_name,
      email: shipping.email,
      phone: shipping.phone ?? "",
      country: shipping.country,
      region: shipping.region ?? "",
      address1: shipping.address1,
      address2: shipping.address2 ?? "",
      city: shipping.city,
      zip: shipping.zip,
    },
  };

  const url = `https://api.printify.com/v1/shops/${shopId}/orders.json`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Printify API error ${res.status}: ${text}`);
  }
  const data = JSON.parse(text) as PrintifyOrderResponse;
  return data;
}

export function extractShippingFromStripe(
  session: Stripe.Checkout.Session
): ShippingAddress {
  const details = session.shipping_details;
  const customer = session.customer_details;

  if (!details?.address || !customer) {
    throw new Error("Stripe session missing shipping or customer details");
  }

  const name = details.name ?? customer.name ?? "";
  const [first_name, ...rest] = name.split(" ");
  const last_name = rest.join(" ") ?? "";

  return {
    first_name: first_name || "Customer",
    last_name,
    email: customer.email ?? "",
    phone: customer.phone ?? "",
    country: details.address.country ?? "",
    region: details.address.state ?? "",
    address1: details.address.line1 ?? "",
    address2: details.address.line2 ?? "",
    city: details.address.city ?? "",
    zip: details.address.postal_code ?? "",
  };
}
