"use client";

import { useStoreForm } from "@/store/use-store-form";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { STORE_FORM_TABS } from "../constants";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CancelDialog } from "./cancel-dialog";

interface StoreFormLayoutProps {
  children: React.ReactNode;
  onSubmit?: () => void;
  isSaving?: boolean;
}

export function StoreFormLayout({
  children,
  onSubmit,
  isSaving,
}: StoreFormLayoutProps) {
  const router = useRouter();
  const { currentStep, setCurrentStep, formData, clearAll } = useStoreForm();
  const progress = ((currentStep + 1) / STORE_FORM_TABS.length) * 100;

  // Check if there's any progress to cancel
  const hasProgress = Object.keys(formData).length > 1; // More than just the ID

  const handleBack = () => {
    const prevStep = currentStep - 1;
    if (prevStep >= 0) {
      setCurrentStep(prevStep);
      router.push(STORE_FORM_TABS[prevStep].href);
    }
  };

  const handleNext = () => {
    const nextStep = currentStep + 1;
    if (nextStep < STORE_FORM_TABS.length) {
      setCurrentStep(nextStep);
      router.push(STORE_FORM_TABS[nextStep].href);
    } else if (onSubmit) {
      onSubmit();
    }
  };

  const handleCancel = () => {
    // Clear all form data and localStorage
    clearAll();
    router.push("/new");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 container mx-auto px-8 py-8">
        {/* Progress and Tabs */}
        <div className="mb-8 space-y-6">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold">Store Profile</h1>
              <span className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {STORE_FORM_TABS.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="bg-gray-50 p-1 rounded-lg flex space-x-1">
            {STORE_FORM_TABS.map((tab, index) => (
              <Link
                key={tab.name}
                href={tab.href}
                className={cn(
                  "px-4 py-2 rounded-md text-sm transition-colors",
                  index === currentStep
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:bg-white/50"
                )}
                onClick={() => setCurrentStep(index)}
              >
                {tab.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Main Content */}
        {children}
      </div>

      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t py-4 px-8">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button variant="outline" onClick={handleBack}>
                Previous
              </Button>
            )}
            {hasProgress && <CancelDialog onCancel={handleCancel} />}
          </div>
          <Button onClick={handleNext} disabled={isSaving}>
            {isSaving
              ? "Saving..."
              : currentStep === STORE_FORM_TABS.length - 1
              ? "Save Profile"
              : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}
