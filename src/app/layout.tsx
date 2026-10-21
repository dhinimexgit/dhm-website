import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ConditionalHeader } from "@/components/layout/conditional-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { LanguageProvider } from "@/lib/i18n";

// Self-hosted because Next 16.1 Turbopack cannot parse Google Fonts' occasional
// `/l/font?kit=…&skey=…` URLs (next/font/google queries have exactly one entry).
const sourceSans = localFont({
  src: "./fonts/source-sans-3-latin-wght-normal.woff2",
  weight: "400 700",
  display: "swap",
  variable: "--font-dhinimex-sans",
});

const suwannaphum = localFont({
  src: [
    {
      path: "./fonts/suwannaphum-khmer-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/suwannaphum-khmer-700-normal.woff2",
      weight: "700",
      style: "normal",
    },
  ],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden" suppressHydrationWarning>
      <body
        className={`${sourceSans.variable} ${suwannaphum.variable} overflow-x-hidden antialiased`}
        suppressHydrationWarning
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
