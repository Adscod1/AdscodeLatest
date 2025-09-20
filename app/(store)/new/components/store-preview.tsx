import { Link as LinkIcon } from "lucide-react";
import Image from "next/image";
import { useFormContext } from "react-hook-form";
import { StoreFormData } from "@/lib/validations/store";

const businessHighlights = [
  {
    icon: "⚡",
    title: "Fast Service",
    description: "Same-day repairs for most devices",
  },
  {
    icon: "📶",
    title: "Free WiFi",
    description: "We offer free WiFi to all our visitors",
  },
  {
    icon: "🅿️",
    title: "Parking",
    description: "We have enough parking space",
  },
  {
    icon: "🔧",
    title: "Warranty",
    description: "90-day warranty on all repairs",
  },
  {
    icon: "📺",
    title: "TV & Rest Room",
    description: "We have ample space for you to wait in.",
  },
];

export function StorePreview() {
  const { watch } = useFormContext<StoreFormData>();
  const formData = watch();

  // Get initials from store name
  const getInitials = (name: string = "") => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="w-80">
      <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
        <h2 className="text-lg font-semibold mb-6">Preview</h2>

        <div className="space-y-6">
          {/* Cover Image */}
          <div className="aspect-[16/9] bg-yellow-100 rounded-lg overflow-hidden relative">
            <Image
              src="/placeholder-cover.jpg"
              alt="Store cover"
              fill
              className="object-cover"
            />
          </div>

          {/* Store Info */}
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center text-white text-sm">
                {getInitials(formData.name)}
              </div>
              <h3 className="font-semibold">{formData.name || "Store Name"}</h3>
            </div>
            <p className="text-sm text-gray-600">
              {formData.tagline || "Add a tagline for your store"}
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-3 text-sm">
            {formData.address && (
              <div className="flex items-start space-x-2">
                <div className="mt-1">📍</div>
                <span>
                  {[
                    formData.address,
                    formData.city,
                    formData.state,
                    formData.zip,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </div>
            )}
            {formData.phone && (
              <div className="flex items-center space-x-2">
                <span>📞</span>
                <span>{formData.phone}</span>
              </div>
            )}
            {formData.email && (
              <div className="flex items-center space-x-2">
                <span>📧</span>
                <span>{formData.email}</span>
              </div>
            )}
            {formData.website && (
              <div className="flex items-center space-x-2 text-blue-500">
                <LinkIcon className="w-4 h-4" />
                <a href={formData.website} className="hover:underline">
                  {formData.website}
                </a>
              </div>
            )}
          </div>

          {/* Business Highlights */}
          <div>
            <h3 className="font-semibold mb-4">Business Highlights</h3>
            <div className="space-y-4">
              {businessHighlights.map((highlight) => (
                <div
                  key={highlight.title}
                  className="flex items-start space-x-3"
                >
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-lg">
                    {highlight.icon}
                  </div>
                  <div>
                    <h4 className="font-medium">{highlight.title}</h4>
                    <p className="text-sm text-gray-600">
                      {highlight.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Profile Completion */}
          <div>
            <h3 className="font-semibold mb-4">Profile Completion</h3>
            <div className="space-y-3">
              {[
                { name: "Basic Info", status: "Complete" },
                { name: "Contact", status: "Complete" },
                { name: "Business Hours", status: "Complete" },
                { name: "Services", status: "Complete" },
              ].map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>{item.name}</span>
                    <span className="text-green-500">{item.status}</span>
                  </div>
                  <div className="h-1 bg-green-500 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
