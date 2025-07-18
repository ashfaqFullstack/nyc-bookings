"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Wifi, Car, Coffee, Tv, Wind, Waves, Dumbbell, Camera, Shield, Utensils, Bath, Bed, Home, Check } from "lucide-react";

interface AmenitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  amenities: string[];
}

const amenityCategories = {
  "Bathroom": {
    icon: Bath,
    amenities: ["Hair dryer", "Shampoo", "Hot water", "Shower gel", "Clean towels"]
  },
  "Bedroom and laundry": {
    icon: Bed,
    amenities: ["Bed linens", "Extra pillows and blankets", "Iron", "Clothing storage", "Hangers", "Washer"]
  },
  "Entertainment": {
    icon: Tv,
    amenities: ["TV", "Sound system", "Books and reading material", "Exercise equipment"]
  },
  "Family": {
    icon: Home,
    amenities: ["High chair", "Children's books and toys", "Children's dinnerware", "Baby safety gates"]
  },
  "Heating and cooling": {
    icon: Wind,
    amenities: ["Air conditioning", "Heating", "Ceiling fan", "Portable fan"]
  },
  "Home safety": {
    icon: Shield,
    amenities: ["Security cameras", "Smoke alarm", "First aid kit", "Fire extinguisher", "Carbon monoxide alarm"]
  },
  "Internet and office": {
    icon: Wifi,
    amenities: ["WiFi", "Dedicated workspace", "Laptop-friendly workspace"]
  },
  "Kitchen and dining": {
    icon: Utensils,
    amenities: ["Kitchen", "Refrigerator", "Microwave", "Basic cooking essentials", "Dishes and silverware", "Coffee maker", "Electric kettle"]
  },
  "Location features": {
    icon: Camera,
    amenities: ["City views", "Balcony", "Garden view", "Mountain view", "Ocean view", "Pool view"]
  },
  "Outdoor": {
    icon: Waves,
    amenities: ["Pool", "Hot tub", "BBQ grill", "Outdoor seating", "Garden", "Patio"]
  },
  "Parking and facilities": {
    icon: Car,
    amenities: ["Free parking", "Gym", "Elevator", "24-hour check-in", "Self check-in"]
  },
  "Services": {
    icon: Coffee,
    amenities: ["Breakfast", "Cleaning service", "Luggage dropoff allowed", "Long term stays allowed"]
  }
};

export function AmenitiesModal({ isOpen, onClose, amenities }: AmenitiesModalProps) {
  const getAmenityCategory = (amenity: string) => {
    for (const [categoryName, categoryData] of Object.entries(amenityCategories)) {
      if (categoryData.amenities.some(cat => cat.toLowerCase().includes(amenity.toLowerCase()) || amenity.toLowerCase().includes(cat.toLowerCase()))) {
        return categoryName;
      }
    }
    return "Other";
  };

  const categorizedAmenities = amenities.reduce((acc, amenity) => {
    const category = getAmenityCategory(amenity);
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(amenity);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">What this place offers</DialogTitle>
        </DialogHeader>

        <div className="grid gap-8 mt-6">
          {Object.entries(categorizedAmenities).map(([category, categoryAmenities]) => {
            const categoryData = amenityCategories[category as keyof typeof amenityCategories];
            const IconComponent = categoryData?.icon || Check;

            return (
              <div key={category} className="space-y-4">
                <div className="flex items-center space-x-3">
                  <IconComponent className="h-6 w-6 text-gray-600" />
                  <h3 className="text-lg font-semibold">{category}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-9">
                  {categoryAmenities.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-gray-600" />
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end mt-8 pt-4 border-t">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
