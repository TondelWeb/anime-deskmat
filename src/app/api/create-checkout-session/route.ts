import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

const SIZE_MAP: Record<string, { priceId: string; variantId: string }> = {
  "12x18": { priceId: process.env.STRIPE_PRICE_12X18 ?? "price_1TGYBYAbBgE9tbEaOjUPusgN", variantId: "65240" },
  "12x22": { priceId: process.env.STRIPE_PRICE_12X22 ?? "price_1TGYD0AbBgE9tbEaSzsqvO8W", variantId: "65241" },
  "16x32": { priceId: process.env.STRIPE_PRICE_16X32 ?? "price_1TGYEBAbBgE9tbEaL2yIVaXn", variantId: "72580" },
};

export async function POST(req: NextRequest) {
  try {
    const { size } = await req.json();

    const variant = SIZE_MAP[size];
    if (!variant) {
      return NextResponse.json({ error: "Invalid size" }, { status: 400 });
    }
    const { priceId, variantId } = variant;

    const host = req.headers.get("host");
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (host ? `https://${host}` : "http://localhost:3000");

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],

      shipping_address_collection: {
        allowed_countries: ["US"],
      },

      billing_address_collection: "required",
      customer_creation: "always",

      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 799, currency: "usd" },
            display_name: "Standard Shipping",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 7 },
              maximum: { unit: "business_day", value: 14 },
            },
          },
        },
      ],

      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/`,

      metadata: {
        product: "nordic-warrior-desk-mat",
        source: "website",
        size: size ?? "",
        variantId: variantId ?? "",
        printifyProductId: process.env.PRINTIFY_PRODUCT_ID ?? "",
      },
    });

    console.log("[Checkout] Session created:", session.id, "| size:", size, "| priceId:", priceId);

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("[Checkout] Error creating session:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}