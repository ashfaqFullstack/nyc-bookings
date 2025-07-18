"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  Building2,
  TreePine,
  Waves,
  Mountain,
  Castle,
  Tent,
  Warehouse,
  SlidersHorizontal
} from "lucide-react";

const categories = [
  { id: "trending", label: "Trending", icon: Home },
  { id: "beachfront", label: "Beachfront", icon: Waves },
  { id: "cabins", label: "Cabins", icon: TreePine },
  { id: "luxury", label: "Luxury", icon: Castle },
  { id: "mountains", label: "Mountains", icon: Mountain },
  { id: "apartments", label: "Apartments", icon: Building2 },
  { id: "camping", label: "Camping", icon: Tent },
  { id: "lofts", label: "Lofts", icon: Warehouse },
];

export function FilterBar() {
  const [selectedCategory, setSelectedCategory] = useState("trending");

  return (
    <div className="border-b bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Categories */}
          <div className="flex items-center space-x-8 overflow-x-auto scrollbar-hide">
            {categories.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.id;

              return (
                <Button
                  key={category.id}
                  variant="ghost"
                  className={`flex flex-col items-center space-y-2 min-w-0 px-4 py-3 h-auto ${
                    isSelected
                      ? "text-black border-b-2 border-black rounded-none"
                      : "text-gray-600 hover:text-black border-b-2 border-transparent rounded-none"
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium whitespace-nowrap">
                    {category.label}
                  </span>
                </Button>
              );
            })}
          </div>

          {/* Filters Button */}
          <Button
            variant="outline"
            className="ml-4 border-gray-300 hover:border-gray-400"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
