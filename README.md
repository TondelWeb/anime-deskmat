# Minimal Anime Ocean Desk Mat — Ecommerce Store

A production-ready single-product ecommerce site built with **Next.js 14**, **Stripe Checkout**, and **Printify** fulfillment.

---

## Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Framework   | Next.js 14 (App Router)           |
| Styling     | Tailwind CSS                      |
| Payments    | Stripe Checkout + Webhooks        |
| Fulfillment | Printify API (print-on-demand)    |
| Deployment  | Vercel (recommended)              |

---

## Project Structure

```
anime-deskmat/
├── src/
│   ├── app/
│   │   ├── layout.tsx                    # Root layout, fonts, metadata
│   │   ├── globals.css                   # Global styles + Tailwind
│   │   ├── page.tsx                      # Homepage (/)
│   │   ├── success/
│   │   │   └── page.tsx                  # Order confirmed page (/success)
│   │   └── api/
│   │       ├── create-checkout-session/
│   │       │   └── route.ts              # POST → creates Stripe session
│   │       └── webhook/
│   │           └── route.ts              # POST → Stripe webhook handler
│   ├── components/
│   │   ├── Hero.tsx                      # Full-width hero section
│   │   ├── ProductSection.tsx            # Product details + buy CTA
│   │   ├── BuyButton.tsx                 # Client button → Stripe redirect
│   │   └── Footer.tsx                    # Site footer
│   └── lib/
│       └── printify.ts                   # Printify API integration
├── .env.local.example                    # Environment variable template
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Quick Start (Local Development)

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd anime-deskmat
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.local.example .env.local
```

Open `.env.local` and fill in your keys (see the section below for where to get each one).

### 3. Run the Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

Copy `.env.local.example` → `.env.local` and fill in each value:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
PRINTIFY_API_KEY=...
PRINTIFY_SHOP_ID=...
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Where to get each key

| Variable | Where to find it |
|---|---|
| `STRIPE_SECRET_KEY` | [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys) → Secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Same page → Publishable key |
| `STRIPE_WEBHOOK_SECRET` | Generated when you set up the webhook (see below) |
| `PRINTIFY_API_KEY` | [printify.com/app/account/api](https://printify.com/app/account/api) |
| `PRINTIFY_SHOP_ID` | The numeric ID in the URL when viewing your Printify shop |
| `NEXT_PUBLIC_BASE_URL` | `http://localhost:3000` locally; your domain in production |

---

## Stripe Webhook Setup

The webhook listens for `checkout.session.completed` to trigger Printify fulfillment.

### Local Development

Install the [Stripe CLI](https://stripe.com/docs/stripe-cli):

```bash
# macOS
brew install stripe/stripe-cli/stripe

# Login
stripe login
```

Forward webhooks to your local server:

```bash
stripe listen --forward-to localhost:3000/api/webhook
```

The CLI will print a webhook signing secret — copy it into `.env.local`:

```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

Keep this terminal running while you test. Trigger a test event:

```bash
stripe trigger checkout.session.completed
```

### Production (Vercel)

1. Go to [dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)
2. Click **Add endpoint**
3. URL: `https://your-domain.vercel.app/api/webhook`
4. Select event: **`checkout.session.completed`**
5. Click **Add endpoint**
6. Click **Reveal signing secret** → copy to Vercel env vars as `STRIPE_WEBHOOK_SECRET`

---

## Printify Setup

### Step 1 — Get your Product ID

1. Log in to [printify.com](https://printify.com)
2. Go to **My Products** and open your desk mat listing
3. The Product ID is in the URL:
   `https://printify.com/app/editor/YOUR_PRODUCT_ID/...`

### Step 2 — Get your Variant ID

Use the Printify API or their dashboard to find the variant ID:

```bash
curl -H "Authorization: Bearer YOUR_PRINTIFY_API_KEY" \
  https://api.printify.com/v1/shops/YOUR_SHOP_ID/products/YOUR_PRODUCT_ID.json
```

Look for the `variants` array — find the `id` of the variant you want to sell (e.g. the standard desk mat SKU).

### Step 3 — Update the placeholders

Open `src/lib/printify.ts` and replace:

```typescript
const PRINTIFY_PRODUCT_ID = "YOUR_PRINTIFY_PRODUCT_ID"; // ← your product ID
const PRINTIFY_VARIANT_ID = 12345;                       // ← your variant ID (number)
```

---

## Deploying to Vercel

### One-click deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Manual deploy

```bash
npm install -g vercel
vercel login
vercel --prod
```

### Add environment variables on Vercel

1. Go to your project → **Settings** → **Environment Variables**
2. Add all variables from `.env.local` (use your **live** Stripe keys, not test keys)
3. Set `NEXT_PUBLIC_BASE_URL` to your production domain (e.g. `https://deskmat.co`)
4. Redeploy after adding variables

---

## Testing Payments

Use Stripe's test card numbers (only work with test-mode keys):

| Scenario | Card Number | Expiry | CVC |
|---|---|---|---|
| ✅ Success | `4242 4242 4242 4242` | Any future date | Any 3 digits |
| ❌ Decline | `4000 0000 0000 0002` | Any future date | Any 3 digits |
| 🔐 3D Secure | `4000 0025 0000 3155` | Any future date | Any 3 digits |

---

## Adding a Real Product Image

In `src/components/ProductSection.tsx`, replace `<ProductImagePlaceholder />` with a real `<Image>` component:

```tsx
import Image from "next/image";

// Replace the placeholder with:
<Image
  src="/product.jpg"           // Put your image in /public/product.jpg
  alt="Minimal Anime Ocean Desk Mat"
  fill
  className="object-cover"
  priority
/>
```

Or use a hosted image URL (add the domain to `next.config.js` → `images.remotePatterns`).

---

## Customization

| What | Where |
|---|---|
| Product name / price | `src/app/api/create-checkout-session/route.ts` → `PRODUCT` constant |
| Printify product/variant IDs | `src/lib/printify.ts` → top of file |
| Shipping countries | `create-checkout-session/route.ts` → `allowed_countries` array |
| Colors / fonts | `tailwind.config.ts` + `src/app/globals.css` |
| Hero text | `src/components/Hero.tsx` |
| Product features list | `src/components/ProductSection.tsx` → `FEATURES` array |

---

## Error Handling

- **Checkout errors** — shown inline below the Buy button
- **Webhook errors** — logged to console; returns `200` to Stripe to prevent retries
- **Printify failures** — logged with session ID for manual fulfillment fallback
- Add [Sentry](https://sentry.io) or similar for production error tracking

---

## License

MIT
