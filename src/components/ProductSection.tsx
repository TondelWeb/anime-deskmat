"use client";

import { useState } from "react";
import BuyButton from "./BuyButton";

// ─── Variant data ─────────────────────────────────────────────────────────────
const productVariants: Record<string, { label: string; price: number; priceId: string; variantId: string; images: string[] }> = {
  "12x18": {
    label: '12" × 18"',
    price: 24.99,
    priceId: "price_REPLACE_ME",
    variantId: "15871701174317138608",
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
    priceId: "price_REPLACE_ME",
    variantId: "14263994076559358649",
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
    priceId: "price_REPLACE_ME",
    variantId: "19248939720562422893",
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
  const [selectedSize, setSelectedSize] = useState("12x18");
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const currentVariant = productVariants[selectedSize];
  const currentImages = currentVariant.images;
  const mainImage = currentImages[activeImageIndex] ?? currentImages[0];

  function handleSizeSelect(key: string) {
    setSelectedSize(key);
    setActiveImageIndex(0);
  }

  return (
    <section
      id="product"
      className="relative bg-ink-900 py-24 md:py-32 px-6 overflow-hidden max-w-6xl mx-auto"
    >
      {/* ── Section background glow ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-wave-600/4 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* ── Section label ── */}
        <p className="font-mono text-xs tracking-[0.4em] text-wave-400/60 uppercase mb-16 text-center">
          The Product
        </p>

        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-16 items-center">

          {/* ── LEFT: Image column ── */}
          <div className="order-1 md:order-1 w-full flex flex-col items-center">

            {/* Main image */}
            <div className="flex justify-center items-center w-full">
              <img
                src={mainImage}
                alt={currentVariant.label}
                className="w-full max-w-[600px] h-auto object-contain drop-shadow-2xl"
              />
            </div>

            {/* Thumbnail strip */}
            <div className="flex gap-3 mt-6">
              {currentImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`w-16 h-16 rounded-sm overflow-hidden border transition-colors duration-150 ${
                    index === activeImageIndex
                      ? "border-wave-400"
                      : "border-mist-600/30 hover:border-mist-400/60"
                  }`}
                  aria-label={`View image ${index + 1}`}
                >
                  <img
                    src={img}
                    alt={`${currentVariant.label} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Size label under image */}
            <p className="mt-4 text-center font-mono text-xs text-mist-600 tracking-widest">
              {currentVariant.label}
            </p>
          </div>

          {/* ── RIGHT: Details column ── */}
          <div className="order-2 lg:order-2 flex flex-col">

            {/* Product name */}
            <h2 className="font-display text-4xl md:text-5xl font-light text-mist-100 leading-tight mb-3">
              Minimal Anime
              <br />
              <span className="italic text-wave-400">Thorfinn Desk Mat</span>
            </h2>

            {/* Thin rule */}
            <hr className="gradient-hr my-6" />

            {/* Price — dynamic */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-mono text-4xl text-mist-100 font-light tracking-tight">
                ${currentVariant.price.toFixed(2)}
              </span>
              <span className="font-mono text-xs text-mist-600 tracking-widest uppercase">
                USD
              </span>
              <span className="ml-auto font-mono text-xs text-wave-400/70 tracking-widest border border-wave-500/20 px-3 py-1 rounded-sm">
                Free Shipping
              </span>
            </div>

            {/* Size selector */}
            <div className="mb-6">
              <p className="font-mono text-xs text-mist-600 tracking-widest uppercase mb-3">
                Size
              </p>
              <div className="flex gap-3 flex-wrap">
                {Object.entries(productVariants).map(([key, variant]) => (
                  <button
                    key={key}
                    onClick={() => handleSizeSelect(key)}
                    className={`px-4 py-2 font-mono text-xs tracking-widest transition-colors duration-150 border rounded-sm ${
                      selectedSize === key
                        ? "border-wave-400 text-wave-400 bg-wave-400/10"
                        : "border-mist-600/40 text-mist-600 hover:border-mist-400 hover:text-mist-400"
                    }`}
                  >
                    {variant.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
             <p className="font-body text-mist-400 font-light leading-relaxed text-base mb-8">
              A premium extended mouse pad inspired by a minimalist warrior
              aesthetic. Designed for clean, focused desk setups, it features a
              smooth micro-weave surface for precise tracking and a non-slip
              rubber base for stability. The artwork captures a calm yet powerful
              moment, bringing a subtle anime-inspired atmosphere to your
              workspace.
            </p>

            {/* Feature list */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-10">
              {FEATURES.map((f) => (
                <li
                  key={f.label}
                  className="flex items-center gap-2 font-mono text-xs text-mist-600 tracking-wide"
                >
                  <span className="text-wave-400/50">{f.icon}</span>
                  {f.label}
                </li>
              ))}
            </ul>

            {/* Buy button — dynamic label */}
            <BuyButton
              label={`Buy Now — $${currentVariant.price.toFixed(2)}`}
              priceId={currentVariant.priceId}
              variantId={currentVariant.variantId}
              size={currentVariant.label}
              className="mb-4"
            />

            {/* Trust signals */}
            <div className="flex items-center justify-center gap-6 mt-4">
              {["Secure Checkout", "30-Day Returns", "Ships Worldwide"].map((t) => (
                <span
                  key={t}
                  className="font-mono text-[10px] text-mist-600 tracking-widest"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom decorative rule ── */}
        <hr className="gradient-hr mt-24" />
      </div>
    </section>
  );
}