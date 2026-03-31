import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createPrintifyOrder, extractShippingFromStripe } from "@/lib/printify";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

// Maps every live Stripe price ID → the Printify product + variant to fulfill.
// This is the fallback if session metadata is missing.
// The primary source is session.metadata (set in create-checkout-session).
const PRICE_TO_PRINTIFY: Record<string, { productId: string; variantId: string }> = {
  // ── Thorfinn Nordic Warrior Desk Mat ─────────────────────────────────────────
  "price_1TGYBYAbBgE9tbEaOjUPusgN": { productId: "69c847c327ac868284004850", variantId: "65240" }, // 12x18
  "price_1TGYD0AbBgE9tbEaSzsqvO8W": { productId: "69c847c327ac868284004850", variantId: "65241" }, // 12x22
  "price_1TGYEBAbBgE9tbEaL2yIVaXn": { productId: "69c847c327ac868284004850", variantId: "72580" }, // 16x32

  // ── Thorfinn Farming Desk Mat (Scarecrow in Storm) ───────────────────────────
  "price_1TH4KMAHj7RoGh5l7QI682oI": { productId: "69cbe7601683c4f1fb0499fe", variantId: "65240" }, // 12x18
  "price_1TH4KZAHj7RoGh5lgcJC9B6Q": { productId: "69cbe7601683c4f1fb0499fe", variantId: "65241" }, // 12x22
  "price_1TH4LLAHj7RoGh5leu012n6f": { productId: "69cbe7601683c4f1fb0499fe", variantId: "72580" }, // 16x32
};

export async function POST(req: NextRequest) {
  console.log("[Webhook] POST received");

  // ── 1. Verify webhook secret is configured ──────────────────────────────────
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[Webhook] STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  // ── 2. Verify Stripe signature ──────────────────────────────────────────────
  // We MUST read the raw body before any JSON parsing so the signature stays valid.
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Signature verification failed";
    console.error("[Webhook] Signature verification failed:", msg);
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  // ── 3. Only handle checkout.session.completed ───────────────────────────────
  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true }, { status: 200 });
  }

  const partial = event.data.object as Stripe.Checkout.Session;
  console.log("[Webhook] checkout.session.completed:", partial.id, "| payment_status:", partial.payment_status);

  if (partial.payment_status !== "paid") {
    // Edge case: async payment methods (e.g. bank transfer) complete the session
    // but payment_status is "unpaid" until funds clear. Skip fulfillment for now.
    console.log("[Webhook] Skipping — not paid yet:", partial.id);
    return NextResponse.json({ received: true, skipped: "not_paid" }, { status: 200 });
  }

  // ── 4. Retrieve full session (partial event payload lacks shipping_details) ──
  let session: Stripe.Checkout.Session = partial;
  try {
    session = await stripe.checkout.sessions.retrieve(partial.id, {
      expand: ["line_items"],
    });
  } catch (err) {
    console.warn("[Webhook] Could not retrieve full session, using partial payload:", err);
  }

  // ── 5. Extract shipping address ─────────────────────────────────────────────
  const shipping = extractShippingFromStripe(session);
  if (!shipping) {
    console.error("[Webhook] No shipping address found in session:", session.id);
    // Return 200 so Stripe doesn't retry — log it and investigate manually.
    return NextResponse.json(
      { received: true, warning: "Missing shipping address — fulfillment skipped", sessionId: session.id },
      { status: 200 }
    );
  }

  // ── 6. Resolve Printify product + variant ID ────────────────────────────────
  // Primary source: metadata written by create-checkout-session at purchase time.
  let printifyProductId = session.metadata?.printifyProductId ?? "";
  let printifyVariantId = session.metadata?.variantId ?? "";

  if (!printifyProductId || !printifyVariantId) {
    // Fallback: look up by the Stripe price ID on the line item.
    const lineItem = session.line_items?.data?.[0];
    const priceId =
      typeof lineItem?.price === "string" ? lineItem.price : (lineItem?.price?.id ?? "");
    const mapping = PRICE_TO_PRINTIFY[priceId];

    if (mapping) {
      printifyProductId = mapping.productId;
      printifyVariantId = mapping.variantId;
      console.log("[Webhook] Resolved Printify IDs via price-ID fallback:", { priceId, printifyProductId, printifyVariantId });
    }
  }

  if (!printifyProductId || !printifyVariantId) {
    console.error("[Webhook] Could not resolve Printify product/variant for session:", session.id, "metadata:", session.metadata);
    return NextResponse.json(
      { received: true, warning: "Unknown product — fulfillment skipped", sessionId: session.id },
      { status: 200 }
    );
  }

  // ── 7. Create Printify order ─────────────────────────────────────────────────
  console.log("[Webhook] Creating Printify order:", { sessionId: session.id, printifyProductId, printifyVariantId });

  const order = await createPrintifyOrder(session.id, shipping, printifyProductId, printifyVariantId);

  if (!order) {
    console.error("[Webhook] Printify order creation failed for session:", session.id);
    return NextResponse.json(
      { received: true, warning: "Printify order failed — check server logs", sessionId: session.id },
      { status: 200 }
    );
  }

  console.log("[Webhook] Printify order created successfully:", order.id, "for session:", session.id);
  return NextResponse.json({ received: true, printifyOrderId: order.id }, { status: 200 });
}
