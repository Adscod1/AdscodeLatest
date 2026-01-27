"use client";

import * as React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { StoreFormData } from "@/lib/validations/store";

export function FoundingDatePicker() {
  const { setValue, watch } = useFormContext<StoreFormData>();
  const date = watch("yearEstablished");

  const handleChange = (selectedDate: Date | null) => {
    setValue("yearEstablished", selectedDate, { shouldValidate: true });
  };

  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
        <CalendarIcon className="h-4 w-4 text-gray-500" />
      </div>
      <DatePicker
        selected={date}
        onChange={handleChange}
        dateFormat="dd MMMM yyyy"
        placeholderText="Pick a date"
        maxDate={new Date()}
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        calendarClassName="shadow-lg border border-gray-200 rounded-lg"
        wrapperClassName="w-full"
      />
    </div>
  );
}
