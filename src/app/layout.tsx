import type { Metadata, Viewport } from "next";
import { Source_Sans_3, Suwannaphum } from "next/font/google";
import "./globals.css";
import { ConditionalHeader } from "@/components/layout/conditional-header";
import { SiteFooter } from "@/components/layout/site-footer";

// Only the weights the UI actually uses. A grep across src/ finds exactly four
// font-weight utilities in play — normal (400), medium (500), semibold (600)
// and bold (700) — so the 200/300 cuts here were pure download.
const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-dhinimex-sans",
});

// Khmer glyph coverage makes this font heavy, and it is only rendered when the
// visitor switches to kh (the default is en). Keep two weights and let the
// browser pull it on demand instead of preloading it for every English visit.
const suwannaphum = Suwannaphum({
  subsets: ["khmer"],
  weight: ["400", "700"],
  display: "swap",
  preload: false,
  variable: "--font-suwannaphum",
});

const siteName = "Dhinimex Co., LTD";
const siteDescription =
  "Dhinimex delivers electrical, water supply, and engineering solutions with 21+ years of experience across Cambodia.";
const siteUrl = "https://dhinimex.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: "%s | Dhinimex",
    default: siteName,
  },
  description: siteDescription,
  openGraph: {
    title: siteName,
    description: siteDescription,
    url: siteUrl,
    siteName,
    type: "website",
    locale: "en_US",
  },
};

export const viewport: Viewport = {
  themeColor: "#2e388c",
};

import { LanguageProvider } from "@/lib/i18n";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body
        className={`${sourceSans.variable} ${suwannaphum.variable} overflow-x-hidden antialiased`}
      >
        <LanguageProvider>
          <ConditionalHeader />
          <main>
            {children}
          </main>
          <SiteFooter />
        </LanguageProvider>
      </body>
    </html>
  );
}
