import React from "react";
import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  ChevronDown,
} from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-neutral-100 py-12 px-6 border-gray-200">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo and company info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center">
              <div className="bg-black text-white p-1">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 5L12 19L19 5H5Z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5 19L19 19"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <span className="ml-2 text-xl font-bold">Adscod</span>
            </Link>

            <p className="font-medium">Where Social meets Commerce!</p>

            <p className="text-gray-600 text-sm">
              The ultimate platform connecting influencers, creators, and
              businesses for seamless collaborations. Made for businesses that
              care about their customers and individuals who are
              productivity-oriented.
            </p>

            <div className="flex space-x-4">
              <Link href="#" aria-label="Facebook">
                <Facebook className="h-5 w-5 text-gray-600 hover:text-gray-900" />
              </Link>
              <Link href="#" aria-label="Twitter">
                <Twitter className="h-5 w-5 text-gray-600 hover:text-gray-900" />
              </Link>
              <Link href="#" aria-label="Instagram">
                <Instagram className="h-5 w-5 text-gray-600 hover:text-gray-900" />
              </Link>
              <Link href="#" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5 text-gray-600 hover:text-gray-900" />
              </Link>
              <Link href="#" aria-label="YouTube">
                <Youtube className="h-5 w-5 text-gray-600 hover:text-gray-900" />
              </Link>
            </div>

            <div className="inline-flex items-center border border-gray-200 rounded-md px-3 py-1">
              <span className="text-sm">English</span>
              <ChevronDown className="h-4 w-4 ml-2" />
            </div>
          </div>

          {/* Platform links */}
          <div>
            <h3 className="text-xl font-bold mb-6">Platform</h3>
            <ul className="space-y-4">
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  Listings
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  Influencer Marketplace
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  Customer Reviews
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  Coupon Codes
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  Forums
                </Link>
              </li>
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h3 className="text-xl font-bold mb-6">Company</h3>
            <ul className="space-y-4">
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  Support
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h3 className="text-xl font-bold mb-6">Legal</h3>
            <ul className="space-y-4">
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  Cookies Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
          Copyright © 2025 Adscod. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
