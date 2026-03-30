"use client";

import { useState } from "react";

type BuyButtonProps = {
  label?: string;
  className?: string;
  onCheckout?: () => void;
};

export default function BuyButton({
  label = "Buy Now — $29.99",
  className = "",
  onCheckout,
}: BuyButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      onCheckout?.();
      window.location.assign(data.url);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Checkout error";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={`px-6 py-3 font-mono text-sm uppercase tracking-wider text-white bg-wave-400 hover:bg-wave-500 rounded-md transition ${className}`}
      >
        {loading ? "Processing..." : label}
      </button>
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  );
}