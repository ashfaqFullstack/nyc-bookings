"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Script from "next/script";
import "@/styles/hostex-widget.css";
import { useEffect } from "react";

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  reviewCount: number;
  images: string[];
  host: string;
  hostexwidgetid: string;
  scriptsrc: string;
  amenities: string[];
  isWishlisted?: boolean;
}

export default function SearchPage() {

    // Add refresh logic
  useEffect(() => {
    // Simple check: if we have a referrer from the same site, refresh once
    const hasRefreshed = sessionStorage.getItem('refreshed-search');
    const isFromSameSite = document.referrer && 
                          new URL(document.referrer).origin === window.location.origin;
    
    if (isFromSameSite && !hasRefreshed) {
      console.log('Refreshing search page for Hostex widget reset');
      sessionStorage.setItem('refreshed-search', 'true');
      window.location.reload();
    }
    
    // Clean up on unmount
    return () => {
      sessionStorage.removeItem('refreshed-search');
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* <Script
        src="https://hostex.io/app/assets/js/hostex-widget.js?version=20250714104930"
        type="module"
        strategy="beforeInteractive"
      /> */}

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold mb-2">
            Search Results
          </h1>
          <p className="text-gray-600">
            Find your perfect stay from our available properties
          </p>
        </div>

        {/* Hostex Search Widget for additional searches */}
        <div className="mb-8 max-w-4xl">
          <div className="w-full hostex-search-widget bg-white rounded-lg border border-gray-300 shadow-sm p-4 overflow-auto">
          {/* <div className="relative z-10 w-full bg-white rounded-lg shadow-md overflow-visible"> */}
            <hostex-search-widget
              result-url="/search"
              id="eyJob3N0X2lkIjoiMTAyODU2Iiwid2lkZ2V0X2hvc3QiOiJodHRwczovL3cuaG9zdGV4Ym9va2luZy5zaXRlIn0="
            />
          </div>
        </div>

        {/* Hostex Search Results Widget */}
        <div className="w-full">
          <hostex-search-result-widget
            id="eyJob3N0X2lkIjoiMTAyODU2Iiwid2lkZ2V0X2hvc3QiOiJodHRwczovL3cuaG9zdGV4Ym9va2luZy5zaXRlIn0="
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
