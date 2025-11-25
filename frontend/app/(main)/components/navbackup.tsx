"use client";

import Link from "next/link";
import { navLinks, NavLinkType } from "@/data";
import { usePathname } from "next/navigation";
import { UserAuthButton } from "./UserAuthButton";

export const Logo = () => {
  return (
    <Link href="/" className="text-2xl font-bold flex items-center">
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
      <span className="ml-2">Adscod</span>
    </Link>
  );
};

const NavLink = ({
  href,
  children,
  subText,
  Icon,
  isActive,
}: {
  href: string;
  children: React.ReactNode;
  subText: string;
  Icon: React.ElementType;
  isActive?: boolean;
}) => {
  return (
    <Link
      href={href}
      className={`font-bold flex flex-row gap-2 transition-all ${
        isActive ? "text-blue-600" : "hover:opacity-80 text-gray-700"
      }`}
    >
      <Icon className={`size-4 mt-1 ${isActive ? "text-blue-600" : ""}`} />
      <div className="flex items-center gap-1">
        <div className="flex flex-col relative">
          <h1 className="text-sm font-semibold">{children}</h1>
          <span
            className={`text-[11px] font-normal ${
              isActive ? "text-blue-500" : "text-gray-500"
            }`}
          >
            {subText}
          </span>
        </div>
      </div>
    </Link>
  );
};

export const FeedNavbar = () => {
  const pathname = usePathname();

  // More precise path matching function
  const isPathActive = (linkPath: string) => {
    if (linkPath === "/") {
      return pathname === "/";
    }

    // Handle special cases
    if (linkPath === "/influencer/all") {
      return pathname.includes("influencer");
    }

    if (linkPath === "/dashboard") {
      return pathname.includes("dashboard");
    }

    if (linkPath === "/reviews") {
      return pathname.includes("reviews");
    }

    return linkPath === pathname;
  };

  return (
    <nav className=" top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto px-4 h-24 flex items-center">
        <Logo />
        <div className="flex items-center gap-8 w-full justify-center ">
          {navLinks.map((link: NavLinkType) => (
            <NavLink
              key={link.href}
              href={link.href}
              subText={link.subText}
              Icon={link.icon}
              isActive={isPathActive(link.href)}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <UserAuthButton />
        </div>
      </div>
    </nav>
  );
};
