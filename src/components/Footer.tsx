import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-ink-950 py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link
          href="/"
          className="font-mono text-xs tracking-[0.3em] text-mist-600 uppercase hover:text-wave-400 transition-colors duration-200"
        >
          Tondel Mats
        </Link>

        <p className="font-mono text-[10px] text-mist-600/50 tracking-widest text-center">
          © {new Date().getFullYear()} Tondel Mats. All rights reserved.
        </p>

        <div className="flex gap-6">
          <Link
            href="/shop"
            className="font-mono text-[10px] text-mist-600 hover:text-wave-400 tracking-widest transition-colors duration-200"
          >
            Shop
          </Link>
          <a
            href="/privacy"
            className="font-mono text-[10px] text-mist-600 hover:text-wave-400 tracking-widest transition-colors duration-200"
          >
            Privacy
          </a>
          <a
            href="/terms"
            className="font-mono text-[10px] text-mist-600 hover:text-wave-400 tracking-widest transition-colors duration-200"
          >
            Terms
          </a>
          <a
            href="mailto:tondelweb@gmail.com"
            className="font-mono text-[10px] text-mist-600 hover:text-wave-400 tracking-widest transition-colors duration-200"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
