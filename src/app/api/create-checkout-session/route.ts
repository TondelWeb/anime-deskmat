import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// ─── Initialize Stripe with secret key ───────────────────────────────────────
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

// ─── Product configuration ────────────────────────────────────────────────────
const PRODUCT = {
  name: "Minimal Anime Ocean Desk Mat",
  description:
    "Premium extended mouse pad — 900×400mm. Smooth surface, non-slip base, minimal anime ocean design.",
  price: 2999, // Price in cents ($29.99)
  currency: "usd",
  quantity: 1,
};

export async function POST(req: NextRequest) {
  try {
    const { priceId, variantId, size } = await req.json();

    const host = req.headers.get("host");

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (host ? `https://${host}` : "http://localhost:3000");

    // ── Create Stripe Checkout Session ──────────────────────────────────────
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      // ── line items: what the customer is buying ─────────────────────────
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],

      // ── Collect shipping address for Printify fulfillment ────────────────
      shipping_address_collection: {
        allowed_countries: ["US"],
      },

      // ── billing address and email collection ─────────────────────────────
      billing_address_collection: "required",
      customer_email: undefined, // let Stripe prompt customer for email
      customer_creation: "always",

      // ── Shipping options ─────────────────────────────────────────────────
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

      // ── Redirect URLs ────────────────────────────────────────────────────
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/`,

      // ── Metadata for webhook identification ──────────────────────────────
      metadata: {
        product: "nordic-warrior-desk-mat",
        source: "website",
        size: size ?? "",
        variantId: variantId ?? "",
      },
    });

    console.log("[Checkout] Session created:", session.id);

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("[Checkout] Error creating session:", message);

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
