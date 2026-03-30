import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: NextRequest) {
  try {
    const { priceId, variantId, size } = await req.json();

    if (!priceId) {
      return NextResponse.json({ error: "Missing priceId" }, { status: 400 });
    }

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
            fixed_amount: { amount: 0, currency: "usd" },
            display_name: "Free Shipping",
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