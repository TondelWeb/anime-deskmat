"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 20;
      const y = (clientY / innerHeight - 0.5) * 20;

      const glow = hero.querySelector<HTMLElement>(".hero-glow");
      if (glow) {
        glow.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-ink-950"
    >
      {/* ── Ambient background glows ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="hero-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-wave-600/8 blur-[140px] transition-transform duration-700 ease-out" />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-sakura-400/5 blur-[100px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[200px] bg-gradient-to-t from-ink-950 to-transparent" />
      </div>

      {/* ── Decorative grid lines ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(90,158,190,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(90,158,190,1) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* ── Nav bar ── */}
      <nav className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-8 py-6">
        <span className="font-mono text-xs tracking-[0.3em] text-mist-600 uppercase">
          Tondel Mats
        </span>
        <div className="flex items-center gap-6">
          <span className="font-mono text-xs tracking-widest text-mist-600 hidden sm:block">
            Free shipping over $50
          </span>
          <Link
            href="/shop"
            className="font-mono text-xs tracking-widest text-wave-400 border border-wave-500/30 px-4 py-2 rounded-sm hover:bg-wave-500/10 transition-all duration-300"
          >
            Shop
          </Link>
        </div>
      </nav>

      {/* ── Hero content ── */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <p
          className="font-mono text-xs tracking-[0.4em] text-wave-400/70 uppercase mb-8 animate-fade-up"
          style={{ animationDelay: "100ms", animationFillMode: "forwards" }}
        >
          Premium Extended Mouse Pad
        </p>

        <h1
          className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-light text-mist-100 leading-none tracking-tight mb-6 animate-fade-up"
          style={{ animationDelay: "200ms", animationFillMode: "forwards" }}
        >
          Minimal Anime
          <br />
          <em className="shimmer-text not-italic">Desk Mats</em>
        </h1>

        <div
          className="mx-auto w-20 h-px bg-gradient-to-r from-transparent via-wave-500/40 to-transparent mb-6 animate-fade-in"
          style={{ animationDelay: "350ms", animationFillMode: "forwards" }}
        />

        <p
          className="font-display text-2xl md:text-3xl font-light italic text-mist-400 mb-12 animate-fade-up"
          style={{ animationDelay: "400ms", animationFillMode: "forwards" }}
        >
          Clean. Calm. Focused.
        </p>

        <div
          className="animate-fade-up"
          style={{ animationDelay: "550ms", animationFillMode: "forwards" }}
        >
          <Link
            href="/shop"
            className="btn-pulse relative inline-flex items-center gap-3 bg-wave-500 hover:bg-wave-400 text-ink-950 px-10 py-4 rounded-sm font-mono text-sm tracking-widest uppercase transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            Shop Now
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* ── Decorative floating mat silhouette ── */}
      <div
        className="absolute bottom-28 left-1/2 -translate-x-1/2 w-[380px] sm:w-[500px] md:w-[640px] animate-float opacity-20 pointer-events-none"
        aria-hidden="true"
      >
        <svg viewBox="0 0 640 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect
            x="20"
            y="40"
            width="600"
            height="130"
            rx="8"
            fill="url(#matGrad)"
            stroke="rgba(90,158,190,0.4)"
            strokeWidth="1"
          />
          {[60, 90, 120, 150].map((y, i) => (
            <path
              key={i}
              d={`M 80 ${y} Q 200 ${y - 15} 320 ${y} Q 440 ${y + 15} 560 ${y}`}
              stroke="rgba(90,158,190,0.3)"
              strokeWidth="0.75"
              fill="none"
            />
          ))}
          <defs>
            <linearGradient id="matGrad" x1="20" y1="40" x2="620" y2="170" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0a0a1a" />
              <stop offset="50%" stopColor="#111128" />
              <stop offset="100%" stopColor="#0a0a1a" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* ── Scroll hint ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-scroll-hint">
        <span className="font-mono text-[10px] tracking-widest text-mist-600 uppercase">
          Scroll
        </span>
        <div className="w-px h-8 bg-gradient-to-b from-mist-600/50 to-transparent" />
      </div>
    </section>
  );
}
