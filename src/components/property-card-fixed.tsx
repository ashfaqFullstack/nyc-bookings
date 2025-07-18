"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useWishlist } from "@/lib/wishlist-context";

interface PropertyCardProps {
  property: {
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
  };
  onLoginRequired?: () => void;
}

export function PropertyCard({ property, onLoginRequired }: PropertyCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isUpdatingWishlist, setIsUpdatingWishlist] = useState(false);
  const { user, isLoggedIn } = useAuth();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  // Get wishlist status and debug log it
  const isWishlisted = isInWishlist(property.id);

  // Debug output to console
  useEffect(() => {
    console.log(`PropertyCard: property ${property.id} isWishlisted: ${isWishlisted}`);
  }, [property.id, isWishlisted]);

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    console.log('PropertyCard: Heart clicked for property:', property.id, 'User logged in:', isLoggedIn, 'User:', !!user);

    if (!isLoggedIn || !user) {
      console.log('PropertyCard: User not logged in, showing login modal');
      if (onLoginRequired) {
        onLoginRequired();
      }
      return;
    }

    try {
      setIsUpdatingWishlist(true);
      console.log('PropertyCard: Current wishlist status for', property.id, 'is', isWishlisted ? 'in wishlist' : 'not in wishlist');

      // Toggle wishlist status
      if (isWishlisted) {
        console.log('PropertyCard: Removing from wishlist:', property.id);
        const success = await removeFromWishlist(property.id);
        console.log('PropertyCard: Remove result:', success);
      } else {
        console.log('PropertyCard: Adding to wishlist:', property.id);
        const success = await addToWishlist(property.id);
        console.log('PropertyCard: Add result:', success);
      }
    } catch (error) {
      console.error('PropertyCard: Wishlist operation failed:', error);
    } finally {
      setIsUpdatingWishlist(false);
    }
  };

  return (
    <Link href={`/property/${property.id}`}>
      <Card className="group cursor-pointer border-0 shadow-none hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden">
        <CardContent className="p-0">
          {/* Image Carousel */}
          <div className="relative aspect-video sm:aspect-square rounded-xl overflow-hidden mb-3">
            <Image
              src={property.images[0]}
              alt={property.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* Image Navigation - Hidden on mobile for a cleaner look */}
            {property.images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    prevImage();
                  }}
                >
                  <span className="text-black">‹</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    nextImage();
                  }}
                >
                  <span className="text-black">›</span>
                </Button>
              </>
            )}

            {/* Wishlist Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 h-9 w-9 rounded-full bg-black/30 hover:bg-black/50 text-white transition-all duration-200"
              onClick={handleWishlistClick}
              disabled={isUpdatingWishlist}
              data-testid={`wishlist-button-${property.id}`}
            >
              {isUpdatingWishlist ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Heart
                  className={`h-5 w-5 transition-all duration-200 ${
                    isWishlisted
                      ? 'fill-rose-500 text-rose-500'
                      : 'text-white'
                  }`}
                  data-wishlisted={isWishlisted ? "true" : "false"}
                />
              )}
            </Button>

            {/* Image Dots for mobile */}
            {property.images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5 sm:hidden">
                {property.images.map((_, index) => (
                  <div
                    key={`${property.id}-dot-${index}`}
                    className={`h-2 w-2 rounded-full transition-all ${
                      index === 0 ? 'bg-white w-4' : 'bg-white/60'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Property Details */}
          <div className="space-y-1 px-2 pb-2">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-gray-800 leading-snug pr-2">
                {property.location}
              </h3>
              <div className="flex items-center space-x-1 flex-shrink-0 pt-0.5">
                <Star className="h-3.5 w-3.5 fill-gray-900 text-gray-900" />
                <span className="text-sm font-medium text-gray-800">
                  {Number(property.rating).toFixed(1)}
                </span>
              </div>
            </div>
            <p className="text-gray-500 text-sm truncate">
              {property.title}
            </p>
            <div className="pt-1">
              <span className="font-semibold text-gray-900">${property.price}</span>
              <span className="text-gray-600"> night</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
