import Hero from "@/components/Hero";
import ProductSection from "@/components/ProductSection";
import Footer from "@/components/Footer";

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
