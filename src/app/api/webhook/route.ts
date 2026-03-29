console.log("🚀 WEBHOOK ROUTE HIT");
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createPrintifyOrder, extractShippingFromStripe } from "@/lib/printify";

// --- LOG: Webhook module loaded ---
console.log("[Webhook] Module loaded");

// ─── Initialize Stripe ────────────────────────────────────────────────────────
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

// Note: body parsing is intentionally avoided by reading raw text from the
// incoming `Request` via `req.text()` below. The legacy `export const config`
// with `api.bodyParser = false` is deprecated in newer Next.js versions.

/**
 * Stripe Webhook Handler
 *
 * Listens for checkout.session.completed events.
 * On successful payment:
 *   1. Verifies the Stripe signature (security)
 *   2. Extracts customer + shipping info
 *   3. Creates a Printify order for fulfillment
 *
 * SETUP:
 * - Local: stripe listen --forward-to localhost:3000/api/webhook
 * - Production: Add https://your-domain.com/api/webhook in Stripe Dashboard
 *               → Developers → Webhooks → Add endpoint
 *   Events to listen: checkout.session.completed
 */
export async function POST(req: NextRequest) {
  console.log("[Webhook] POST hit");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[Webhook] STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }
  // Read raw body for signature verification
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");
  console.log("[Webhook] Raw body:", rawBody);
  console.log("[Webhook] Stripe signature:", signature);
  if (!signature) {
    console.warn("[Webhook] Missing Stripe signature header");
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    console.log("[Webhook] Stripe event received:", JSON.stringify(event, null, 2));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Signature verification failed";
    console.error("[Webhook] Signature verification failed:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }
  // Handle events
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log("[Webhook] checkout.session.completed received:", JSON.stringify(session, null, 2));
    if (session.payment_status !== "paid") {
      console.log("[Webhook] Payment not yet complete, skipping fulfillment");
      return NextResponse.json({ received: true, skipped: true }, { status: 200 });
    }
    try {
      const shipping = extractShippingFromStripe(session);
      console.log("[Webhook] Shipping extracted:", shipping);
      const printifyOrder = await createPrintifyOrder(session.id, shipping);
      console.log("[Webhook] ✅ Printify order created:", printifyOrder);
      return NextResponse.json({ received: true, printifyOrder }, { status: 200 });
    } catch (fulfillmentErr: unknown) {
      const message = fulfillmentErr instanceof Error ? fulfillmentErr.message : String(fulfillmentErr);
      console.error("[Webhook] ❌ Printify fulfillment failed:", message);
      return NextResponse.json({ error: message }, { status: 500 });
    }
  } else {
    console.log(`[Webhook] Unhandled event type: ${event.type}`);
    return NextResponse.json({ received: true, unhandled: event.type }, { status: 200 });
  }
}
