export default function Footer() {
  return (
    <footer className="bg-ink-950 py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-mono text-xs tracking-[0.3em] text-mist-600 uppercase">
          Desk Mat Co.
        </span>

        <p className="font-mono text-[10px] text-mist-600/50 tracking-widest text-center">
          © {new Date().getFullYear()} Desk Mat Co. All rights reserved.
        </p>

        <div className="flex gap-6">
          {["Privacy", "Terms", "Contact"].map((link) => (
            <a
              key={link}
              href="#"
              className="font-mono text-[10px] text-mist-600 hover:text-wave-400 tracking-widest transition-colors duration-200"
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
