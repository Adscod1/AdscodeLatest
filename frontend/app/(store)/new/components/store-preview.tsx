import { 
  Link as LinkIcon, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Check,
  Zap,
  Wifi,
  Car,
  Shield,
  Monitor,
  Plus
} from "lucide-react";
import Image from "next/image";
import { useFormContext } from "react-hook-form";
import { StoreFormData } from "@/lib/validations/store";
import { getHighlightIcon } from "@/lib/highlight-icons";
import { cn } from "@/lib/utils";
import { useStoreForm } from "@/store/use-store-form";

const businessHighlights = [
  {
    icon: Zap,
    title: "Fast Service",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600"
  },
  {
    icon: Wifi, 
    title: "Free WiFi",
    bgColor: "bg-cyan-50",
    iconColor: "text-cyan-600"
  },
  {
    icon: Car,
    title: "Parking",
    bgColor: "bg-blue-50", 
    iconColor: "text-blue-600"
  },
  {
    icon: Shield,
    title: "Warranty",
    bgColor: "bg-indigo-50",
    iconColor: "text-indigo-600"
  },
  {
    icon: Monitor,
    title: "TV & Rest Room",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600"
  },
];

const tips = [
  "Upload a logo to improve brand recognition",
  "Add social media links to expand your reach", 
  "Set accurate business hours for customer convenience"
];

// Helper function to calculate completion percentage for a section
const calculateSectionCompletion = (formData: Partial<StoreFormData>) => {
  // Basic Info fields
  const basicInfoFields = [
    formData.name,
    formData.tagline,
    formData.description,
    formData.category,
    formData.regNumber,
    formData.yearEstablished,
  ].filter(field => field !== undefined && field !== null && field !== "");
  const basicInfoCompletion = (basicInfoFields.length / 6) * 100;

  // Contact fields - Essential fields for completion
  // Required: phone, email, address, city, country
  // Optional: state, zip, website
  const requiredContactFields = [
    formData.phone,
    formData.email,
    formData.address,
    formData.city,
    formData.country,
  ].filter(field => field !== undefined && field !== null && field !== "");
  
  const optionalContactFields = [
    formData.state,
    formData.zip,
    formData.website,
  ].filter(field => field !== undefined && field !== null && field !== "");
  
  // Calculate completion: all required fields must be filled (5/5)
  // Optional fields add bonus progress
  const contactCompletion = requiredContactFields.length === 5 
    ? 100 
    : (requiredContactFields.length / 5) * 100;

  // Business Hours - check if at least one day is open with valid times
  const businessHours = formData.businessHours || {};
  const daysConfigured = Object.values(businessHours).filter(
    (day: any) => day?.isOpen === true && day?.open && day?.close
  ).length;
  const businessHoursCompletion = (daysConfigured / 7) * 100;

  // Highlights (Services)
  const highlightsCompletion = (formData.selectedHighlights?.length || 0) > 0 ? 100 : 0;

  // Media fields
  const mediaFields = [
    formData.logo,
    formData.bannerImages && formData.bannerImages.length === 3 ? "complete" : null,
  ].filter(field => field !== undefined && field !== null && field !== "");
  const mediaCompletion = (mediaFields.length / 2) * 100;

  return {
    basicInfo: basicInfoCompletion,
    contact: contactCompletion,
    businessHours: businessHoursCompletion,
    highlights: highlightsCompletion,
    media: mediaCompletion,
  };
};

export function StorePreview() {
  const context = useFormContext<StoreFormData>();
  const { activeBannerIndex } = useStoreForm();
  
  // Fallback if form context is not available
  if (!context) {
    return (
      <div className="w-80">
        <div className="bg-white rounded-xl border border-gray-200 sticky top-24">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Preview</h2>
          </div>
          <div className="p-4 text-center text-gray-500">
            <p>Fill in the form to see preview</p>
          </div>
        </div>
      </div>
    );
  }

  const { watch } = context;
  const watchedData = watch();
  const formData = watchedData || {};

  // Calculate completion percentages
  const completion = calculateSectionCompletion(formData);

  // Generate profile sections with real-time status
  const profileSections = [
    { 
      name: "Basic Info", 
      completion: completion.basicInfo,
      status: completion.basicInfo === 100 ? "Complete" : completion.basicInfo > 0 ? "In Progress" : "Not Started",
      color: "bg-green-500" 
    },
    { 
      name: "Contact", 
      completion: completion.contact,
      status: completion.contact === 100 ? "Complete" : completion.contact > 0 ? "In Progress" : "Not Started",
      color: "bg-green-500" 
    },
    { 
      name: "Business Hours", 
      completion: completion.businessHours,
      status: completion.businessHours === 100 ? "Complete" : completion.businessHours > 0 ? "In Progress" : "Not Started",
      color: "bg-green-500" 
    },
    { 
      name: "Services", 
      completion: completion.highlights,
      status: completion.highlights === 100 ? "Complete" : "Not Started",
      color: "bg-green-500" 
    },
    { 
      name: "Media", 
      completion: completion.media,
      status: completion.media === 100 ? "Complete" : completion.media > 0 ? "In Progress" : "Not Started",
      color: "bg-orange-400" 
    },
  ];

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
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Cover Image */}
            <div className="aspect-[16/10] bg-gradient-to-br from-orange-200 to-yellow-300 relative">
              {formData.bannerImages && formData.bannerImages.length > 0 ? (
                <Image
                  src={formData.bannerImages[activeBannerIndex] || formData.bannerImages[0]}
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
            <div className="p-4 pb-4 border-b border-gray-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 overflow-hidden">
                  {formData.logo ? (
                    <Image
                      src={formData.logo}
                      alt="Store logo"
                      fill
                      sizes="40px"
                      className="object-cover"
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
          <div className="pb-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Business Highlights</h3>
            <div className="flex flex-wrap gap-2">
              {formData.selectedHighlights && formData.selectedHighlights.length > 0 ? (
                formData.selectedHighlights.map((highlight) => {
                  const iconConfig = getHighlightIcon(highlight);
                  const IconComponent = iconConfig?.icon;
                  
                  return (
                    <div
                      key={highlight}
                      className="inline-flex items-center px-3 py-2 bg-white border border-gray-200 rounded-full text-xs sm:text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      {IconComponent && (
                        <IconComponent className={cn(
                          "w-3.5 h-3.5 mr-1.5 sm:w-4 sm:h-4 sm:mr-2",
                          iconConfig?.color
                        )} />
                      )}
                      <span className="whitespace-nowrap">{highlight}</span>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-gray-500">No highlights selected</p>
              )}
            </div>
          </div>

          {/* Profile Completion */}
          <div className="pb-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Profile Completion</h3>
            <div className="space-y-3">
              {profileSections.map((item) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{item.name}</span>
                    <span className={`text-xs font-medium ${
                      item.status === "Complete" 
                        ? "text-green-600" 
                        : item.status === "In Progress" 
                        ? "text-blue-600" 
                        : "text-orange-600"
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ease-out ${
                        item.status === "Complete" 
                          ? "bg-green-500" 
                          : item.status === "In Progress" 
                          ? "bg-blue-500" 
                          : "bg-orange-400"
                      }`}
                      style={{ width: `${item.completion}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips Section */}
          <div className="pb-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Tips</h3>
            <div className="space-y-3">
              {tips.map((tip, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
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