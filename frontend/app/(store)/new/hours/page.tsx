"use client";
import React from "react";
import { Clock } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  StoreFormData,
  storeFormSchema,
  BusinessHours,
} from "@/lib/validations/store";
import { useStoreForm } from "@/store/use-store-form";
import { StoreFormLayout } from "../components/store-form-layout";
import { StorePreview } from "../components/store-preview";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const timeOptions = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, "0");
  return { value: `${hour}:00`, label: `${hour}:00` };
});

const defaultBusinessHours: BusinessHours = {
  monday: { isOpen: false, open: "00:00", close: "00:00" },
  tuesday: { isOpen: false, open: "00:00", close: "00:00" },
  wednesday: { isOpen: false, open: "00:00", close: "00:00" },
  thursday: { isOpen: false, open: "00:00", close: "00:00" },
  friday: { isOpen: false, open: "00:00", close: "00:00" },
  saturday: { isOpen: false, open: "00:00", close: "00:00" },
  sunday: { isOpen: false, open: "00:00", close: "00:00" },
};

const BusinessHoursPage = () => {
  const { formData, setFormData } = useStoreForm();

  const methods = useForm<StoreFormData>({
    resolver: zodResolver(storeFormSchema),
    defaultValues: {
      ...formData,
      businessHours: formData.businessHours || defaultBusinessHours,
      hasSpecialHours: formData.hasSpecialHours || false,
    },
  });

  // Update store data when business hours change
  React.useEffect(() => {
    const subscription = methods.watch((value) => {
      setFormData(value as Partial<StoreFormData>);
    });
    return () => subscription.unsubscribe();
  }, [methods, setFormData]);

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

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ] as const;

  type DayKey = Lowercase<(typeof days)[number]>;

  const handleDayToggle = (day: (typeof days)[number], checked: boolean) => {
    const dayKey = day.toLowerCase() as DayKey;
    methods.setValue(`businessHours.${dayKey}.isOpen` as const, checked, {
      shouldValidate: true,
    });
  };

  const handleTimeChange = (
    day: (typeof days)[number],
    type: "open" | "close",
    value: string
  ) => {
    const dayKey = day.toLowerCase() as DayKey;
    methods.setValue(`businessHours.${dayKey}.${type}` as const, value, {
      shouldValidate: true,
    });
  };

  const handleSpecialHoursToggle = (checked: boolean) => {
    methods.setValue("hasSpecialHours", checked, {
      shouldValidate: true,
    });
  };

  return (
    <FormProvider {...methods}>
      <StoreFormLayout onSubmit={onSubmit}>
        <div className="flex gap-6">
          <div className="flex-1">
            {/* Business Hours Form */}
            <div className="bg-white rounded p-6 border border-gray-100">
              <h2 className="text-lg font-semibold mb-6">Business Hours</h2>

              <div className="space-y-4">
                {days.map((day) => {
                  const dayKey = day.toLowerCase() as DayKey;
                  const dayData = methods.watch(`businessHours.${dayKey}`);

                  return (
                    <div key={day} className="flex items-center space-x-4">
                      <div className="w-32">
                        <Label className="text-sm font-medium text-gray-700">
                          {day}
                        </Label>
                      </div>

                      <div className="flex items-center space-x-10">
                        {/* Toggle Switch */}
                        <div className="flex items-center space-x-6">
                          <Switch
                            id={`toggle-${day}`}
                            checked={dayData?.isOpen}
                            onCheckedChange={(checked) =>
                              handleDayToggle(day, checked)
                            }
                          />
                          <Label
                            htmlFor={`toggle-${day}`}
                            className="text-sm text-gray-600"
                          >
                            {!dayData?.isOpen ? "Closed" : "Open"}
                          </Label>
                        </div>

                        {dayData?.isOpen && (
                          <div className="flex items-center space-x-4">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <Select
                              value={dayData.open}
                              onValueChange={(value) =>
                                handleTimeChange(day, "open", value)
                              }
                            >
                              <SelectTrigger className="w-[100px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {timeOptions.map((time) => (
                                  <SelectItem
                                    key={time.value}
                                    value={time.value}
                                  >
                                    {time.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <span className="text-gray-500">to</span>

                            <Select
                              value={dayData.close}
                              onValueChange={(value) =>
                                handleTimeChange(day, "close", value)
                              }
                            >
                              <SelectTrigger className="w-[100px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {timeOptions.map((time) => (
                                  <SelectItem
                                    key={time.value}
                                    value={time.value}
                                  >
                                    {time.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                        {!dayData?.isOpen && (
                          <span className="text-sm text-gray-500">
                            Closed all day
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Special Hours Toggle */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <div className="flex items-start space-x-3">
                    <Switch
                      id="special-hours"
                      checked={methods.watch("hasSpecialHours")}
                      onCheckedChange={handleSpecialHoursToggle}
                    />
                    <div>
                      <Label
                        htmlFor="special-hours"
                        className="text-sm font-medium text-gray-700"
                      >
                        Enable special hours for holidays and events
                      </Label>
                      <p className="text-sm text-gray-500 mt-1">
                        Configure special business hours for holidays, events,
                        or temporary changes
                      </p>
                    </div>
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

export default BusinessHoursPage;
