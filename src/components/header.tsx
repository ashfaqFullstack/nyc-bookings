"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Search, MapPin, Menu, User, Heart, Calendar, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { LoginModal } from "@/components/auth/login-modal";
import { SignupModal } from "@/components/auth/signup-modal";
import { ForgotPasswordModal } from "@/components/auth/forgot-password-modal";
import Script from "next/script";
import '@/styles/hostex-widget.css';
import { usePathname } from "next/navigation";


export function Header() {
  const { user, isLoggedIn, logout } = useAuth();
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const pathname = usePathname();
const isSearchPage = pathname === "/search";
const isProperty = pathname.includes("/property/");
 const [isDesktop, setIsDesktop] = useState(false); // Default to false, will be updated on mount

  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth > 1024);
    };

    checkIsDesktop();

    window.addEventListener('resize', checkIsDesktop);

    return () => {
      window.removeEventListener('resize', checkIsDesktop);
    };
  }, []);



  const handleSwitchToSignup = () => {
    setShowLoginModal(false);
    setShowSignupModal(true);
  };

  const handleSwitchToLogin = () => {
    setShowSignupModal(false);
    setShowForgotPasswordModal(false);
    setShowLoginModal(true);
  };

  const handleForgotPassword = () => {
    setShowLoginModal(false);
    setShowForgotPasswordModal(true);
  };

  const handleBackToLogin = () => {
    setShowForgotPasswordModal(false);
    setShowLoginModal(true);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 text-xl md:text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
              <MapPin className="h-7 w-7 md:h-8 md:w-8" />
              <span className="hidden sm:inline">NewYorkCityBookings</span>
            </Link>
          </div>
           {/* Hostex Search Widget - shown only if not on search page */}
              {(!isSearchPage && (!isDesktop || !isProperty))  && (
                <div className="flex flex-1 justify-center hostex-navbar-widget">
                  <hostex-search-widget
                    result-url="/search"
                    id="eyJob3N0X2lkIjoiMTAyODU2Iiwid2lkZ2V0X2hvc3QiOiJodHRwczovL3cuaG9zdGV4Ym9va2luZy5zaXRlIn0="
                  />
                </div>
              )}


            {/* Desktop User Menu & Mobile Controls */}
            <div className="flex items-center space-x-2">
              {/* Mobile Search Button */}
              <div className="lg:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 h-10 w-10"
                  onClick={() => {
                    router.push("/search")
                  }}
                >
                  <Search className="h-5 w-5" />
                </Button>
              </div>

              {/* User Menu Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="rounded-full border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 h-10 px-3"
                  >
                    <Menu className="h-5 w-5 sm:h-4 sm:w-4" />
                    {isLoggedIn ? (
                      <Avatar className="h-6 w-6 ml-2">
                        <AvatarFallback className="text-xs">
                          {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <User className="h-5 w-5 sm:h-4 sm:w-4 ml-2" />
                    )}
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56 mt-2">
                  {isLoggedIn ? (
                    <>
                      <div className="px-3 py-2 text-sm">
                        <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                        <p className="text-gray-500 text-xs">{user?.email}</p>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleNavigation("/wishlist")}
                        className="flex items-center cursor-pointer"
                      >
                        <Heart className="h-4 w-4 mr-2" />
                        Wishlists
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleNavigation("/trips")}
                        className="flex items-center cursor-pointer"
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Trips
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleNavigation("/profile")}
                        className="flex items-center cursor-pointer"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Account
                      </DropdownMenuItem>
                      {user?.role === 'admin' && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleNavigation("/admin")}
                            className="flex items-center cursor-pointer text-rose-600 focus:text-rose-600"
                          >
                            <Settings className="h-4 w-4 mr-2" />
                            Admin Dashboard
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={logout}
                        className="flex items-center text-red-600 focus:text-red-600 focus:bg-red-50"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Log out
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem
                        onClick={() => setShowLoginModal(true)}
                        className="font-medium text-base sm:text-sm"
                      >
                        Log in
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setShowSignupModal(true)} className="text-base sm:text-sm">
                        Sign up
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleNavigation("/search")}
                        className="cursor-pointer flex sm:hidden"
                      >
                        Search properties
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToSignup={handleSwitchToSignup}
        onForgotPassword={handleForgotPassword}
      />

      {/* Signup Modal */}
      <SignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onSwitchToLogin={handleSwitchToLogin}
      />

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
        onBackToLogin={handleBackToLogin}
      />
   {/* Mobile Search Widget - Only shown when mobile search is active */}
 

    </header>
  );
}
