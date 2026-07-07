import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon-48.png",
  },
  openGraph: {
    title: "Dedco — Marché de l'Aménagement Intérieur",
    description:
      "Créations artisanales béninoises, designers d'espace et inspirations déco.",
    siteName: "Dedco",
    type: "website",
    locale: "fr_FR",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#BF793B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Formatage automatique des numéros de téléphone (Bénin = 10 chiffres)
              document.addEventListener('input', function(e) {
                const target = e.target;
                if (target.tagName === 'INPUT' && target.dataset.phoneFormat) {
                  const format = target.dataset.phoneFormat;
                  let digits = target.value.replace(/\\D/g, '');
                  const maxDigits = format.split('X').length - 1;
                  digits = digits.slice(0, maxDigits);
                  let result = '';
                  let di = 0;
                  for (let i = 0; i < format.length && di < digits.length; i++) {
                    if (format[i] === 'X') { result += digits[di]; di++; }
                    else { result += format[i]; }
                  }
                  target.value = result;
                }
              });
            `,
          }}
        />
      </head>
      <body
        className={`${jakarta.variable} antialiased`}
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
