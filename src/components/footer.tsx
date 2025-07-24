import Link from "next/link";
import { Globe, ChevronUp } from "lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Support */}
          <div className="w-full" >
            <Image src='/logo.png' width={105} height={105} alt="Footer Logo" className="object-contain ml-[-20px] lg:ml-0" />
          </div>
          {/* <div>
            <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/help" className="text-gray-600 hover:text-gray-900 text-sm">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/safety" className="text-gray-600 hover:text-gray-900 text-sm">
                  Safety information
                </Link>
              </li>
              <li>
                <Link href="/cancellation" className="text-gray-600 hover:text-gray-900 text-sm">
                  Cancellation options
                </Link>
              </li>
              <li>
                <Link href="/disability-support" className="text-gray-600 hover:text-gray-900 text-sm">
                  Report a disability concern
                </Link>
              </li>
            </ul>
          </div> */}

          {/* Hosting */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm">
                  Cancellation Policies
                </Link>
              </li>
            </ul>
          </div>

          {/* NYC Bookings */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">NewYorkCityBookings</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm">
                  Guest Referal
                </Link>
              </li>
              {/* <li>
                <Link href="/newsroom" className="text-gray-600 hover:text-gray-900 text-sm">
                  Newsroom
                </Link>
              </li> */}
              {/* <li>
                <Link href="/new-features" className="text-gray-600 hover:text-gray-900 text-sm">
                  New features
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-600 hover:text-gray-900 text-sm">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/investors" className="text-gray-600 hover:text-gray-900 text-sm">
                  Investors
                </Link>
              </li> */}
            </ul>
          </div>

          {/* Legal */}
          {/* <div className="md:col-span-3 lg:col-span-1">
            <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-gray-900 text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-gray-900 text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/sitemap" className="text-gray-600 hover:text-gray-900 text-sm">
                  Sitemap
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-600 hover:text-gray-900 text-sm">
                  Cookie Preferences
                </Link>
              </li>
            </ul>
          </div> */}
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-8 border-t border-gray-200 space-y-4 sm:space-y-0">
          {/* Copyright and Links */}
          <div className="flex flex-wrap items-center text-sm text-gray-600 space-x-1">
            <span>© 2025 NYC Bookings, Inc.</span>
            <span className="hidden sm:inline">·</span>
            <Link href="/" className="hover:text-gray-900 underline">
              Terms
            </Link>
            <span>·</span>
            <Link href="/" className="hover:text-gray-900 underline">
              Sitemap
            </Link>
            <span>·</span>
            <Link href="/" className="hover:text-gray-900 underline">
              Privacy
            </Link>
            <span>·</span>
            <Link href="/" className="hover:text-gray-900 underline">
              Your Privacy Choices
            </Link>
          </div>

          {/* Language and Currency */}
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900">
              <Globe className="h-4 w-4" />
              <span>English (US)</span>
              <ChevronUp className="h-3 w-3" />
            </button>
            <button className="text-sm text-gray-600 hover:text-gray-900 font-medium">
              $ USD
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
