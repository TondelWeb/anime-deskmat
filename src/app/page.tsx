import type { Metadata } from "next";
import Hero from "@/components/Hero";
import ProductSection from "@/components/ProductSection";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Thorfinn Anime Desk Mat | TondelWeb",
  description: "Premium anime-inspired desk mat with smooth micro-weave surface, anti-slip rubber base, and stitched edges. Inspired by Vinland Saga. Available in 3 sizes.",
  openGraph: {
    title: "Thorfinn Anime Desk Mat | TondelWeb",
    description: "Minimalist warrior desk mat for clean, focused setups.",
    images: [
      {
        url: "https://images.printify.com/mockup/69c847c327ac868284004850/65240/6570/desk-mat.jpg",
        width: 1200,
        height: 630,
        alt: "Thorfinn Anime Desk Mat",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Thorfinn Anime Desk Mat | TondelWeb",
    description: "Premium anime desk mat. Anti-slip, micro-weave, 3 sizes.",
  },
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-ink-950 overflow-x-hidden">
      {/* ── Hero: full-width opening impression ── */}
      <Hero />

      {/* ── Product: details + buy CTA ── */}
      <ProductSection />

      {/* ── Footer ── */}
      <Footer />
    </main>
  );
}
