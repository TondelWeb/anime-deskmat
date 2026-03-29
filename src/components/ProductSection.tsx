import BuyButton from "./BuyButton";

const FEATURES = [
  { icon: "◈", label: "900 × 400mm Extended Size" },
  { icon: "◈", label: "Smooth Micro-Weave Surface" },
  { icon: "◈", label: "Anti-Slip Rubber Base" },
  { icon: "◈", label: "Stitched Edge Finish" },
  { icon: "◈", label: "Water-Resistant Coating" },
  { icon: "◈", label: "Minimal Anime Ocean Print" },
];

const product = {
  title: "Minimal Anime Ocean Desk Mat",
  images: [
    {
      src: "https://images.printify.com/mockup/69c847c327ac868284004850/65240/6570/desk-mat.jpg?camera_label=front&t=1774824406643&s=500",
    },
  ],
  variants: [
    {
      id: "size-xl",
      price: 2999,
      images: [
        {
          src: "https://images.printify.com/mockup/69c847c327ac868284004850/65240/6570/desk-mat.jpg?camera_label=front&t=1774824406643&s=500",
        },
      ],
    },
  ],
};

const image =
  product.images?.[0]?.src ||
  product.variants?.[0]?.images?.[0]?.src ||
  "https://via.placeholder.com/300";

// Product image loaded from Printify URL
function ProductImagePlaceholder() {
  return (
    <div className="flex justify-center items-center w-full">
      <img
        src={image}
        alt={product.title}
        className="w-full max-w-[600px] h-auto object-contain"
      />
    </div>
  );
}

export default function ProductSection() {
  return (
    <section
      id="product"
      className="relative bg-ink-900 py-24 md:py-32 px-6 overflow-hidden max-w-6xl mx-auto"
    >
      {/* ── Section background glows ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-wave-600/4 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* ── Section label ── */}
        <p className="font-mono text-xs tracking-[0.4em] text-wave-400/60 uppercase mb-16 text-center">
          The Product
        </p>

        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-16 items-center">
          {/* ── Product image ── */}
          <div className="order-1 md:order-1 w-full flex justify-center">
            <div className="glow-border product-frame w-full rounded-lg overflow-hidden shadow-2xl shadow-black/60">
              <ProductImagePlaceholder />
            </div>

            {/* Dimensions label */}
            <p className="mt-4 text-center font-mono text-xs text-mist-600 tracking-widest">
              900mm × 400mm × 4mm
            </p>
          </div>

          {/* ── Product details ── */}
          <div className="order-2 lg:order-2 flex flex-col">
            {/* Product name */}
            <h2 className="font-display text-4xl md:text-5xl font-light text-mist-100 leading-tight mb-3">
              Minimal Anime
              <br />
              <span className="italic text-wave-400">Ocean Desk Mat</span>
            </h2>

            {/* Thin rule */}
            <hr className="gradient-hr my-6" />

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-mono text-4xl text-mist-100 font-light tracking-tight">
                $29.99
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
              A premium extended mouse pad designed for clean, aesthetic desk
              setups. Smooth micro-weave surface for precise tracking, a
              non-slip rubber base that stays put, and a minimal anime ocean
              scene that brings calm focus to your workspace.
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

            {/* Buy button */}
            <BuyButton label="Buy Now — $29.99" className="mb-4" />

            {/* Trust signals */}
            <div className="flex items-center justify-center gap-6 mt-4">
              {[
                "Secure Checkout",
                "30-Day Returns",
                "Ships Worldwide",
              ].map((t) => (
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
