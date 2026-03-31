import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

// Single source of truth: Stripe price ID → Printify fulfillment details.
// Keep this in sync with ProductSection.tsx and the PRICE_TO_PRINTIFY map in
// /api/webhooks/stripe/route.ts.
const PRICE_TO_PRINTIFY: Record<string, { variantId: string; printifyProductId: string }> = {
  // ── Thorfinn Nordic Warrior Desk Mat ─────────────────────────────────────────
  "price_1TGYBYAbBgE9tbEaOjUPusgN": { variantId: "65240", printifyProductId: "69c847c327ac868284004850" }, // 12x18
  "price_1TGYD0AbBgE9tbEaSzsqvO8W": { variantId: "65241", printifyProductId: "69c847c327ac868284004850" }, // 12x22
  "price_1TGYEBAbBgE9tbEaL2yIVaXn": { variantId: "72580", printifyProductId: "69c847c327ac868284004850" }, // 16x32

  // ── Thorfinn Farming Desk Mat (Scarecrow in Storm) ───────────────────────────
  "price_1TH4KMAHj7RoGh5l7QI682oI": { variantId: "65240", printifyProductId: "69cbe7601683c4f1fb0499fe" }, // 12x18
  "price_1TH4KZAHj7RoGh5lgcJC9B6Q": { variantId: "65241", printifyProductId: "69cbe7601683c4f1fb0499fe" }, // 12x22
  "price_1TH4LLAHj7RoGh5leu012n6f": { variantId: "72580", printifyProductId: "69cbe7601683c4f1fb0499fe" }, // 16x32
};

export async function POST(req: NextRequest) {
  try {
    // priceId comes directly from the variant selected in ProductSection.tsx.
    // size is only used for the metadata label — it does not drive any logic.
    const { priceId, size } = await req.json();

    if (!priceId) {
      return NextResponse.json({ error: "Missing priceId" }, { status: 400 });
    }

    const mapping = PRICE_TO_PRINTIFY[priceId];
    if (!mapping) {
      console.error("[Checkout] Unknown priceId received:", priceId);
      return NextResponse.json({ error: "Invalid product" }, { status: 400 });
    }

    const { variantId, printifyProductId } = mapping;

    const host = req.headers.get("host");
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (host ? `https://${host}` : "http://localhost:3000");

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      line_items: [{ price: priceId, quantity: 1 }],

      // Captures the full shipping address — required for Printify fulfillment.
      shipping_address_collection: { allowed_countries: ["US"] },
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
      cancel_url: `${baseUrl}/shop`,

      // The webhook reads these metadata fields to know which Printify product
      // and variant to order — without retrieving line_items separately.
      metadata: {
        priceId,
        size: size ?? "",
        variantId,
        printifyProductId,
      },
    });

    console.log("[Checkout] Session created:", session.id, "| priceId:", priceId, "| size:", size);
    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("[Checkout] Error creating session:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
