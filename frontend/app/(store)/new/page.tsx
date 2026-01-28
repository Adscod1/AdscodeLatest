"use client";
import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StoreFormData, storeFormSchema } from "@/lib/validations/store";
import { useStoreForm } from "@/store/use-store-form";
import { FoundingDatePicker } from "./components/founding-date-picker";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { StoreFormLayout } from "./components/store-form-layout";
import { StorePreview } from "./components/store-preview";



const BUSINESS_CATEGORIES = [
  "Electronics",
  "Fashion",
  "Banking",
  "Entertainment",
  "Wellness & Fitness",
  "Beauty & Personal Care",
  "Education & Learning",
  "Finance & Investment",
  "Marketing",
  "Advertising",
  "Consulting",
  "Shopping",
  "Media & Publishing",
  "Transportation",
  "Logistics",
  "Healthcare",
  "Agriculture",
  "Environmental Services",
  "Renewable Energy",
  "Non-Profit & Charity",
  "Legal Services",
  "HR & Recruitment",
  "Telecommunications",
  "Insurance",
  "Construction",
  "Hotel & Hospitality",
  "Music & Audio",
  "Gaming",
  "Sports",
  "Lifestyle",
  "Events",
  "Weddings",
  "Photography & Videography",
  "Food & Beverage",
  "Apparel",
  "Health",
  "Technology",
  "Automotive",
  "Real Estate",
  "Home & Garden",
  "Beauty & Cosmetics",
  "Sports & Fitness",
  "Books & Media",
  "Toys & Games",
  "Pet Supplies",
  "Jewelry & Accessories",
  "Art & Crafts",
  "Tourism & Travel",
  "Education",
  "Professional Services",
  "Restaurants & Catering",
  "Other",
];

const CreateNewStorePage = () => {
  const { formData, setFormData } = useStoreForm();
  const hasInitialized = React.useRef(false);
  const [showAllCategories, setShowAllCategories] = React.useState(false);

  const methods = useForm<StoreFormData>({
    resolver: zodResolver(storeFormSchema),
    defaultValues: formData,
  });

  // Reset form with latest data only once when component mounts
  React.useEffect(() => {
    if (!hasInitialized.current) {
      methods.reset(formData);
      hasInitialized.current = true;
    }
  }, []); // Empty dependency array - only run once

  // Update store data when form changes
  React.useEffect(() => {
    const subscription = methods.watch((value) => {
      setFormData(value as Partial<StoreFormData>);
    });
    return () => subscription.unsubscribe();
  }, [methods.watch, setFormData]);

  return (
    <FormProvider {...methods}>
      <StoreFormLayout>
        <div className="flex gap-6">
          <div className="flex-1">
            {/* Basic Information Form */}
            <div className="bg-white rounded p-6 border border-gray-100">
              <h2 className="text-lg font-semibold mb-6">Basic Information</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Store Name
                  </label>
                  <Input
                    {...methods.register("name")}
                    placeholder="Enter your store name"
                  />
                  {methods.formState.errors.name && (
                    <p className="mt-1 text-sm text-destructive">
                      {methods.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <Input
                    {...methods.register("username")}
                    placeholder="Enter your store username"
                  />
                  {methods.formState.errors.username && (
                    <p className="mt-1 text-sm text-destructive">
                      {methods.formState.errors.username.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tagline
                  </label>
                  <Input
                    {...methods.register("tagline")}
                    placeholder="A short phrase that describes your business"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <Textarea
                    {...methods.register("description")}
                    placeholder="Describe your business"
                    rows={3}
                    className="h-28"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Category
                  </label>
                  <Select
                    onValueChange={(value) => {
                      if (value === "show-more") {
                        setShowAllCategories(true);
                      } else {
                        methods.setValue("category", value);
                      }
                    }}
                    value={methods.watch("category") || ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {(showAllCategories 
                        ? BUSINESS_CATEGORIES 
                        : BUSINESS_CATEGORIES.slice(0, 10)
                      ).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                      {!showAllCategories && (
                        <SelectItem 
                          value="show-more" 
                          className="text-blue-600 font-medium"
                        >
                          Show more categories...
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Registration Number
                  </label>
                  <Input
                    {...methods.register("regNumber")}
                    placeholder="Enter your registration number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year Established
                  </label>
                  <FoundingDatePicker />
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

export default CreateNewStorePage;
