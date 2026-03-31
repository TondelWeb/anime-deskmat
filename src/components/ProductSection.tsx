import Link from "next/link";
import { getProductBySlug } from "@/data/products";
import { useState } from "react";
import Image from "next/image";
import BuyButton from "./BuyButton";

// ─── Variant data ─────────────────────────────────────────────────────────────
const productVariants: Record<string, { label: string; price: number; priceId: string; variantId: string; images: string[] }> = {
  "12x18": {
    label: '12" × 18"',
    price: 24.99,
    priceId: "price_1TGYBYAbBgE9tbEaOjUPusgN",
    variantId: "65240",
    images: [
      "https://images.printify.com/mockup/69c847c327ac868284004850/65240/6570/desk-mat.jpg",
      "https://images.printify.com/mockup/69c847c327ac868284004850/65240/6576/desk-mat.jpg",
      "https://images.printify.com/mockup/69c847c327ac868284004850/65240/6574/desk-mat.jpg",
      "https://images.printify.com/mockup/69c847c327ac868284004850/65240/6572/desk-mat.jpg",
    ],
  },
  "12x22": {
    label: '12" × 22"',
    price: 29.99,
    priceId: "price_1TGYD0AbBgE9tbEaSzsqvO8W",
    variantId: "65241",
    images: [
      "https://images.printify.com/mockup/69c847c327ac868284004850/65241/6569/desk-mat.jpg",
      "https://images.printify.com/mockup/69c847c327ac868284004850/65241/6575/desk-mat.jpg",
      "https://images.printify.com/mockup/69c847c327ac868284004850/65241/6573/desk-mat.jpg",
      "https://images.printify.com/mockup/69c847c327ac868284004850/65241/6571/desk-mat.jpg",
    ],
  },
  "16x32": {
    label: '16" × 32"',
    price: 32.99,
    priceId: "price_1TGYEBAbBgE9tbEaL2yIVaXn",
    variantId: "72580",
    images: [
      "https://images.printify.com/mockup/69c847c327ac868284004850/72580/16170/desk-mat.jpg",
      "https://images.printify.com/mockup/69c847c327ac868284004850/72580/16173/desk-mat.jpg",
      "https://images.printify.com/mockup/69c847c327ac868284004850/72580/16172/desk-mat.jpg",
      "https://images.printify.com/mockup/69c847c327ac868284004850/72580/16171/desk-mat.jpg",
    ],
  },
};

const FEATURES = [
  { icon: "◈", label: "Smooth Micro-Weave Surface" },
  { icon: "◈", label: "Anti-Slip Rubber Base" },
  { icon: "◈", label: "Stitched Edge Finish" },
  { icon: "◈", label: "Water-Resistant Coating" },
  { icon: "◈", label: "Minimal Warrior Print" },
  { icon: "◈", label: "Multiple Size Options" },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function ProductSection() {
  const product = getProductBySlug("thorfinn-mat")!;
  const featuredImage = product.images[0];

  return (
    <section
      id="product"
      className="relative bg-ink-900 py-24 md:py-32 px-6 overflow-hidden"
    >
      {/* ── Section background glow ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-wave-600/4 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* ── Section label ── */}
        <p className="font-mono text-xs tracking-[0.4em] text-wave-400/60 uppercase mb-16 text-center">
          Featured Product
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* ── Product image ── */}
          <div className="order-1 lg:order-1">
            <div className="glow-border product-frame rounded-lg overflow-hidden aspect-[8/5] shadow-2xl shadow-black/60 bg-ink-800">
              <img
                src={featuredImage}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>

            <p className="mt-4 text-center font-mono text-xs text-mist-600 tracking-widest">
              Multiple sizes available
            </p>
          </div>

          {/* ── Product details ── */}
          <div className="order-2 lg:order-2 flex flex-col">
            {/* Product name */}
            <h2 className="font-display text-4xl md:text-5xl font-light text-mist-100 leading-tight mb-3">
              {product.title}
            </h2>

            {product.tagline && (
              <p className="font-display text-xl italic text-mist-400 font-light mb-3">
                {product.tagline}
              </p>
            )}

            {/* Thin rule */}
            <hr className="gradient-hr my-6" />

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-mono text-4xl text-mist-100 font-light tracking-tight">
                {product.sizes[1].displayPrice}
              </span>
              <span className="font-mono text-xs text-mist-600 tracking-widest uppercase">
                USD
              </span>
              <span className="ml-auto font-mono text-xs text-wave-400/70 tracking-widest border border-wave-500/20 px-3 py-1 rounded-sm">
                Free Shipping
              </span>
            </div>

            {/* Description */}
            <p className="font-body text-mist-400 font-light leading-relaxed text-base mb-8">
              {product.description}
            </p>

            {/* Feature list */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-10">
              {product.features.map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-2 font-mono text-xs text-mist-600 tracking-wide"
                >
                  <span className="text-wave-400/50">◈</span>
                  {f}
                </li>
              ))}
            </ul>

            {/* CTA — links to product page */}
            <Link
              href={`/shop/${product.slug}`}
              className="btn-pulse w-full bg-wave-500 hover:bg-wave-400 text-ink-950 px-8 py-4 rounded-sm font-mono text-sm tracking-widest uppercase font-medium transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] text-center mb-4"
            >
              View Product →
            </Link>

            {/* Trust signals */}
            <div className="flex items-center justify-center gap-6 mt-4">
              {["Secure Checkout", "30-Day Returns", "Ships Worldwide"].map((t) => (
                <span key={t} className="font-mono text-[10px] text-mist-600 tracking-widest">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Browse all ── */}
        <div className="mt-16 text-center">
          <Link
            href="/shop"
            className="font-mono text-xs tracking-widest text-wave-400/70 hover:text-wave-400 transition-colors duration-200 border border-wave-500/20 px-6 py-3 rounded-sm hover:border-wave-500/40"
          >
            Browse All Products →
          </Link>
        </div>

        {/* ── Bottom decorative rule ── */}
        <hr className="gradient-hr mt-16" />
      </div>
    </section>
  );
}
