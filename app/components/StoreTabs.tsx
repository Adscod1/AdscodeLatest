import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { name: "General", href: "/new" },
  { name: "Contact Information", href: "/new/contact" },
  { name: "Business Hours", href: "/new/hours" },
  { name: "Listings & Highlights", href: "/new/listings" },
  { name: "Media", href: "/new/media" },
];

export default function StoreTabs() {
  const pathname = usePathname();

  const isActiveTab = (href: string) => {
    if (href === "/new" && pathname === "/new") return true;
    return pathname === href;
  };

  return (
    <div className="bg-gray-50 p-1 rounded-lg mb-6 flex space-x-1">
      {tabs.map((tab) => (
        <Link
          key={tab.name}
          href={tab.href}
          className={`px-4 py-2 rounded-md text-sm transition-colors ${
            isActiveTab(tab.href)
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:bg-white/50"
          }`}
        >
          {tab.name}
        </Link>
      ))}
    </div>
  );
}
