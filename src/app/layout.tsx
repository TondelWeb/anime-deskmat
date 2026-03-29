import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";

// Display font — editorial, elegant, anime-adjacent
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

// Body font — clean, modern, readable
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
});

// Mono font — for price / labels
const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Minimal Anime Ocean Desk Mat — Clean. Calm. Focused.",
  description:
    "A premium extended mouse pad designed for clean, aesthetic desk setups. Smooth surface, non-slip base, minimal anime ocean design.",
  openGraph: {
    title: "Minimal Anime Ocean Desk Mat",
    description: "Clean. Calm. Focused. Premium desk mat for aesthetic setups.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${cormorant.variable} ${dmSans.variable} ${dmMono.variable} font-body bg-ink-950 text-mist-100 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
