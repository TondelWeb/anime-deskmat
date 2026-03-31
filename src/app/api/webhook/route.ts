import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createPrintifyOrder, extractShippingFromStripe } from "@/lib/printify";

console.log("[Webhook] Module loaded");

// ─── Initialize Stripe ────────────────────────────────────────────────────────
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

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
 *
 * IMPORTANT: We ALWAYS return 200 to Stripe after signature verification,
 * even if Printify fails. This prevents Stripe from retrying endlessly.
 * Fulfillment errors are logged and should be handled via a retry queue or alert.
 */
export async function POST(req: NextRequest) {
  console.log("[Webhook] 🚀 POST hit");

  // ── 1. Check webhook secret is configured ──────────────────────────────────
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[Webhook] ❌ STRIPE_WEBHOOK_SECRET is not set — check environment variables");
    return NextResponse.json({ received: true }, { status: 200 });
  }

  // ── 2. Read raw body for signature verification ────────────────────────────
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");

  console.log("[Webhook] Stripe-Signature header present:", !!signature);

  if (!signature) {
    console.warn("[Webhook] ⚠️ Missing stripe-signature header — rejecting request");
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  // ── 3. Verify Stripe signature ─────────────────────────────────────────────
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    console.log("[Webhook] ✅ Stripe event verified:", event.type, `(id: ${event.id})`);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Signature verification failed";
    console.error("[Webhook] ❌ Signature verification failed:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  // ── 4. Handle events ───────────────────────────────────────────────────────
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log("[Webhook] checkout.session.completed — session id:", session.id);
    console.log("[Webhook] Payment status:", session.payment_status);

    if (session.payment_status !== "paid") {
      console.log("[Webhook] ⏭️ Payment not yet complete — skipping fulfillment");
      return NextResponse.json({ received: true, skipped: true }, { status: 200 });
    }

    // ── 5. Attempt Printify fulfillment ───────────────────────────────────────
    // CRITICAL: errors here must NEVER bubble up to Stripe.
    // Always return 200, and log failures for your own alerting/retry logic.
    console.log("[Webhook] 🖨️ Starting Printify fulfillment for session:", session.id);
    try {
      const shipping = extractShippingFromStripe(session);
      console.log("[Webhook] Shipping extracted:", JSON.stringify(shipping, null, 2));

      const printifyOrder = await createPrintifyOrder(session.id, shipping);
      console.log("[Webhook] ✅ Printify order created:", JSON.stringify(printifyOrder, null, 2));

      return NextResponse.json({ received: true, printifyOrder }, { status: 200 });
    } catch (fulfillmentErr: unknown) {
      const message =
        fulfillmentErr instanceof Error ? fulfillmentErr.message : String(fulfillmentErr);

      console.error("[Webhook] ❌ Printify fulfillment FAILED for session:", session.id);
      console.error("[Webhook] Error message:", message);
      if (fulfillmentErr instanceof Error && fulfillmentErr.stack) {
        console.error("[Webhook] Stack trace:", fulfillmentErr.stack);
      }

      // Still return 200 — Stripe has done its job. The problem is on our side.
      return NextResponse.json(
        { received: true, fulfillmentError: message },
        { status: 200 }
      );
    }
  }

  // ── 6. Unhandled event types ───────────────────────────────────────────────
  console.log(`[Webhook] ⏭️ Unhandled event type: ${event.type} — ignoring`);
  return NextResponse.json({ received: true, unhandled: event.type }, { status: 200 });
}