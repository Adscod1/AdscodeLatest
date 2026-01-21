"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { UserAuthButton } from "./UserAuthButton";
import { useSearch } from "@/contexts/SearchContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

// Icons
const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const HomeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TagIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.59 13.41L13.42 20.58C13.2343 20.766 13.0137 20.9135 12.7709 21.0141C12.5281 21.1148 12.2678 21.1666 12.005 21.1666C11.7422 21.1666 11.4819 21.1148 11.2391 21.0141C10.9963 20.9135 10.7757 20.766 10.59 20.58L2 12V2H12L20.59 10.59C20.9625 10.9625 21.1716 11.4688 21.1716 12C21.1716 12.5312 20.9625 13.0375 20.59 13.41V13.41Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="7" cy="7" r="1" fill="currentColor"/>
  </svg>
);

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M23 21V19C23 18.1645 22.7155 17.3541 22.2094 16.7012C21.7033 16.0484 20.9975 15.5902 20.2 15.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 3.13C16.8975 3.28016 17.6033 3.73835 18.1094 4.39118C18.6155 5.04402 18.9 5.85447 18.9 6.69C18.9 7.52553 18.6155 8.33598 18.1094 8.98882C17.6033 9.64165 16.8975 10.0998 16 10.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MegaphoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 11L18.5 3.5C19.0304 3.27446 19.6196 3.23131 20.1741 3.37808C20.7286 3.52485 21.2196 3.8537 21.5728 4.31574C21.9261 4.77778 22.1217 5.34696 22.1288 5.93391C22.1359 6.52087 21.9541 7.09515 21.6122 7.56789L18 12H8L3 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11.6 16.8C11.3522 17.2975 10.9706 17.7186 10.4963 18.0188C10.0219 18.3191 9.47361 18.4863 8.91094 18.5022C8.34828 18.5181 7.79094 18.3823 7.29965 18.1095C6.80836 17.8368 6.40344 17.4381 6.13 16.96" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
    <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ShoppingCartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="21" r="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="20" cy="21" r="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MessageSquareIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Main navigation items
const mainNavItems = [
  { label: "Home", href: "/", icon: HomeIcon },
  { label: "Deals", href: "/deals", icon: TagIcon },
  { label: "Reviews", href: "/reviews", icon: StarIcon },
  { label: "Creators", href: "/influencer/all", icon: UsersIcon },
  { label: "Businesses", href: "/business/all", icon: UsersIcon },
  { label: "Campaigns", href: "/campaigns", icon: MegaphoneIcon },
];

// Category items
const categoryItems = [
  "All",
  "Banking",
  "Shopping", 
  "Entertainment",
  "Fashion & Beauty",
  "Health & Wellness",
  "Business",
  "Furniture",
  "Electronics",
  "Automotive",
  "Kidswear",
  "Technology",
  "Art and Crafts",
  "Film industry",
  "Mechanics",
  "Fashion"
];

export const Logo = () => {
  return (
    <Link href="/" className="flex items-center">
      <div className="mr-2 bg-blue-500 rounded">
        <Image src="/logo.svg" alt="Adscod Logo" width={32} height={32} />
      </div>
      <span className="text-xl font-bold text-gray-900">
        Adscod
      </span>
    </Link>
  );
};

