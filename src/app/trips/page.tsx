"use client";

import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Calendar, MapPin, Users, Star, MessageCircle, ExternalLink, Code, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TripsPage() {
  const { user, isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

  // Show loading spinner while checking authentication
  if (isLoading) {
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

  // In production, this would check for real Hostex bookings
  // For now, we show empty state since no real bookings exist
  const hasRealBookings = false; // This would be fetched from Hostex API

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Trips</h1>
          <p className="text-gray-600 mt-2">Your confirmed bookings from Hostex</p>
        </div>

        {!hasRealBookings ? (
          <div className="space-y-6">
            {/* No Bookings State */}
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No trips yet</h3>
                <p className="text-gray-500 mb-6">
                  Book properties through our Hostex widget to see your reservations here.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild className="bg-rose-500 hover:bg-rose-600">
                    <Link href="/search">
                      <Calendar className="h-4 w-4 mr-2" />
                      Start searching
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/property/110913">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Try booking demo
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Integration Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Code className="h-5 w-5" />
                  Hostex API Integration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    This trips page integrates with Hostex API to show real booking data. Here's how it works:
                  </p>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Real Booking Detection</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Webhooks listen for <code className="bg-blue-100 px-1 rounded">reservation_created</code> events</li>
                      <li>• Guest email/phone matched with registered users</li>
                      <li>• Only confirmed Hostex bookings appear in trips</li>
                      <li>• Real-time updates when bookings are made or modified</li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-900 mb-2">Implementation Notes</h4>
                    <ul className="text-sm text-yellow-800 space-y-1">
                      <li>• Requires Hostex API key and webhook setup</li>
                      <li>• Database to store booking-to-user mappings</li>
                      <li>• Webhook endpoint: <code className="bg-yellow-100 px-1 rounded">POST /api/webhooks/hostex</code></li>
                      <li>• Secure token validation for webhook authenticity</li>
                    </ul>
                  </div>

                  <div className="flex gap-3">
                    <Button asChild variant="outline" size="sm">
                      <a href="https://hostex-openapi.readme.io/reference/overview" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Hostex API Docs
                      </a>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <a href="https://hostex-openapi.readme.io/reference/webhook-useage-guide" target="_blank" rel="noopener noreferrer">
                        <Code className="h-4 w-4 mr-2" />
                        Webhook Guide
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          // This section would show real bookings when they exist
          <div className="space-y-6">
            {/* Real bookings would be mapped here */}
            <p className="text-gray-500 text-center">Real booking data would appear here...</p>
          </div>
        )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
