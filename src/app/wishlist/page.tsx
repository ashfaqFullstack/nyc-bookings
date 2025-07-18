"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useWishlist } from "@/lib/wishlist-context";
import { realProperties } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Heart, Star, MapPin, Calendar, Loader2 } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function WishlistPage() {
  const { user, isLoggedIn, isLoading: authLoading } = useAuth();
  const { wishlist, isLoading: wishlistLoading, removeFromWishlist } = useWishlist();
  const router = useRouter();
  const [confirmRemoval, setConfirmRemoval] = useState<string | null>(null);

  // Get properties that are in the wishlist
  const wishlistedProperties = realProperties.filter(property =>
    wishlist.includes(property.id)
  );

  // Show loading spinner while checking authentication or loading wishlist
  if (authLoading || wishlistLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-rose-500" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if not logged in (only after loading is complete)
  if (!isLoggedIn) {
    router.push("/");
    return null;
  }

  const handleRemoveFromWishlist = async (propertyId: string) => {
    const success = await removeFromWishlist(propertyId);
    if (success) {
      setConfirmRemoval(null);
    }
  };

  const propertyToRemove = wishlistedProperties.find(property => property.id === confirmRemoval);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Wishlist</h1>
            <p className="text-gray-600">
              {wishlistedProperties.length === 0
                ? "No saved properties yet. Start exploring and save your favorites!"
                : `${wishlistedProperties.length} saved ${wishlistedProperties.length === 1 ? 'property' : 'properties'}`
              }
            </p>
          </div>

          {/* Empty State */}
          {wishlistedProperties.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Your wishlist is empty
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Tap the heart icon when you find a place you like. We'll save them here for you.
              </p>
              <Link href="/">
                <Button className="bg-rose-500 hover:bg-rose-600 text-white">
                  Start exploring
                </Button>
              </Link>
            </div>
          ) : (
            /* Properties Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistedProperties.map((property) => (
                <Card key={property.id} className="group cursor-pointer border-0 shadow-sm hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-4">
                    <Link href={`/property/${property.id}`}>
                      <div className="relative aspect-square rounded-xl overflow-hidden mb-4">
                        <Image
                          src={property.images[0]}
                          alt={property.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {/* Remove from Wishlist Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 hover:bg-white shadow-sm"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setConfirmRemoval(property.id);
                          }}
                        >
                          <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />
                        </Button>
                      </div>
                    </Link>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {property.location}
                        </h3>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-black text-black" />
                          <span className="text-sm font-medium">
                            {property.rating}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm truncate">
                        {property.title}
                      </p>

                      <div className="flex items-center text-gray-500 text-sm">
                        <MapPin className="h-4 w-4 mr-1" />
                        {property.neighborhood}
                      </div>

                      <div className="pt-2">
                        <span className="font-semibold text-lg">${property.price}</span>
                        <span className="text-gray-600 text-sm"> night</span>
                      </div>

                      <div className="pt-2">
                        <Link href={`/property/${property.id}`}>
                          <Button variant="outline" className="w-full text-sm">
                            View details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={!!confirmRemoval} onOpenChange={() => setConfirmRemoval(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove from wishlist?</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {propertyToRemove && (
              <div className="flex items-center space-x-3">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                  <Image
                    src={propertyToRemove.images[0]}
                    alt={propertyToRemove.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">{propertyToRemove.location}</p>
                  <p className="text-sm text-gray-600">{propertyToRemove.title}</p>
                </div>
              </div>
            )}
            <p className="text-gray-600 mt-3">
              This property will be removed from your wishlist.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmRemoval(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => confirmRemoval && handleRemoveFromWishlist(confirmRemoval)}
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
