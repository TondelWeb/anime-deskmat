"use client";

import { useState } from "react";

interface BuyButtonProps {
  variant?: "primary" | "secondary";
  className?: string;
  label?: string;
  priceId: string;
  variantId: string;
  size: string;
}

export default function BuyButton({
  variant = "primary",
  className = "",
  label = "Buy Now",
  priceId,
  variantId,
  size,
}: BuyButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, variantId, size }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      window.location.assign(data.url);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Checkout error";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (variant === "secondary") {
    return (
      <div className={className}>
        <button
          type="button"
          onClick={handleClick}
          disabled={loading}
          className="w-full border border-wave-500/40 text-wave-400 hover:bg-wave-500/10 px-8 py-4 rounded-sm font-mono text-sm tracking-widest uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Redirecting…" : label}
        </button>
        {error && (
          <p className="mt-2 text-center text-xs text-red-400/80 font-mono">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="btn-pulse w-full bg-wave-500 hover:bg-wave-400 text-ink-950 px-8 py-4 rounded-sm font-mono text-sm tracking-widest uppercase font-medium transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle
                className="opacity-25"
                cx="12" cy="12" r="10"
                stroke="currentColor" strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Redirecting…
          </span>
        ) : (
          label
        )}
      </button>
      {error && (
        <p className="mt-3 text-center text-xs text-red-400/80 font-mono">{error}</p>
      )}
    </div>
  );
}
```

---
```
✅ File modified: src/components/BuyButton.tsx

✅ Fixed: body was sending {} — now sends { priceId, variantId, size }
✅ priceId drives correct Stripe price per size
✅ No payment link anywhere
✅ Dynamic checkout session used for all sizes

⚠️  Still required: replace the three placeholder priceIds in
    ProductSection.tsx with real Stripe price IDs:
    "price_12x18_REPLACE_ME"
    "price_12x22_REPLACE_ME"
    "price_16x32_REPLACE_ME"