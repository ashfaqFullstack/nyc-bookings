"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PhotoGallery } from "@/components/photo-gallery";
import { AmenitiesModal } from "@/components/amenities-modal";
import { HostexBookingWidget } from "@/components/hostex-booking-widget";
import { useAuth } from "@/lib/auth-context";
import { useWishlist } from "@/lib/wishlist-context";
import { Property } from "@/types/property";
import '@/styles/hostex-widget.css';

import {
  Heart,
  Star,
  ArrowLeft,
  Share,
  Users,
  Bed,
  Bath,
  Wifi,
  Car,
  Tv,
  AirVent,
  MapPin,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Upload,
} from "lucide-react";


interface PropertyDetailClientProps {
  id: string;
}


// import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface PropertyMapProps {
  coordinates: { lat: number; lng: number };
}

export function PropertyMap({ coordinates }: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<L.Map | null>(null); // Store Leaflet instance

  useEffect(() => {
    if (mapRef.current && !leafletMapRef.current) {
      leafletMapRef.current = L.map(mapRef.current).setView(
        [coordinates.lat, coordinates.lng],
        13
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(leafletMapRef.current);

      const customIcon = L.icon({
        iconUrl: '/marker-icon.png', 
        iconSize: [40, 40], 
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
        shadowUrl: undefined,
      });

      L.marker([coordinates.lat, coordinates.lng], { icon: customIcon }).addTo(leafletMapRef.current);
    }
  }, [coordinates]);

  return (
    <div
      ref={mapRef}
      style={{ height: "100%", width: "100%" }}
      className="rounded-lg"
    />
  );
}

export default function PropertyDetailClient({ id }: PropertyDetailClientProps) {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAmenitiesModal, setShowAmenitiesModal] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [isUpdatingWishlist, setIsUpdatingWishlist] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [showMobileBookingWidget, setShowMobileBookingWidget] = useState(false);
  const mobileBookingWidgetRef = useRef<HTMLDivElement>(null);

  const { isLoggedIn } = useAuth();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  useEffect(() => {
    async function fetchProperty() {
      try {
        const response = await fetch(`/api/properties/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            notFound();
            return;
          }
          throw new Error('Failed to fetch property');
        }
        const data = await response.json();
        setProperty(data.data.property);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching property:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProperty();
  }, [id]);

  useEffect(() => {
    // Lock body scroll when mobile booking widget is shown
    if (showMobileBookingWidget) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [showMobileBookingWidget]);

  // Close mobile booking widget when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileBookingWidgetRef.current &&
        !mobileBookingWidgetRef.current.contains(event.target as Node) &&
        showMobileBookingWidget
      ) {
        // Don't close if clicked on the booking widget itself
        const target = event.target as HTMLElement;
        if (
          target.closest('hostex-booking-widget') ||
          target.tagName.toLowerCase().includes('hostex')
        ) {
          return;
        }
        setShowMobileBookingWidget(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMobileBookingWidget]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="lg:container mx-auto lg:px-8 lg:py-6">
          <div className="animate-pulse">
            <div className="lg:hidden h-[60vh] bg-gray-300" />
            <div className="hidden lg:block h-96 bg-gray-300 rounded-lg mb-8" />
            <div className="px-4 lg:px-0">
              <div className="h-8 bg-gray-300 rounded w-3/4 mb-4" />
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-8" />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="h-6 bg-gray-300 rounded w-1/3" />
                  <div className="h-20 bg-gray-300 rounded" />
                  <div className="h-6 bg-gray-300 rounded w-1/4" />
                  <div className="h-32 bg-gray-300 rounded" />
                </div>
                <div className="hidden lg:block">
                  <div className="h-96 bg-gray-300 rounded" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="lg:container mx-auto lg:px-8 lg:py-6 px-4">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Property Not Found</h1>
            <p className="text-gray-600 mb-6">{error || 'The property you are looking for does not exist.'}</p>
            <Link href="/">
              <Button className="bg-blue-600 text-white hover:bg-blue-700">
                Back to Home
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const isWishlisted = isInWishlist(property.id);

  const handleWishlistClick = async () => {
    console.log('Save button clicked for property:', property.id, 'User logged in:', isLoggedIn);

    if (!isLoggedIn) {
      console.log('User not logged in');
      // Could trigger login modal here
      return;
    }

    try {
      setIsUpdatingWishlist(true);
      if (isWishlisted) {
        console.log('Removing from wishlist:', property.id);
        const success = await removeFromWishlist(property.id);
        console.log('Remove result:', success);
      } else {
        console.log('Adding to wishlist:', property.id);
        const success = await addToWishlist(property.id);
        console.log('Add result:', success);
      }
    } catch (error) {
      console.error('Wishlist operation failed:', error);
    } finally {
      setIsUpdatingWishlist(false);
    }
  };

  const handleShareClick = async () => {
    const url = window.location.href;

    try {
      if (navigator.share) {
        // Use native share API if available (mobile devices)
        await navigator.share({
          title: property.title,
          text: `Check out this amazing property: ${property.title}`,
          url: url,
        });
      } else {
        // Fallback to clipboard API
        await navigator.clipboard.writeText(url);
        setShareSuccess(true);
        // Reset success message after 3 seconds
        setTimeout(() => setShareSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Share failed:', error);
      // Fallback: try to copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 3000);
      } catch (clipboardError) {
        console.error('Clipboard copy failed:', clipboardError);
      }
    }
  };

  const amenityIcons: { [key: string]: React.ComponentType<React.SVGProps<SVGSVGElement>> } = {
    "WiFi": Wifi,
    "Kitchen": Users,
    "Parking": Car,
    "TV": Tv,
    "Air conditioning": AirVent,
    "Pool": Users,
    "Hot tub": Users,
    "Gym": Users,
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <Header />

      <main className="lg:container mx-auto lg:px-8 lg:py-6">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b sticky top-0 bg-white z-20">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleShareClick}>
              <Upload className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleWishlistClick} disabled={isUpdatingWishlist}>
              {isUpdatingWishlist ? (
                <div className="h-5 w-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Heart
                  className={`h-5 w-5 transition-all duration-200 ${
                    isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-gray-600'
                  }`}
                />
              )}
            </Button>
          </div>
        </div>

        {/* Image Gallery for Mobile */}
        <div className="lg:hidden relative">
          <div className="snap-x snap-mandatory overflow-x-auto flex">
            {property.images.map((image, index) => (
              <div key={image} className="snap-center flex-shrink-0 w-full h-[60vh] relative">
                <Image
                  src={image}
                  alt={`${property.title} - image ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            ))}
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
            {currentImageIndex + 1} / {property.images.length}
          </div>
        </div>

        {/* Desktop Title and Actions */}
        <div className="hidden lg:block pt-6">
          <div className="mb-4">
            <Link href="/">
              <Button variant="ghost" className="p-0 hover:bg-transparent">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to listings
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold mb-2">{property.title}</h1>
              <div className="flex items-center space-x-2 text-sm">
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-black mr-1" />
                  <span className="font-medium">{property.rating}</span>
                  <span className="text-gray-500 ml-1">({property.reviewCount} reviews)</span>
                </div>
                <span className="text-gray-500">•</span>
                <span className="text-gray-600 underline">{property.location}</span>
              </div>
            </div>
            <div className="hidden lg:flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShareClick}
                className={`property-action-button ${shareSuccess ? 'share-success' : ''}`}
              >
                <Share className="h-4 w-4 mr-2" />
                {shareSuccess ? 'Link copied!' : 'Share'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleWishlistClick}
                disabled={isUpdatingWishlist}
                className="property-action-button"
              >
                {isUpdatingWishlist ? (
                  <div className="h-4 w-4 mr-2 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Heart
                    className={`h-4 w-4 mr-2 transition-all duration-200 ${
                      isWishlisted
                        ? 'fill-rose-500 text-rose-500'
                        : 'text-gray-600 hover:text-rose-500'
                    }`}
                    data-wishlisted={isWishlisted ? "true" : "false"}
                  />
                )}
                {isWishlisted ? 'Saved' : 'Save'}
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop Image Gallery */}
        <div className="hidden lg:block">
          <PhotoGallery
            images={property.images}
            title={property.title}
            onImageClick={(index) => setCurrentImageIndex(index)}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4 lg:mt-8 px-4 sm:px-0">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Mobile Title */}
            <div className="lg:hidden border-b pb-6">
               <h1 className="text-2xl font-semibold mb-1">{property.title}</h1>
               <div className="flex items-center text-sm">
                  <Star className="h-4 w-4 fill-current text-black mr-1" />
                  <span className="font-medium">{property.rating}</span>
                  <span className="text-gray-500 ml-1">({property.reviewCount} reviews)</span>
                  <span className="text-gray-500 mx-2">•</span>
                  <span className="text-gray-600 underline">{property.location}</span>
               </div>
            </div>

            {/* Host Info */}
            <div className="border-b pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-1">
                    Hosted by {property.host}
                  </h2>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <span>{property.guests} guests</span>
                    <span>•</span>
                    <span>{property.bedrooms} bedrooms</span>
                    <span>•</span>
                    <span>{property.beds} beds</span>
                    <span>•</span>
                    <span>{property.bathrooms} baths</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">

                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={property.hostImage}
                      alt={property.host}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Property Description */}
            <div className="border-b pb-6">
              <h3 className="text-lg font-semibold mb-3">About this place</h3>
              <p className="text-gray-700 leading-relaxed">{property.description}</p>
            </div>

            {/* Sleeping Arrangements */}
            <div className="border-b pb-6">
              <h3 className="text-lg font-semibold mb-4">Where you'll sleep</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: property.bedrooms }, (_, index) => (
                  <Card key={`bedroom-${property.id}-${index}`} className="border">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <Bed className="h-8 w-8 text-gray-600" />
                        <div>
                          <div className="font-medium">Bedroom {index + 1}</div>
                          <div className="text-sm text-gray-600">1 queen bed</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="border-b pb-6">
              <h3 className="text-lg font-semibold mb-4">What this place offers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.amenities.slice(0, 10).map((amenity) => {
                  const IconComponent = amenityIcons[amenity] || Check;
                  return (
                    <div key={amenity} className="flex items-center space-x-3">
                      <IconComponent className="h-5 w-5 text-gray-600" />
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  );
                })}
              </div>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setShowAmenitiesModal(true)}
              >
                Show all {property.amenities.length} amenities
              </Button>
            </div>

            {/* Reviews */}
            <div className="border-b pb-6">
              <div className="flex items-center space-x-2 mb-6">
                <Star className="h-5 w-5 fill-black" />
                <span className="text-lg font-semibold">{property.rating}</span>
                <span className="text-gray-500">({property.reviewCount} reviews)</span>
              </div>

              {property.reviews.length > 0 && (
                <div className="space-y-6">
                  {property.reviews.slice(0, showAllReviews ? undefined : 2).map((review) => (
                    <div key={review.id} className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          <Image
                            src={review.userImage}
                            alt={review.user}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{review.user}</div>
                          <div className="text-sm text-gray-500">{review.date}</div>
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                  {property.reviews.length > 2 && (
                    <Button
                      variant="outline"
                      onClick={() => setShowAllReviews(!showAllReviews)}
                    >
                      {showAllReviews ? 'Show less' : `Show all ${property.reviews.length} reviews`}
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Location */}
            <div className="border-b pb-6">
              <h3 className="text-lg font-semibold mb-4">Where you'll be</h3>
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="h-5 w-5 text-gray-600" />
                <span className="text-gray-700">{property.location}</span>
              </div>
              <div className="h-96 w-full rounded-lg overflow-hidden relative bg-gray-100">
                <PropertyMap coordinates={property.coordinates} />
              </div>
              <div className="mt-4">
                 <h4 className="font-semibold">{property.neighborhood}</h4>
                 <p className="text-sm text-gray-600 mt-1">{property.neighborhoodInfo?.description}</p>
              </div>
              <div className="mt-3 text-sm text-gray-500">
                <div className="text-xs text-gray-400">
                  The exact location will be provided after booking confirmation
                </div>
              </div>
            </div>

            {/* House Rules */}
            <div className="border-b pb-6">
              <h3 className="text-lg font-semibold mb-4">House rules</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Check-in</span>
                  <span className="text-gray-600">{property.checkIn}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Check-out</span>
                  <span className="text-gray-600">{property.checkOut}</span>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {property.houseRules.map((rule) => (
                  <div key={rule} className="flex items-center space-x-2">
                    <X className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-700">{rule}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cancellation Policy */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Cancellation policy</h3>
              <p className="text-gray-700">{property.cancellationPolicy}</p>
            </div>
          </div>

          {/* Right Column - Hostex Booking Widget */}
          <div className="hidden lg:block lg:col-span-4 md:order-last md:col-span-6 col-span-12">
            <HostexBookingWidget
              listingId={property.listing_id}
              widgetId="eyJob3N0X2lkIjoiMTAyODU2Iiwid2lkZ2V0X2hvc3QiOiJodHRwczovL3cuaG9zdGV4Ym9va2luZy5zaXRlIn0="
              className="relative sticky top-6"
            />
          </div>
        </div>
      </main>

      {/* Mobile Booking Widget Modal */}
      {showMobileBookingWidget && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex flex-col justify-end">
          <div
            ref={mobileBookingWidgetRef}
            className="bg-white rounded-t-xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white p-4 border-b flex items-center justify-between z-10">
              <h3 className="text-lg font-semibold">Book Your Stay</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMobileBookingWidget(false)}
                className="rounded-full h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4">
              <HostexBookingWidget
                listingId={property.listing_id as string}
                widgetId={property.hostexwidgetid as string}
                scriptsrc={property.scriptsrc as string}
              />
            </div>
          </div>
        </div>
      )}

      {/* Sticky booking footer for mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex items-center justify-between z-10">
        <div>
          <p className="font-bold text-lg">${property.price} <span className="font-normal text-base">/ night</span></p>
          <p className="text-sm text-gray-500 underline">{property.reviewCount} reviews</p>
        </div>
        <Button
          className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-6 rounded-lg"
          onClick={() => setShowMobileBookingWidget(true)}
        >
          Reserve
        </Button>
      </div>

      {/* Amenities Modal */}
      <AmenitiesModal
        isOpen={showAmenitiesModal}
        onClose={() => setShowAmenitiesModal(false)}
        amenities={property.amenities}
      />
    </div>
  );
}
