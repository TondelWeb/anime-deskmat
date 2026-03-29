import BuyButton from "./BuyButton";

const FEATURES = [
  { icon: "◈", label: "900 × 400mm Extended Size" },
  { icon: "◈", label: "Smooth Micro-Weave Surface" },
  { icon: "◈", label: "Anti-Slip Rubber Base" },
  { icon: "◈", label: "Stitched Edge Finish" },
  { icon: "◈", label: "Water-Resistant Coating" },
  { icon: "◈", label: "Minimal Anime Ocean Print" },
];

// SVG placeholder that mimics an anime ocean desk mat preview
function ProductImagePlaceholder() {
  return (
    <svg
      viewBox="0 0 800 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <defs>
        <linearGradient id="bgGrad" x1="0" y1="0" x2="800" y2="500" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0a0a1a" />
          <stop offset="40%" stopColor="#0d1120" />
          <stop offset="100%" stopColor="#080812" />
        </linearGradient>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="260" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#040410" />
          <stop offset="100%" stopColor="#0a1535" />
        </linearGradient>
        <linearGradient id="seaGrad" x1="0" y1="260" x2="0" y2="500" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0c1f3a" />
          <stop offset="100%" stopColor="#060d1a" />
        </linearGradient>
        <radialGradient id="moonGlow" cx="600" cy="100" r="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#e8f4f8" stopOpacity="1" />
          <stop offset="40%" stopColor="#c8e8f5" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#7eb8d4" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="moonBody" cx="600" cy="100" r="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f5f9fc" />
          <stop offset="100%" stopColor="#c8dce8" />
        </radialGradient>
        <filter id="blur4" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
        <filter id="blur2">
          <feGaussianBlur stdDeviation="2" />
        </filter>
        <clipPath id="matBounds">
          <rect x="0" y="0" width="800" height="500" rx="6" />
        </clipPath>
      </defs>

      <g clipPath="url(#matBounds)">
        {/* Background base */}
        <rect width="800" height="500" fill="url(#bgGrad)" />

        {/* Sky */}
        <rect width="800" height="275" fill="url(#skyGrad)" />

        {/* Stars */}
        {[
          [80, 40], [140, 25], [220, 55], [310, 30], [380, 15], [450, 45],
          [520, 28], [680, 38], [730, 60], [760, 22], [50, 70], [170, 80],
          [290, 65], [420, 78], [555, 52], [640, 70], [710, 42], [30, 120],
          [105, 105], [200, 130], [340, 95], [470, 115], [590, 88], [695, 100],
          [750, 130], [155, 155], [270, 170], [405, 148], [535, 162], [660, 145]
        ].map(([cx, cy], i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={i % 5 === 0 ? 1.2 : 0.7}
            fill="white"
            opacity={0.4 + (i % 4) * 0.15}
          />
        ))}

        {/* Moon glow */}
        <circle cx="600" cy="100" r="80" fill="url(#moonGlow)" opacity="0.6" />
        {/* Moon body */}
        <circle cx="600" cy="100" r="34" fill="url(#moonBody)" />
        {/* Moon crater details */}
        <circle cx="612" cy="88" r="4" fill="#b8cdd8" opacity="0.5" />
        <circle cx="590" cy="108" r="6" fill="#b0c8d5" opacity="0.4" />
        <circle cx="610" cy="115" r="3" fill="#b8cdd8" opacity="0.35" />

        {/* Moonlight reflection on water (vertical shimmer) */}
        <rect x="570" y="270" width="60" height="230" fill="url(#moonGlow)" opacity="0.15" filter="url(#blur4)" />
        <rect x="590" y="260" width="20" height="240" fill="#c8e8f5" opacity="0.08" filter="url(#blur2)" />

        {/* Distant mountain / island silhouette */}
        <path
          d="M 0 240 L 80 160 L 160 200 L 240 130 L 320 185 L 400 275 L 0 275 Z"
          fill="#06091a"
          opacity="0.9"
        />
        {/* Distant island right */}
        <path
          d="M 700 275 L 760 220 L 800 245 L 800 275 Z"
          fill="#06091a"
          opacity="0.8"
        />

        {/* Sea */}
        <rect y="270" width="800" height="230" fill="url(#seaGrad)" />

        {/* Wave lines — layered for depth */}
        {/* Far waves */}
        {[280, 295, 310, 325].map((y, i) => (
          <path
            key={`fw${i}`}
            d={`M 0 ${y} Q 100 ${y - 6} 200 ${y} Q 300 ${y + 6} 400 ${y} Q 500 ${y - 6} 600 ${y} Q 700 ${y + 6} 800 ${y}`}
            stroke="#1e3a5a"
            strokeWidth="0.75"
            fill="none"
            opacity={0.5 - i * 0.08}
          />
        ))}
        {/* Mid waves */}
        {[340, 360, 380, 400].map((y, i) => (
          <path
            key={`mw${i}`}
            d={`M 0 ${y} Q 120 ${y - 9} 240 ${y} Q 360 ${y + 9} 480 ${y} Q 600 ${y - 9} 720 ${y} Q 760 ${y + 4} 800 ${y}`}
            stroke="#1e4060"
            strokeWidth="1"
            fill="none"
            opacity={0.5 - i * 0.06}
          />
        ))}
        {/* Foreground waves */}
        {[420, 450, 480].map((y, i) => (
          <path
            key={`nw${i}`}
            d={`M 0 ${y} Q 150 ${y - 14} 300 ${y} Q 450 ${y + 14} 600 ${y} Q 700 ${y - 10} 800 ${y}`}
            stroke="#2a5070"
            strokeWidth="1.5"
            fill="none"
            opacity={0.4 - i * 0.06}
          />
        ))}

        {/* Cherry blossom petals floating */}
        {[
          [120, 310, 8], [260, 295, 6], [400, 320, 7],
          [540, 305, 5], [680, 315, 9], [180, 370, 6],
          [340, 360, 8], [490, 355, 5], [620, 375, 7],
          [80, 430, 9], [220, 420, 6], [360, 440, 7],
          [500, 425, 5], [640, 435, 8], [730, 390, 6],
        ].map(([cx, cy, r], i) => (
          <g key={`p${i}`} transform={`translate(${cx}, ${cy}) rotate(${i * 37})`}>
            <ellipse rx={r as number} ry={(r as number) * 0.6} fill="#e89ab0" opacity={0.25 + (i % 3) * 0.1} />
          </g>
        ))}

        {/* Mat border / stitching */}
        <rect
          x="8" y="8" width="784" height="484"
          rx="4"
          stroke="rgba(90,158,190,0.25)"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="4 8"
        />

        {/* Brand watermark */}
        <text
          x="400"
          y="492"
          textAnchor="middle"
          fill="rgba(90,158,190,0.2)"
          fontSize="8"
          fontFamily="monospace"
          letterSpacing="6"
        >
          DESK MAT CO.
        </text>
      </g>
    </svg>
  );
}

export default function ProductSection() {
  return (
    <section
      id="product"
      className="relative bg-ink-900 py-24 md:py-32 px-6 overflow-hidden"
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* ── Product image ── */}
          <div className="order-1 lg:order-1">
            <div className="glow-border product-frame rounded-lg overflow-hidden aspect-[8/5] shadow-2xl shadow-black/60">
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
