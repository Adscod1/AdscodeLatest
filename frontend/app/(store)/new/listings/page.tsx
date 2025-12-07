"use client";
import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StoreFormData, storeFormSchema } from "@/lib/validations/store";
import { useStoreForm } from "@/store/use-store-form";
import { getHighlightIcon } from "@/lib/highlight-icons";
import { StoreFormLayout } from "../components/store-form-layout";
import { StorePreview } from "../components/store-preview";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const categories = [
  // Electronics
  { value: "smartphone", label: "Smartphones" },
  { value: "laptop", label: "Laptops" },
  { value: "tablet", label: "Tablets" },
  { value: "desktop", label: "Desktop Computers" },
  { value: "accessory", label: "Electronics Accessories" },
  { value: "camera", label: "Cameras" },
  { value: "headphones", label: "Headphones & Audio" },
  
  // Fashion & Clothing
  { value: "mens_clothing", label: "Men's Clothing" },
  { value: "womens_clothing", label: "Women's Clothing" },
  { value: "shoes", label: "Shoes" },
  { value: "bags", label: "Bags & Luggage" },
  { value: "accessories_fashion", label: "Fashion Accessories" },
  { value: "jewelry", label: "Jewelry" },
  { value: "watches", label: "Watches" },
  
  // Home & Furniture
  { value: "furniture", label: "Furniture" },
  { value: "home_decor", label: "Home Decor" },
  { value: "bedding", label: "Bedding" },
  { value: "kitchen", label: "Kitchen Appliances" },
  { value: "lighting", label: "Lighting" },
  
  // Health & Beauty
  { value: "skincare", label: "Skincare" },
  { value: "cosmetics", label: "Cosmetics" },
  { value: "haircare", label: "Hair Care" },
  { value: "health_supplements", label: "Health Supplements" },
  { value: "fitness", label: "Fitness Equipment" },
  
  // Food & Beverages
  { value: "beverages", label: "Beverages" },
  { value: "snacks", label: "Snacks" },
  { value: "groceries", label: "Groceries" },
  { value: "bakery", label: "Bakery Products" },
  { value: "organic_food", label: "Organic Food" },
  
  // Sports & Outdoors
  { value: "sports_equipment", label: "Sports Equipment" },
  { value: "outdoor_gear", label: "Outdoor Gear" },
  { value: "bikes", label: "Bikes" },
  { value: "camping", label: "Camping Gear" },
  
  // Books & Media
  { value: "books", label: "Books" },
  { value: "ebooks", label: "E-Books" },
  { value: "magazines", label: "Magazines" },
  { value: "music", label: "Music & CDs" },
  
  // Toys & Games
  { value: "toys", label: "Toys" },
  { value: "games", label: "Games" },
  { value: "hobbies", label: "Hobbies & Crafts" },
  
  // Automotive
  { value: "car_parts", label: "Car Parts" },
  { value: "car_accessories", label: "Car Accessories" },
  { value: "motorcycle", label: "Motorcycle Parts" },
  
  // Pet Supplies
  { value: "pet_food", label: "Pet Food" },
  { value: "pet_accessories", label: "Pet Accessories" },
  { value: "pet_toys", label: "Pet Toys" },
  
  // Office & Stationery
  { value: "stationery", label: "Stationery" },
  { value: "office_supplies", label: "Office Supplies" },
  { value: "furniture_office", label: "Office Furniture" },
  
  // Services
  { value: "service_repair", label: "Repair Services" },
  { value: "service_cleaning", label: "Cleaning Services" },
  { value: "service_consulting", label: "Consulting Services" },
  { value: "service_tutoring", label: "Tutoring Services" },
  { value: "service_photography", label: "Photography Services" },
  { value: "service_personal_training", label: "Personal Training" },
  
  // Other
  { value: "other", label: "Other" },
] as const;

const ListingsAndHighlightsPage = () => {
  const { formData, setFormData } = useStoreForm();

  const highlights = [
    "Fast Service",
    "Free WiFi",
    "Parking",
    "Warranty",
    "TV & Rest Room",
  ];

  const methods = useForm<StoreFormData>({
    resolver: zodResolver(storeFormSchema),
    defaultValues: {
      ...formData,
      selectedHighlights: formData.selectedHighlights || [],
    },
  });

  const { watch, setValue } = methods;
  const selectedHighlights = watch("selectedHighlights") || [];

  const toggleHighlight = (highlight: string) => {
    const current = selectedHighlights || [];
    const updated = current.includes(highlight)
      ? current.filter((h) => h !== highlight)
      : [...current, highlight];
    
    setValue("selectedHighlights", updated);
    setFormData({ selectedHighlights: updated });
  };

  const onSubmit = async () => {
    try {
      const isValid = await methods.trigger();
      if (!isValid) {
        return false;
      }

      // Get the current values from the form
      const currentValues = methods.getValues();

      // Merge with existing form data to preserve other step data
      setFormData({
        ...formData,
        ...currentValues,
      });

      return true;
    } catch (error) {
      console.error("Form validation error:", error);
      return false;
    }
  };

  return (
    <FormProvider {...methods}>
      <StoreFormLayout onSubmit={onSubmit}>
        <div className="flex gap-6">
          <div className="flex-1">
            <div className="space-y-6">
              {/* Products Section */}
              

              {/* Business Highlights Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Business Highlights</h2>
                </div>

                <div className="flex flex-wrap gap-3">
                  {highlights.map((highlight) => {
                    const iconConfig = getHighlightIcon(highlight);
                    const IconComponent = iconConfig?.icon;
                    const isSelected = selectedHighlights.includes(highlight);
                    
                    return (
                      <button
                        key={highlight}
                        onClick={() => toggleHighlight(highlight)}
                        className={cn(
                          "inline-flex items-center px-5 py-2.5 rounded-full text-sm font-medium transition-all",
                          isSelected
                            ? "bg-blue-50 border border-blue-200 text-blue-700"
                            : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                        )}
                      >
                        {IconComponent && (
                          <IconComponent className={cn(
                            "w-4 h-4 mr-2",
                            isSelected ? "text-blue-500" : iconConfig?.color
                          )} />
                        )}
                        {highlight}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <StorePreview />
        </div>
      </StoreFormLayout>
    </FormProvider>
  );
};

export default ListingsAndHighlightsPage;
