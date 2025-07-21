"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const heroImages = [
  "/hero-images/IMG_1511.JPG",
  "/hero-images/7BD9FD52-CED0-472C-A9A5-168E962A1141_1_105_c.jpeg",
  "/hero-images/IMG_1515.JPG",
  "/hero-images/9A3B55E4-A67F-4B99-A0B8-220118BE10FD_1_105_c.jpeg",
  "/hero-images/IMG_1604.JPG",
  "/hero-images/IMG_1612.JPG",
  "/hero-images/IMG_1533.JPG",
  "/hero-images/IMG_1636.JPG",
  "/hero-images/IMG_1550.JPG",
];

export function HeroCarousel() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? heroImages.length - 1 : prevIndex - 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="relative h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden">
      {/* Image Background */}
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={image}
              alt={`Interior view ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevImage}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-colors group"
      >
        <ChevronLeft className="h-6 w-6 text-white group-hover:text-white" />
      </button>

      <button
        onClick={nextImage}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-colors group"
      >
        <ChevronRight className="h-6 w-6 text-white group-hover:text-white" />
      </button>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 drop-shadow-lg">
            Discover Amazing NYC Stays
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-8 drop-shadow-md">
            Find and book your perfect New York City vacation rental with our integrated booking system.
          </p>
          <div className="relative mt-8 flex justify-center z-[10000]">
            {/* <Link href="/search" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-white text-blue-600 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transition-transform transform hover:scale-105">
                Explore Properties
              </button>
            </Link> */}
            <div className="absolute w-[95%] lg:w-[70%] mx-auto" >
               <div className="flex flex-1 justify-center hostex-search-home-widget">
                  <hostex-search-widget
                    result-url="/search"
                    id="eyJob3N0X2lkIjoiMTAyODU2Iiwid2lkZ2V0X2hvc3QiOiJodHRwczovL3cuaG9zdGV4Ym9va2luZy5zaXRlIn0="
                  />
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dot Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
        {heroImages.map((image, index) => (
          <button
            key={index}
            onClick={() => goToImage(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentImageIndex ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
