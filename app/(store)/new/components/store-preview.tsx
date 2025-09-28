import { 
  Link as LinkIcon, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  CheckCircle,
  Zap,
  Wifi,
  Car,
  Shield,
  Monitor
} from "lucide-react";
import Image from "next/image";
import { useFormContext } from "react-hook-form";
import { StoreFormData } from "@/lib/validations/store";

const businessHighlights = [
  {
    icon: Zap,
    title: "Fast Service",
    description: "Same-day repairs for most devices",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600"
  },
  {
    icon: Wifi, 
    title: "Free WiFi",
    description: "We offer free WiFi to all our visitors",
    bgColor: "bg-cyan-50",
    iconColor: "text-cyan-600"
  },
  {
    icon: Car,
    title: "Parking",
    description: "We have enough parking space",
    bgColor: "bg-blue-50", 
    iconColor: "text-blue-600"
  },
  {
    icon: Shield,
    title: "Warranty",
    description: "90-day warranty on all repairs",
    bgColor: "bg-indigo-50",
    iconColor: "text-indigo-600"
  },
  {
    icon: Monitor,
    title: "TV & Rest Room",
    description: "We have ample space for you to wait in.",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600"
  },
];

const profileSections = [
  { name: "Basic Info", status: "Complete", color: "bg-green-500" },
  { name: "Contact", status: "Complete", color: "bg-green-500" },
  { name: "Business Hours", status: "Complete", color: "bg-green-500" },
  { name: "Services", status: "Complete", color: "bg-green-500" },
  { name: "Media", status: "Not Started", color: "bg-orange-400" },
];

const tips = [
  "Upload a logo to improve brand recognition",
  "Add social media links to expand your reach", 
  "Set accurate business hours for customer convenience"
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
      <div className="bg-white rounded-xl border border-gray-200 sticky top-24">
        {/* Header */}
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Preview</h2>
        </div>

        <div className="p-4 space-y-6">
          {/* Store Card */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            {/* Cover Image */}
            <div className="aspect-[16/10] bg-gradient-to-br from-orange-200 to-yellow-300 relative">
              {formData.banner ? (
                <Image
                  src={formData.banner}
                  alt="Store cover"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center text-white/70">
                    <Monitor className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-sm">Store Cover Image</p>
                  </div>
                </div>
              )}
              {/* Decorative elements */}
              <div className="absolute top-4 right-4 w-8 h-12 bg-white/20 rounded-full"></div>
              <div className="absolute top-6 right-12 w-4 h-6 bg-white/30 rounded-full"></div>
            </div>
            
            {/* Store Info Section */}
            <div className="p-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 overflow-hidden">
                  {formData.logo ? (
                    <Image
                      src={formData.logo}
                      alt="Store logo"
                      width={40}
                      height={40}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    getInitials(formData.name)
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {formData.name || "Store Name"}
                  </h3>
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-2 text-sm">
                <div className="flex items-start space-x-2 text-gray-600">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="text-xs leading-relaxed">
                    {formData.address || "business Address"}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 text-gray-600">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs">
                    {formData.phone || "contact"}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 text-gray-600">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs">
                    {formData.email || "Business email"}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 text-blue-500">
                  <Globe className="w-4 h-4 flex-shrink-0" />
                  <a href={formData.website || "#"} className="text-xs hover:underline">
                    {formData.website || "website link"}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Business Highlights */}
          <div className="mt-4">
            <h3 className="font-semibold text-gray-900 mb-4">Business Highlights</h3>
            <div className="space-y-4">
              {businessHighlights.map((highlight) => {
                const IconComponent = highlight.icon;
                return (
                  <div key={highlight.title} className="flex items-start space-x-3">
                    <div className={`w-10 h-10 ${highlight.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className={`w-5 h-5 ${highlight.iconColor}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{highlight.title}</h4>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                        {highlight.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Profile Completion */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Profile Completion</h3>
            <div className="space-y-3">
              {profileSections.map((item) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{item.name}</span>
                    <span className={`text-xs font-medium ${
                      item.status === "Complete" ? "text-green-600" : "text-orange-600"
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${item.color} ${
                        item.status === "Complete" ? "w-full" : "w-0"
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips Section */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Tips</h3>
            <div className="space-y-3">
              {tips.map((tip, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-600 leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}