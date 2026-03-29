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
 * Requirements:
 *   - POST only
 *   - verify signature using STRIPE_WEBHOOK_SECRET
 *   - raw body parsing for Stripe signature validation
 *   - handle checkout.session.completed and respond 200 even on downstream errors
 */
export async function POST(req: NextRequest) {
  try {
    console.log("[Webhook] POST hit");

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("[Webhook] STRIPE_WEBHOOK_SECRET is not set");
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
    }

    const rawBody = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      console.warn("[Webhook] Missing Stripe signature header");
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
      console.log("[Webhook] Stripe event verified:", event.type);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Signature verification failed";
      console.error("[Webhook] Signature verification failed:", message);
      return NextResponse.json({ error: message }, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("[Webhook] checkout.session.completed event:", session.id, "status", session.payment_status);

      if (session.payment_status !== "paid") {
        console.log("[Webhook] Session payment_status is not paid; skipping fulfillment.");
        return NextResponse.json({ received: true, skipped: true }, { status: 200 });
      }

      let fullSession: Stripe.Checkout.Session = session;
      try {
        const retrievedSession = await stripe.checkout.sessions.retrieve(session.id, {
          expand: ["customer", "shipping_address"],
        });
        fullSession = retrievedSession;
        console.log("[Webhook] Retrieved full session from Stripe:", {
          id: retrievedSession.id,
          payment_status: retrievedSession.payment_status,
          customer_details: retrievedSession.customer_details,
          shipping_details: retrievedSession.shipping_details,
          customer: retrievedSession.customer,
        });
      } catch (retrieveErr: unknown) {
        console.warn("[Webhook] stripe.checkout.sessions.retrieve failed, using event session object as fallback.",
          retrieveErr instanceof Error ? retrieveErr.message : String(retrieveErr)
        );
      }

      const customerDetails = fullSession.customer_details;
      const shippingDetails = fullSession.shipping_details;
      console.log("[Webhook] customer_details:", customerDetails);
      console.log("[Webhook] shipping_details:", shippingDetails);

      if (!customerDetails?.email || !shippingDetails?.address) {
        console.warn("[Webhook] Warning: session may have incomplete customer/shipping details.");
      }

      try {
        const shipping = extractShippingFromStripe(fullSession);
        console.log("[Webhook] Shipping data:", JSON.stringify(shipping));

        const printifyOrder = await createPrintifyOrder(fullSession.id, shipping);
        console.log("[Webhook] ✅ Printify order created:", printifyOrder);

        return NextResponse.json({ received: true, printifyOrder }, { status: 200 });
      } catch (fulfillmentErr: unknown) {
        const message = fulfillmentErr instanceof Error ? fulfillmentErr.message : String(fulfillmentErr);
        console.error("[Webhook] ❌ Printify fulfillment failed:", message);

        return NextResponse.json(
          {
            received: true,
            warning: "Printify fulfillment failed",
            error: message,
          },
          { status: 200 }
        );
      }
    }

    console.log("[Webhook] Unhandled event type:", event.type);
    return NextResponse.json({ received: true, unhandled: event.type }, { status: 200 });
  } catch (outerErr: unknown) {
    const message = outerErr instanceof Error ? outerErr.message : String(outerErr);
    console.error("[Webhook] Unexpected error:", message);

    // Avoid 500 crash and ensure Stripe gets 200 if possible.
    return NextResponse.json({ received: true, error: message }, { status: 200 });
  }
}

