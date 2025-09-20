"use client";
import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StoreFormData, storeFormSchema } from "@/lib/validations/store";
import { useStoreForm } from "@/store/use-store-form";
import { Input } from "@/components/ui/input";
import { StoreFormLayout } from "../components/store-form-layout";
import { StorePreview } from "../components/store-preview";

const ContactInformationPage = () => {
  const { formData, setFormData } = useStoreForm();

  const methods = useForm<StoreFormData>({
    resolver: zodResolver(storeFormSchema),
    defaultValues: formData,
  });

  // Update store data when form changes
  React.useEffect(() => {
    const subscription = methods.watch((value) => {
      setFormData(value as Partial<StoreFormData>);
    });
    return () => subscription.unsubscribe();
  }, [methods, setFormData]);

  return (
    <FormProvider {...methods}>
      <StoreFormLayout>
        <div className="flex gap-6">
          <div className="flex-1">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-lg font-semibold mb-6">
                Contact Information
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <Input
                    {...methods.register("phone")}
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <Input
                    {...methods.register("email")}
                    type="email"
                    placeholder="store@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <Input
                    {...methods.register("website")}
                    type="url"
                    placeholder="https://www.example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <Input
                    {...methods.register("address")}
                    placeholder="Street Address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <Input {...methods.register("city")} placeholder="City" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State/Province
                  </label>
                  <Input {...methods.register("state")} placeholder="State" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP/Postal Code
                  </label>
                  <Input {...methods.register("zip")} placeholder="ZIP Code" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <Input
                    {...methods.register("country")}
                    placeholder="Country"
                  />
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

export default ContactInformationPage;
