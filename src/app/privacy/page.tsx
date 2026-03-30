import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-ink-950 py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="font-mono text-xs text-mist-600 hover:text-wave-400 tracking-widest transition-colors duration-200 mb-8 inline-block"
        >
          ← Back
        </Link>
        <iframe
          src="https://app.termly.io/document/privacy-policy/f24512b9-c66b-458e-b7d6-97952dc7d047"
          width="100%"
          height="800px"
          style={{ border: "none" }}
        />
      </div>
    </main>
  );
}
