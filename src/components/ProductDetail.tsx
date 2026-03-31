"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product } from "@/data/products";
import BuyButton from "./BuyButton";

export default function ProductDetail({ product }: { product: Product }) {
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const selectedSize = product.sizes[selectedSizeIndex];
  const activeImages = selectedSize.images ?? product.images;
  const mainImage = activeImages[selectedImageIndex] ?? activeImages[0];

  function handleSizeChange(index: number) {
    setSelectedSizeIndex(index);
    setSelectedImageIndex(0); // Reset to first image when size changes
  }

  return (
    <section className="relative bg-ink-950 py-16 md:py-24 px-6 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-wave-600/5 blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Back link */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 font-mono text-xs tracking-widest text-mist-600 hover:text-wave-400 transition-colors duration-200 mb-12"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          All Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* ── Image Gallery ── */}
          <div className="order-1">
            {/* Main image */}
            <div className="glow-border rounded-lg overflow-hidden aspect-[8/5] shadow-2xl shadow-black/60 bg-ink-900">
              <img
                src={mainImage}
                alt={`${product.title} — ${selectedSize.label}`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnails */}
            {activeImages.length > 1 && (
              <div className="mt-4 flex gap-3">
                {activeImages.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImageIndex(i)}
                    className={`flex-1 aspect-[8/5] rounded overflow-hidden border transition-all duration-200 ${
                      i === selectedImageIndex
                        ? "border-wave-500/60 opacity-100"
                        : "border-white/10 opacity-40 hover:opacity-70"
                    }`}
                  >
                    <img
                      src={src}
                      alt={`${product.title} view ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product Info ── */}
          <div className="order-2 flex flex-col">
            {/* Label */}
            <p className="font-mono text-xs tracking-[0.4em] text-wave-400/60 uppercase mb-4">
              Desk Mat
            </p>

            {/* Title */}
            <h1 className="font-display text-4xl md:text-5xl font-light text-mist-100 leading-tight mb-3">
              {product.title}
            </h1>

            {/* Tagline */}
            {product.tagline && (
              <p className="font-display text-xl italic text-mist-400 font-light mb-6">
                {product.tagline}
              </p>
            )}

            <hr className="gradient-hr mb-6" />

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-mono text-4xl text-mist-100 font-light tracking-tight">
                {selectedSize.displayPrice}
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

            {/* Features */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
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

            {/* Size selector */}
            <div className="mb-8">
              <p className="font-mono text-xs tracking-widest text-mist-600 uppercase mb-3">
                Size
              </p>
              <div className="flex gap-3 flex-wrap">
                {product.sizes.map((size, i) => (
                  <button
                    key={size.label}
                    onClick={() => handleSizeChange(i)}
                    className={`font-mono text-xs tracking-widest px-4 py-2 rounded-sm border transition-all duration-200 ${
                      i === selectedSizeIndex
                        ? "bg-wave-500/15 border-wave-500/60 text-wave-400"
                        : "border-white/10 text-mist-600 hover:border-white/20 hover:text-mist-400"
                    }`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Buy button */}
            <BuyButton
              priceId={selectedSize.priceId}
              label={`Buy Now — ${selectedSize.displayPrice}`}
              className="mb-4"
            />

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

        <hr className="gradient-hr mt-24" />
      </div>
    </section>
  );
}
