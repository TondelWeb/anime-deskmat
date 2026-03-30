import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createPrintifyOrder, extractShippingFromStripe } from "@/lib/printify";

console.log("[Webhook] Module loaded");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: NextRequest) {
  console.log("[Webhook] 🚀 POST hit");

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("[Webhook] ❌ STRIPE_WEBHOOK_SECRET is not set");
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
    }

    const rawBody = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      console.warn("[Webhook] ⚠️  Missing stripe-signature header");
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
      console.log("[Webhook] ✅ Stripe event verified:", event.type, event.id);
    } catch (sigErr: unknown) {
      const msg = sigErr instanceof Error ? sigErr.message : "Signature verification failed";
      console.error("[Webhook] ❌ Signature verification failed:", msg);
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
      const partialSession = event.data.object as Stripe.Checkout.Session;
      console.log("[Webhook] session.id:", partialSession.id);
      console.log("[Webhook] payment_status (from event):", partialSession.payment_status);

      if (partialSession.payment_status !== "paid") {
        console.log("[Webhook] ⏭️  Not paid yet — skipping fulfillment");
        return NextResponse.json({ received: true, skipped: "not_paid" }, { status: 200 });
      }

      // Retrieve full session — shipping_details is top-level, no expand needed
      let fullSession: Stripe.Checkout.Session = partialSession;
      try {
        fullSession = await stripe.checkout.sessions.retrieve(partialSession.id, {
          expand: ["customer", "line_items"],
        });
        console.log("[Webhook] 📦 Full session retrieved:", {
          id:               fullSession.id,
          payment_status:   fullSession.payment_status,
          customer_details: fullSession.customer_details,
          shipping_details: fullSession.shipping_details,
          metadata:         fullSession.metadata,
          line_items_count: fullSession.line_items?.data?.length ?? 0,
        });
      } catch (retrieveErr: unknown) {
        console.warn(
          "[Webhook] ⚠️  Session retrieve failed — using truncated event payload as fallback:",
          retrieveErr instanceof Error ? retrieveErr.message : String(retrieveErr)
        );
      }

      // Extract shipping — returns null instead of throwing
      const shipping = extractShippingFromStripe(fullSession);
      if (!shipping) {
        console.error(
          "[Webhook] ❌ extractShippingFromStripe returned null. Full session:",
          JSON.stringify(fullSession, null, 2)
        );
        return NextResponse.json(
          { received: true, warning: "Missing shipping/customer data — fulfillment skipped", sessionId: fullSession.id },
          { status: 200 }
        );
      }

      // Read variantId and productId from Stripe session metadata
      // These are set at checkout time from ProductSection.tsx
      const printifyVariantId = fullSession.metadata?.variantId ?? "";
      const printifyProductId = fullSession.metadata?.printifyProductId ?? process.env.PRINTIFY_PRODUCT_ID ?? "";

      console.log("[Webhook] 🛍️  Calling createPrintifyOrder:", {
        sessionId: fullSession.id,
        printifyProductId,
        printifyVariantId,
      });

      const printifyOrder = await createPrintifyOrder(
        fullSession.id,
        shipping,
        printifyProductId,
        printifyVariantId
      );

      if (!printifyOrder) {
        console.error("[Webhook] ❌ createPrintifyOrder returned null — check [Printify] logs above");
        return NextResponse.json(
          { received: true, warning: "Printify order failed — see logs", sessionId: fullSession.id },
          { status: 200 }
        );
      }

      console.log("[Webhook] ✅ Printify order created:", printifyOrder);
      return NextResponse.json({ received: true, printifyOrder }, { status: 200 });
    }

    console.log("[Webhook] ℹ️  Unhandled event type:", event.type);
    return NextResponse.json({ received: true, unhandled: event.type }, { status: 200 });

  } catch (outerErr: unknown) {
    const msg = outerErr instanceof Error ? outerErr.message : String(outerErr);
    console.error("[Webhook] 💥 Unexpected top-level error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}