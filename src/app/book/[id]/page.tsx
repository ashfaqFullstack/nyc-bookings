"use client"
import { Header } from "@/components/header";
import { HostexBookingWidget } from "@/components/hostex-booking-widget";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Router } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface BookingPageProps {
  params: {
    id: string; // This will be the listing_id
  };
}

export default function BookingPage({ params }: BookingPageProps) {
    const {id} = params;
    console.log(id , "params id")
    const router = useRouter()

    useEffect(() => {
        const hasRefreshed = sessionStorage.getItem(`refreshed-${id}`);
        if (!hasRefreshed && typeof window !== 'undefined') {
            sessionStorage.setItem(`refreshed-${id}`, 'true');
            setTimeout(() => window.location.reload(), 500); // delay prevents SSR bugs
        }
        return () => {
            sessionStorage.removeItem(`refreshed-${id}`);
        };
    }, [id]);


  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-6">


        <div className="max-w-3xl mx-auto">
          <HostexBookingWidget
            listingId={params.id}
            widgetId="eyJob3N0X2lkIjoiMTAyODU2Iiwid2lkZ2V0X2hvc3QiOiJodHRwczovL3cuaG9zdGV4Ym9va2luZy5zaXRlIn0="
          />
        </div>
      </main>
    </div>
  );
}