export const FeedNavbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { searchTerm, setSearchTerm, activeCategory, setActiveCategory } = useSearch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [localSearchValue, setLocalSearchValue] = useState("");
  const [mobileSearchValue, setMobileSearchValue] = useState("");
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(false);
  const categoriesRef = useRef<HTMLDivElement>(null);

  const isPathActive = (linkPath: string) => {
    if (linkPath === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(linkPath);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  const handleSearchChange = (value: string) => {
    setLocalSearchValue(value);
    setSearchTerm(value);
  };

  const handleMobileSearchChange = (value: string) => {
    setMobileSearchValue(value);
    setSearchTerm(value);
  };

  const scrollCategories = (direction: 'left' | 'right') => {
    const el = categoriesRef.current;
    if (!el) return;
    const scrollAmount = 280; // tune scroll distance
    el.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  };

  const updateScrollButtons = () => {
    const el = categoriesRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setShowLeftScroll(scrollLeft > 8);
    setShowRightScroll(scrollLeft + clientWidth < scrollWidth - 8);
  };

  useEffect(() => {
    updateScrollButtons();
    const onResize = () => updateScrollButtons();
    window.addEventListener('resize', onResize);
    const el = categoriesRef.current;
    if (el) el.addEventListener('scroll', updateScrollButtons, { passive: true });
    return () => {
      window.removeEventListener('resize', onResize);
      if (el) el.removeEventListener('scroll', updateScrollButtons);
    };
  }, []);

  return (
    <div className="sticky top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      {/* Main Navigation Bar */}
      <nav className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Layout */}
          <div className="md:hidden flex items-center justify-between w-full">
            {/* Left: Hamburger Menu */}
            <button 
              onClick={toggleMobileMenu}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
            
            {/* Center: Logo */}
            <div className="flex-1 flex justify-center ">
              <Logo />
            </div>
            
            {/* Right: Search Icon */}
            <button 
              onClick={toggleSearch}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Search"
            >
              <SearchIcon />
            </button>
          </div>

          {/* Desktop Layout */}
          <div className="hidden z-70 md:flex items-center justify-between w-full gap-6">
            {/* Left Section - Logo, Explore & Create */}
            <div className="flex items-center gap-4 flex-shrink-0">
              {/* Logo */}
              <Logo />
              
              {/* Explore Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="flex items-center gap-2 ml-10 text-gray-700 hover:text-gray-900 font-medium px-3"
                  >
                    Explore
                    <ChevronDownIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48 z-[10000]">
                  {mainNavItems.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link
                        href={item.href}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              
            </div>

            {/* Center Section - Search Bar */}
            <div className="flex-1 max-w-1xl mx-8 ">
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <SearchIcon />
                </div>
                <Input
                  type="text"
                  placeholder="Search creators, products, or deals..."
                  value={localSearchValue}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full px-4 py-2.5 h-10 pl-12 pr-10 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-3 forcus:ring-offset-0 focus:ring-blue-500 focus:border-blue-500"
                />
                {localSearchValue && (
                  <button
                    onClick={() => handleSearchChange("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Clear search"
                  >
                    <CloseIcon />
                  </button>
                )}
              </div>
              
            </div>
            {/* Create Button */}
              <Button className="bg-blue-600 hover:bg-blue-800 text-white rounded-full h-10 w-[11%] px-6 py-2 flex items-center gap-2 mr-[100px]">
                <PlusIcon />
                <span>Create Store</span>
              </Button>

            {/* Right Section - Icons & Avatar */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Notification Bell */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100">
                <BellIcon />
              </button>

             
              {/* Shopping Cart */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100">
                <ShoppingCartIcon />
              </button>

              {/* User Avatar */}
              <div className="ml-2">
                <UserAuthButton />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Search Bar (when open) */}
      {isSearchOpen && (
        <div className="md:hidden border-t border-gray-200 p-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search"
              value={mobileSearchValue}
              onChange={(e) => handleMobileSearchChange(e.target.value)}
              className="w-full px-4 py-2 pl-4 pr-20 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              {mobileSearchValue && (
                <button
                  onClick={() => handleMobileSearchChange("")}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Clear search"
                >
                  <CloseIcon />
                </button>
              )}
              <button 
                className="text-gray-400 hover:text-gray-600" 
                onClick={() => {
                  router.push("/business/all");
                  setIsSearchOpen(false);
                }}
              >
                <SearchIcon />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Drawer */}
      <>
        {/* Backdrop/Overlay */}
        <div 
          className={`md:hidden fixed inset-0 bg-transparent z-40 transition-opacity duration-300 ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={closeMobileMenu}
        />
        
        {/* Drawer */}
        <div 
          className={`md:hidden fixed top-0 left-0 h-full w-80 bg-white z-50 shadow-xl transform transition-transform duration-300 ease-out overflow-y-auto ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <Logo />
            <button 
              onClick={closeMobileMenu}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="p-4">
            {/* Main Navigation Links */}
            <div className="space-y-2 mb-">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Navigation</h3>
              {mainNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={`flex items-center gap-3 p-3 rounded-lg text-base font-medium transition-all duration-200 ${
                    isPathActive(item.href)
                      ? "text-blue-600 bg-blue-50 border-r-2 border-blue-600"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Mobile Actions */}
            <div className="space-y-4 border-t border-gray-200 pt-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Actions</h3>
              
              <button 
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                onClick={closeMobileMenu}
              >
                <PlusIcon />
                Create store
              </button>

              <button 
                className="w-full flex items-center gap-3 relative p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors rounded-lg"
                onClick={closeMobileMenu}
              >
                <BellIcon />
                <span className="text-sm font-medium">Notifications</span>
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  9
                </span>
              </button>

              <div className="pt-4 border-t border-gray-100">
                <UserAuthButton />
              </div>
            </div>
          </div>
        </div>
      </>

      {/* Category Navigation - Only show on landing page */}
      {pathname === "/" && (
      <div className="bg-white w-full border-t border-gray-100">
        <div className="w-full px-4 sm:px-6 lg:px-8 relative">
          {/* Left chevron */}
          {showLeftScroll && (
            <button
              onClick={() => scrollCategories('left')}
              className="absolute left-4 sm:left-6 lg:left-8 top-1/2 -translate-y-1/2 bg-white shadow-sm rounded-full p-2 border border-gray-200 hover:bg-gray-50 transition-colors z-10 hidden sm:inline-flex"
              aria-label="Scroll left"
            >
              {/* Reuse right icon rotated */}
              <div className="-rotate-180"> <ChevronRightIcon /> </div>
            </button>
          )}

          <div 
            ref={categoriesRef}
            className="flex items-center gap-3 py-3 overflow-x-auto scrollbar-hide px-8"
          >
            {categoryItems.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-5 py-2 text-sm font-medium whitespace-nowrap rounded-full transition-colors border ${
                  activeCategory === category
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white text-gray-800 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Right chevron */}
          {showRightScroll && (
            <button
              onClick={() => scrollCategories('right')}
              className="absolute right-4 sm:right-6 lg:right-8 top-1/2 -translate-y-1/2 bg-white shadow-sm rounded-full p-2 border border-gray-200 hover:bg-gray-50 transition-colors z-10 hidden sm:inline-flex"
              aria-label="Scroll right"
            >
              <ChevronRightIcon />
            </button>
          )}
        </div>
      </div>
      )}
    </div>
  );
};