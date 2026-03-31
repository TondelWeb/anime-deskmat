import { notFound } from "next/navigation";
import { products, getProductBySlug } from "@/data/products";
import ProductDetail from "@/components/ProductDetail";
import Footer from "@/components/Footer";
import Link from "next/link";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  if (!product) return {};
  return {
    title: `${product.title} | Tondel Mats`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.title,
      description: product.description.slice(0, 160),
      images: [{ url: product.images[0] }],
    },
  };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

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
        <Link
          href="/shop"
          className="font-mono text-xs tracking-widest text-wave-400/70 hover:text-wave-400 transition-colors duration-200 flex items-center gap-2"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          All Products
        </Link>
      </nav>

      {/* ── Product detail (client component for interactivity) ── */}
      <ProductDetail product={product} />

      <Footer />
    </main>
  );
}
