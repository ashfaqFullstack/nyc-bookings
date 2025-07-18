"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface PhotoGalleryProps {
  images: string[];
  title: string;
  onImageClick?: (index: number) => void;
}

export function PhotoGallery({ images, title, onImageClick }: PhotoGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openGallery = (index = 0) => {
    setCurrentIndex(index);
    setIsOpen(true);
    if (onImageClick) {
      onImageClick(index);
    }
  };

  const closeGallery = () => {
    setIsOpen(false);
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <>
      {/* Main Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-8 h-96 md:h-80">
        {/* Main Image */}
        <div className="md:col-span-2 relative rounded-l-xl overflow-hidden cursor-pointer">
          <Image
            src={images[0]}
            alt={`${title} - Photo 1`}
            fill
            className="object-cover hover:brightness-90 transition-all"
            onClick={() => openGallery(0)}
          />
        </div>

        {/* Side Images Column 1 */}
        <div className="hidden md:grid grid-cols-1 gap-2">
          {images.slice(1, 3).map((image, index) => (
            <div
              key={`gallery-1-${index + 1}`}
              className="relative overflow-hidden cursor-pointer"
            >
              <Image
                src={image}
                alt={`${title} - Photo ${index + 2}`}
                fill
                className="object-cover hover:brightness-90 transition-all"
                onClick={() => openGallery(index + 1)}
              />
            </div>
          ))}
        </div>

        {/* Side Images Column 2 */}
        <div className="hidden md:grid grid-cols-1 gap-2">
          {images.slice(3, 5).map((image, index) => (
            <div
              key={`gallery-2-${index + 3}`}
              className={`relative overflow-hidden cursor-pointer ${index === 1 ? 'rounded-r-xl' : ''}`}
            >
              <Image
                src={image}
                alt={`${title} - Photo ${index + 4}`}
                fill
                className="object-cover hover:brightness-90 transition-all"
                onClick={() => openGallery(index + 3)}
              />
              {/* Show More Photos Overlay */}
              {index === 1 && images.length > 5 && (
                <div
                  className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer"
                  onClick={() => openGallery(index + 3)}
                >
                  <Button variant="outline" className="bg-white text-black hover:bg-gray-100">
                    Show all {images.length} photos
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Full Screen Gallery Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-7xl w-full h-full max-h-screen p-0 bg-black">
          <div className="relative h-full flex flex-col">
            {/* Header */}
            <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 rounded-full h-10 w-10 p-0"
                onClick={closeGallery}
              >
                <X className="h-6 w-6" />
              </Button>
              <div className="text-white text-sm bg-black/50 px-3 py-1 rounded-full">
                {currentIndex + 1} / {images.length}
              </div>
              <div /> {/* Spacer for centering */}
            </div>

            {/* Main Image Display */}
            <div className="flex-1 relative flex items-center justify-center p-4 pt-16">
              <div className="relative w-full h-full max-w-4xl max-h-full">
                <Image
                  src={images[currentIndex]}
                  alt={`${title} - Photo ${currentIndex + 1}`}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 rounded-full h-12 w-12 p-0"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 rounded-full h-12 w-12 p-0"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-8 w-8" />
                  </Button>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 max-w-4xl w-full px-4">
              <div className="flex space-x-2 justify-center overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={image}
                    className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentIndex
                        ? 'border-white'
                        : 'border-transparent hover:border-white/50'
                    }`}
                    onClick={() => goToImage(index)}
                  >
                    <Image
                      src={image}
                      alt={`${title} - Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
