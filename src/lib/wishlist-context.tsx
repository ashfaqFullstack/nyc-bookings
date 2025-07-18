"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { useAuth } from "./auth-context";

interface WishlistContextType {
  wishlist: string[];
  isLoading: boolean;
  addToWishlist: (propertyId: string) => Promise<boolean>;
  removeFromWishlist: (propertyId: string) => Promise<boolean>;
  isInWishlist: (propertyId: string) => boolean;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  console.log('WishlistProvider: Component rendering');
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isLoggedIn, isLoading: authLoading } = useAuth();
  console.log('WishlistProvider: user:', !!user, 'isLoggedIn:', isLoggedIn, 'authLoading:', authLoading);

  // Get auth token from localStorage
  const getToken = useCallback(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  }, []);

  // Fetch wishlist from API
  const fetchWishlist = useCallback(async () => {
    console.log('WishlistContext: fetchWishlist called');
    const token = getToken();
    console.log('WishlistContext: token exists:', !!token, 'user exists:', !!user, 'authLoading:', authLoading);

    if (token && user) {
      try {
        console.log('WishlistContext: Fetching wishlist from API');
        const response = await fetch('/api/wishlist', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          console.log('WishlistContext: Fetched wishlist data:', data);
          // Extract propertyId values from the array of objects
          const propertyIds = (data.wishlist || []).map((item: { propertyId: string }) => item.propertyId);
          console.log('WishlistContext: Extracted property IDs:', propertyIds);
          setWishlist(propertyIds);
        } else {
          console.error('WishlistContext: Failed to fetch wishlist:', response.status);
        }
      } catch (error) {
        console.error('WishlistContext: Error fetching wishlist:', error);
      }
    }
  }, [user, authLoading, getToken]);

  console.log('WishlistProvider: About to set up useEffects');

  // Load wishlist when auth state changes
  useEffect(() => {
    console.log('WishlistContext: Auth state useEffect triggered, user:', !!user, 'authLoading:', authLoading);

    // Only fetch if auth is not loading
    if (!authLoading) {
      if (user) {
        console.log('WishlistContext: User authenticated, fetching wishlist');
        fetchWishlist();
      } else {
        console.log('WishlistContext: User not authenticated, clearing wishlist');
        setWishlist([]);
      }
    }
  }, [user, authLoading, fetchWishlist]);

  const addToWishlist = async (propertyId: string): Promise<boolean> => {
    console.log('WishlistContext: addToWishlist called for property:', propertyId);
    const token = getToken();
    console.log('WishlistContext: token exists:', !!token, 'user exists:', !!user);

    if (!token || !user) {
      console.log('WishlistContext: No token or user');
      return false;
    }

    try {
      console.log('WishlistContext: Sending POST request to /api/wishlist');
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ propertyId }),
      });

      console.log('WishlistContext: Response status:', response.status);

      if (response.ok) {
        console.log('WishlistContext: Successfully added to wishlist, updating local state');
        // Optimistically update the UI first
        setWishlist(prev => [...prev, propertyId]);
        console.log('WishlistContext: Added to wishlist state');
        return true;
      }
      if (response.status === 409) {
        // Property already in wishlist - considered a success
        console.log('WishlistContext: Property already in wishlist (409)');
        return true;
      }
      const errorData = await response.json();
      console.error('WishlistContext: Add to wishlist error:', errorData.error);
      return false;
    } catch (error) {
      console.error('WishlistContext: Add to wishlist error:', error);
      return false;
    }
  };

  const removeFromWishlist = async (propertyId: string): Promise<boolean> => {
    console.log('WishlistContext: removeFromWishlist called for property:', propertyId);
    const token = getToken();
    console.log('WishlistContext: token exists:', !!token, 'user exists:', !!user);

    if (!token || !user) {
      console.log('WishlistContext: No token or user');
      return false;
    }

    try {
      console.log('WishlistContext: Sending DELETE request to /api/wishlist');
      const response = await fetch(`/api/wishlist?propertyId=${encodeURIComponent(propertyId)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('WishlistContext: Response status:', response.status);

      if (response.ok) {
        console.log('WishlistContext: Successfully removed from wishlist, updating local state');
        // Optimistically update the UI
        setWishlist(prev => prev.filter(id => id !== propertyId));
        console.log('WishlistContext: Removed from wishlist state');
        return true;
      }
      const errorData = await response.json();
      console.error('WishlistContext: Remove from wishlist error:', errorData.error);
      return false;
    } catch (error) {
      console.error('WishlistContext: Remove from wishlist error:', error);
      return false;
    }
  };

  const isInWishlist = (propertyId: string): boolean => {
    const isIncluded = wishlist.includes(propertyId);
    console.log(`WishlistContext: isInWishlist(${propertyId}) = ${isIncluded}, current wishlist:`, wishlist);
    return isIncluded;
  };

  const refreshWishlist = async (): Promise<void> => {
    await fetchWishlist();
  };

  // Create stable context value to avoid unnecessary re-renders
  const contextValue = {
    wishlist,
    isLoading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    refreshWishlist,
  };

  return (
    <WishlistContext.Provider value={contextValue}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
