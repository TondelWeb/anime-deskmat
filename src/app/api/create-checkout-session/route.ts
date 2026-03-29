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
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || `https://${req.headers.get("host")}`;

    // ── Create Stripe Checkout Session ──────────────────────────────────────
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      // ── Line items: what the customer is buying ──────────────────────────
      line_items: [
        {
          price_data: {
            currency: PRODUCT.currency,
            unit_amount: PRODUCT.price,
            product_data: {
              name: PRODUCT.name,
              description: PRODUCT.description,
              // Optional: add images array with hosted product image URL
              // images: ["https://your-domain.com/product-image.jpg"],
            },
          },
          quantity: PRODUCT.quantity,
        },
      ],

      // ── Collect shipping address for Printify fulfillment ────────────────
      shipping_address_collection: {
        allowed_countries: [
          "US", "CA", "GB", "AU", "DE", "FR", "NL", "SE", "NO",
          "DK", "FI", "BE", "AT", "CH", "NZ", "JP", "SG",
        ],
      },

      // ── Shipping options ─────────────────────────────────────────────────
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 0, currency: "usd" },
            display_name: "Standard Shipping",
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
        product: "anime-desk-mat",
        source: "website",
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
