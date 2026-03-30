import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-ink-950 py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="font-mono text-xs text-mist-600 hover:text-wave-400 tracking-widest transition-colors duration-200 mb-8 inline-block"
        >
          ← Back
        </Link>

        <h1 className="font-display text-4xl font-light text-mist-100 mb-2">
          Terms of Service
        </h1>
        <p className="font-mono text-xs text-mist-600 tracking-widest mb-12">
          Last updated: March 2026
        </p>

        <div className="flex flex-col gap-10">
          <section>
            <h2 className="font-mono text-xs tracking-[0.3em] text-wave-400/70 uppercase mb-3">
              Overview
            </h2>
            <p className="font-body text-mist-400 font-light leading-relaxed">
              TondelWeb operates this store. By purchasing you agree to these terms.
            </p>
          </section>

          <section>
            <h2 className="font-mono text-xs tracking-[0.3em] text-wave-400/70 uppercase mb-3">
              Products
            </h2>
            <p className="font-body text-mist-400 font-light leading-relaxed">
              All desk mats are print-on-demand and made to order. Colors may vary slightly from screen to product.
            </p>
          </section>

          <section>
            <h2 className="font-mono text-xs tracking-[0.3em] text-wave-400/70 uppercase mb-3">
              Payments
            </h2>
            <p className="font-body text-mist-400 font-light leading-relaxed">
              All transactions are processed securely by Stripe. We do not store payment information.
            </p>
          </section>

          <section>
            <h2 className="font-mono text-xs tracking-[0.3em] text-wave-400/70 uppercase mb-3">
              Shipping
            </h2>
            <p className="font-body text-mist-400 font-light leading-relaxed">
              Orders ship within 3–7 business days after production. Delivery takes 7–14 business days. We are not responsible for carrier delays.
            </p>
          </section>

          <section>
            <h2 className="font-mono text-xs tracking-[0.3em] text-wave-400/70 uppercase mb-3">
              Returns
            </h2>
            <p className="font-body text-mist-400 font-light leading-relaxed">
              We accept returns within 30 days of delivery for damaged or defective items. Contact us at{" "}
              <a
                href="mailto:tondelweb@gmail.com"
                className="text-wave-400 hover:underline"
              >
                tondelweb@gmail.com
              </a>{" "}
              to initiate a return.
            </p>
          </section>

          <section>
            <h2 className="font-mono text-xs tracking-[0.3em] text-wave-400/70 uppercase mb-3">
              Contact
            </h2>
            <p className="font-body text-mist-400 font-light leading-relaxed">
              For questions email{" "}
              <a
                href="mailto:tondelweb@gmail.com"
                className="text-wave-400 hover:underline"
              >
                tondelweb@gmail.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
