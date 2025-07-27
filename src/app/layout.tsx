import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import ClientBody from "./ClientBody";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});


const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NewYorkCity Bookings - NYC Holiday Homes & Apartment Rentals",
  description: "Find and book unique accommodations throughout New York City",
   openGraph: {
      images: ['/preview-nyc.png'], // Path to your image in the public folder
    },
    twitter: {
      card: 'summary_large_image', // Or 'summary', 'app', 'player'
      images: ['/preview-nyc.png'],
    },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body suppressHydrationWarning className="antialiased">
        <ClientBody>{children}</ClientBody>
        <Script
          crossOrigin="anonymous"
          src="//unpkg.com/same-runtime/dist/index.global.js"
          strategy="afterInteractive"
        />
        <Script
          // src="https://hostex.io/app/assets/js/hostex-widget.js?version=20250626192333"
          src="https://hostex.io/app/assets/js/hostex-widget.js?version=20250714104930"
          type="module"
          strategy="afterInteractive"
        />

      </body>
    </html>
  );
}
