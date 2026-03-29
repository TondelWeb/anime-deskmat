import Link from "next/link";

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-ink-950 flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* ── Background ambient glow ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-wave-600/5 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-sakura-400/5 blur-[80px]" />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 text-center max-w-lg animate-fade-up">
        {/* Checkmark icon */}
        <div className="mx-auto mb-8 w-20 h-20 rounded-full border border-wave-500/30 flex items-center justify-center bg-wave-500/5">
          <svg
            className="w-10 h-10 text-wave-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>

        {/* Headline */}
        <h1 className="font-display text-5xl md:text-6xl font-light text-mist-100 mb-4 tracking-tight">
          Order Confirmed
        </h1>

        {/* Thin divider */}
        <div className="mx-auto w-16 h-px bg-gradient-to-r from-transparent via-wave-500/50 to-transparent mb-6" />

        {/* Subtext */}
        <p className="font-body text-mist-400 text-lg font-light leading-relaxed mb-2">
          Your desk mat will be shipped soon.
        </p>
        <p className="font-body text-mist-600 text-sm font-light">
          Check your email for order details and tracking information.
        </p>

        {/* Back to home */}
        <Link
          href="/"
          className="inline-block mt-10 px-8 py-3 text-sm font-mono tracking-widest uppercase text-mist-400 border border-mist-600/30 rounded-sm hover:border-wave-500/40 hover:text-wave-400 transition-all duration-300"
        >
          Back to Home
        </Link>
      </div>

      {/* ── Order number label ── */}
      <p className="absolute bottom-8 font-mono text-xs text-mist-600/50 tracking-widest">
        THANK YOU FOR YOUR ORDER
      </p>
    </main>
  );
}
