"use client";

import Link from "next/link";
import { Header } from "@/components/header";
import { PropertyCard } from "@/components/property-card";
import { Footer } from "@/components/footer";
import { HeroCarousel } from "@/components/hero-carousel";
import { useState, useEffect } from "react";

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  reviewCount: number;
  images: string[];
  host: string;
  amenities: string[];
  isWishlisted?: boolean;
}

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProperties() {
      try {
        const response = await fetch('/api/properties?limit=12');
        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }
        const data = await response.json();
        setProperties(data.data.properties);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching properties:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, []);

  const handleLoginRequired = () => {
    alert("Please log in to add properties to your wishlist");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <HeroCarousel />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Properties</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={`skeleton-property-${index}`} className="animate-pulse">
                <div className="bg-gray-300 rounded-xl aspect-square mb-3" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4" />
                  <div className="h-3 bg-gray-300 rounded w-1/2" />
                  <div className="h-4 bg-gray-300 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <HeroCarousel />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Properties</h2>
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">Error loading properties: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Carousel Section */}
      <HeroCarousel />

      {/* Featured Properties */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold mb-8 text-center">Featured Properties</h2>
        {properties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No properties available at the moment.</p>
            <Link href="/search" className="text-blue-600 hover:underline">
              Try our search page
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onLoginRequired={handleLoginRequired}
              />
            ))}
          </div>
        )}

        {/* Load More */}
        <div className="flex justify-center mt-12 pb-8">
          <Link href="/search">
            <button className="px-8 py-3 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
              Show more
            </button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
