import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Dedco — Marché de l'Aménagement Intérieur Béninois",
  description:
    "Découvrez des créations uniques fabriquées à la main par les meilleurs artisans béninois. Du wax au bois iroko, transformez votre espace en œuvre d'art.",
  keywords: [
    "Dedco",
    "décoration",
    "Bénin",
    "artisanat",
    "aménagement intérieur",
    "wax",
    "bois iroko",
    "designers africains",
  ],
  authors: [{ name: "Dedco" }],
  openGraph: {
    title: "Dedco — Marché de l'Aménagement Intérieur",
    description:
      "Créations artisanales béninoises, designers d'espace et inspirations déco.",
    siteName: "Dedco",
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${fraunces.variable} ${jakarta.variable} antialiased`}
        style={{
          backgroundColor: "var(--bg-cream)",
          color: "var(--text-1)",
        }}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
