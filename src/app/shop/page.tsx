import Link from "next/link";
import { products } from "@/data/products";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Shop | Tondel Mats",
  description: "Premium anime desk mats for clean, focused setups.",
};

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-ink-950 overflow-x-hidden">
      {/* ── Nav ── */}
      <nav className="sticky top-0 z-20 bg-ink-950/90 backdrop-blur-sm border-b border-white/5 flex items-center justify-between px-8 py-5">
        <Link
          href="/"
          className="font-mono text-xs tracking-[0.3em] text-mist-600 uppercase hover:text-wave-400 transition-colors duration-200"
        >
          Tondel Mats
        </Link>
        <span className="font-mono text-xs tracking-widest text-mist-600 hidden sm:block">
          Free shipping over $50
        </span>
      </nav>

      {/* ── Header ── */}
      <section className="relative py-20 px-6 text-center overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-wave-600/6 blur-[120px]" />
        </div>

        <div className="relative z-10">
          <p className="font-mono text-xs tracking-[0.4em] text-wave-400/60 uppercase mb-5 animate-fade-up"
            style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
            Collection
          </p>
          <h1 className="font-display text-5xl md:text-7xl font-light text-mist-100 leading-none tracking-tight mb-4 animate-fade-up"
            style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
            All Products
          </h1>
          <div className="mx-auto w-20 h-px bg-gradient-to-r from-transparent via-wave-500/40 to-transparent animate-fade-in"
            style={{ animationDelay: "350ms", animationFillMode: "forwards" }} />
        </div>
      </section>

      {/* ── Product Grid ── */}
      <section className="px-6 pb-24 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {products.map((product) => {
            const lowestPrice = product.sizes[0].displayPrice;
            const firstImage = product.images[0];

            return (
              <Link
                key={product.slug}
                href={`/shop/${product.slug}`}
                className="group relative bg-ink-900 rounded-lg overflow-hidden border border-white/5 hover:border-wave-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-black/40"
              >
                {/* Product image */}
                <div className="aspect-[8/5] overflow-hidden bg-ink-800">
                  <img
                    src={firstImage}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>

                {/* Card content */}
                <div className="p-6">
                  <p className="font-mono text-[10px] tracking-[0.35em] text-wave-400/60 uppercase mb-2">
                    Desk Mat
                  </p>
                  <h2 className="font-display text-2xl font-light text-mist-100 leading-tight mb-2 group-hover:text-wave-400 transition-colors duration-200">
                    {product.title}
                  </h2>
                  {product.tagline && (
                    <p className="font-display text-base italic text-mist-600 font-light mb-4">
                      {product.tagline}
                    </p>
                  )}

                  <hr className="gradient-hr my-4" />

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-xs text-mist-600 tracking-widest uppercase mr-2">
                        From
                      </span>
                      <span className="font-mono text-lg text-mist-100 font-light">
                        {lowestPrice}
                      </span>
                    </div>
                    <span className="font-mono text-xs tracking-widest text-wave-400 flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
                      View Product
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <Footer />
    </main>
  );
}
