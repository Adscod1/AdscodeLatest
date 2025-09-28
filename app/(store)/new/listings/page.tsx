"use client";
import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StoreFormData, storeFormSchema } from "@/lib/validations/store";
import { useStoreForm } from "@/store/use-store-form";
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
  { value: "phone", label: "Phone" },
  { value: "laptop", label: "Laptop" },
  { value: "tablet", label: "Tablet" },
  { value: "desktop", label: "Desktop" },
  { value: "accessory", label: "Accessory" },
  { value: "other", label: "Other" },
] as const;

const ListingsAndHighlightsPage = () => {
  const { formData, setFormData } = useStoreForm();

  const methods = useForm<StoreFormData>({
    resolver: zodResolver(storeFormSchema),
    defaultValues: formData,
  });

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
                  <Button
                    variant="ghost"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Highlight
                  </Button>
                </div>

                <div className="space-y-4">
                  {/* Fast Service Highlight */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <Input
                        defaultValue="Fast Service"
                        className={cn(
                          "text-lg font-medium bg-transparent border-none p-0 h-auto",
                          "focus-visible:ring-0 focus-visible:ring-offset-0"
                        )}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                    <Input
                      defaultValue="Same-day repairs for most devices."
                      className={cn(
                        "bg-transparent border-none p-0 h-auto text-gray-600",
                        "focus-visible:ring-0 focus-visible:ring-offset-0"
                      )}
                    />
                  </div>

                  {/* Free WiFi Highlight */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <Input
                        defaultValue="Free WiFi"
                        className={cn(
                          "text-lg font-medium bg-transparent border-none p-0 h-auto",
                          "focus-visible:ring-0 focus-visible:ring-offset-0"
                        )}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                    <Input
                      defaultValue="We offer free WiFi to all our visitors."
                      className={cn(
                        "bg-transparent border-none p-0 h-auto text-gray-600",
                        "focus-visible:ring-0 focus-visible:ring-offset-0"
                      )}
                    />
                  </div>
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
