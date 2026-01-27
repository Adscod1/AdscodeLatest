"use client";
import React, { useState } from "react";
import { ChevronLeft, Calendar, Clock, Plus, Trash2, ChevronLeft as ChevronLeftIcon, ChevronRight } from "lucide-react";
import { ProductTabs } from "../../../product/components/product-tabs";
import { useForm } from "react-hook-form";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useServiceStore } from "@/store/use-service-store";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
}

interface ServiceDeliveryInput {
  requiresBooking?: boolean;
  storeId: string;
}

const ServiceDeliveryInfo = () => {
  const { storeId } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editServiceId = searchParams.get('edit');
  const isEditMode = !!editServiceId;
  
  const { service, updateService, reset } = useServiceStore();

  const [selectedDays, setSelectedDays] = useState<string[]>(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    { id: "1", startTime: "09:00", endTime: "12:00" },
    { id: "2", startTime: "14:00", endTime: "18:00" },
  ]);
  const [appointmentDuration, setAppointmentDuration] = useState("1 hour");
  const [bufferTime, setBufferTime] = useState("15 minutes");
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 11, 11)); // December 11, 2025
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 11, 1));

  const { handleSubmit, setValue, watch } = useForm<ServiceDeliveryInput>({
    defaultValues: {
      ...service,
      storeId: storeId as string,
      requiresBooking: service.requiresBooking || false,
    },
  });

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const toggleDay = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const addTimeSlot = () => {
    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      startTime: "09:00",
      endTime: "17:00",
    };
    setTimeSlots([...timeSlots, newSlot]);
  };

  const removeTimeSlot = (id: string) => {
    setTimeSlots(timeSlots.filter(slot => slot.id !== id));
  };

  const updateTimeSlot = (id: string, field: "startTime" | "endTime", value: string) => {
    setTimeSlots(timeSlots.map(slot =>
      slot.id === id ? { ...slot, [field]: value } : slot
    ));
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const onSubmit = (data: ServiceDeliveryInput) => {
    updateService({
      ...data,
      storeId: storeId as string,
    });
    
    // If in edit mode, navigate with the edit parameter
    if (isEditMode && editServiceId) {
      router.push(`/${storeId}/service/new/publishing?edit=${editServiceId}`);
    } else {
      router.push(`/${storeId}/service/new/publishing`);
    }
  };

  const handleCancel = () => {
    reset();
    router.push(`/${storeId}/products`);
  };

  if (!service.title) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No service data found</h2>
          <p className="text-gray-600 mb-4">Please start by creating the basic service information.</p>
          <Button asChild>
            <Link href={`/${storeId}/service/new`}>Start Creating Service</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 py-4 bg-white border-b gap-4 sm:gap-0">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <Button
            variant="ghost"
            className="flex items-center text-gray-600 hover:text-gray-900 text-sm sm:text-base"
            asChild
          >
            <Link href={`/${storeId}/products`}>
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Back to service listing</span>
              <span className="sm:hidden">Back</span>
            </Link>
          </Button>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
          <Button variant="outline" onClick={() => router.back()} className="flex-1 sm:flex-none text-sm">
            Back
          </Button>
          <Button variant="outline" onClick={handleCancel} className="flex-1 sm:flex-none text-sm">
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} className="flex-1 sm:flex-none text-sm">
            Continue
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <ProductTabs activeTab="Scheduling" type="service" />
        
        {/* Scheduling & Availability Form */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8 py-6 border-b">
            <h2 className="text-xl sm:text-2xl font-semibold">Scheduling & Availability</h2>
            <p className="text-sm text-gray-500 mt-1">
              Configure booking and availability
            </p>
          </div>
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-5xl">
              {/* Requires Booking Checkbox */}
              <div className="flex items-center space-x-2 bg-gray-50 border border-gray-200 rounded-lg p-4">
                <Checkbox
                  id="requiresBooking"
                  checked={watch("requiresBooking")}
                  onCheckedChange={(checked) => setValue("requiresBooking", checked as boolean)}
                />
                <Label htmlFor="requiresBooking" className="text-sm font-normal cursor-pointer">
                  Requires booking/appointment
                </Label>
              </div>

              {/* Booking Configuration - Shows when checkbox is checked */}
              {watch("requiresBooking") && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  {/* Available Days */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold">Available Days</h3>
                    </div>
                    <p className="text-sm text-gray-500">
                      Select which days of the week you're available for bookings
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {days.map((day) => (
                        <Button
                          key={day}
                          type="button"
                          onClick={() => toggleDay(day)}
                          variant={selectedDays.includes(day) ? "default" : "outline"}
                          className={selectedDays.includes(day) ? "bg-blue-600 hover:bg-blue-700" : ""}
                        >
                          {day}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Time Slots */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold">Time Slots</h3>
                    </div>
                    <p className="text-sm text-gray-500">
                      Define your available time windows for each day
                    </p>
                    <div className="space-y-3">
                      {timeSlots.map((slot, index) => (
                        <div key={slot.id} className="flex items-center gap-4">
                          <span className="text-sm font-medium min-w-[60px]">Slot {index + 1}</span>
                          <Input
                            type="time"
                            value={slot.startTime}
                            onChange={(e) => updateTimeSlot(slot.id, "startTime", e.target.value)}
                            className="w-32"
                          />
                          <span className="text-sm text-gray-500">to</span>
                          <Input
                            type="time"
                            value={slot.endTime}
                            onChange={(e) => updateTimeSlot(slot.id, "endTime", e.target.value)}
                            className="w-32"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeTimeSlot(slot.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addTimeSlot}
                        className="flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Time Slot
                      </Button>
                    </div>
                  </div>

                  {/* Appointment Duration and Buffer Time */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <Label className="font-semibold">Appointment Duration</Label>
                      </div>
                      <p className="text-sm text-gray-500">
                        How long each appointment slot should be
                      </p>
                      <Select value={appointmentDuration} onValueChange={setAppointmentDuration}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15 minutes">15 minutes</SelectItem>
                          <SelectItem value="30 minutes">30 minutes</SelectItem>
                          <SelectItem value="45 minutes">45 minutes</SelectItem>
                          <SelectItem value="1 hour">1 hour</SelectItem>
                          <SelectItem value="1.5 hours">1.5 hours</SelectItem>
                          <SelectItem value="2 hours">2 hours</SelectItem>
                          <SelectItem value="3 hours">3 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <Label className="font-semibold">Buffer Time</Label>
                      </div>
                      <p className="text-sm text-gray-500">
                        Time between consecutive appointments
                      </p>
                      <Select value={bufferTime} onValueChange={setBufferTime}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0 minutes">No buffer</SelectItem>
                          <SelectItem value="5 minutes">5 minutes</SelectItem>
                          <SelectItem value="10 minutes">10 minutes</SelectItem>
                          <SelectItem value="15 minutes">15 minutes</SelectItem>
                          <SelectItem value="30 minutes">30 minutes</SelectItem>
                          <SelectItem value="1 hour">1 hour</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Calendar Preview */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold">Calendar Preview</h3>
                    </div>
                    <p className="text-sm text-gray-500">
                      Preview and select specific dates to block or customize
                    </p>
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      {/* Calendar Header */}
                      <div className="flex items-center justify-between mb-6">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={prevMonth}
                        >
                          <ChevronLeftIcon className="w-5 h-5" />
                        </Button>
                        <h4 className="text-lg font-semibold">
                          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={nextMonth}
                        >
                          <ChevronRight className="w-5 h-5" />
                        </Button>
                      </div>

                      {/* Calendar Grid */}
                      <div className="grid grid-cols-7 gap-2">
                        {/* Day headers */}
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                            {day}
                          </div>
                        ))}
                        
                        {/* Empty cells for days before month starts */}
                        {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                          <div key={`empty-${i}`} className="aspect-square" />
                        ))}
                        
                        {/* Calendar days */}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                          const day = i + 1;
                          const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                          const isSelected = selectedDate.toDateString() === date.toDateString();
                          const isToday = new Date().toDateString() === date.toDateString();
                          
                          return (
                            <button
                              key={day}
                              type="button"
                              onClick={() => setSelectedDate(date)}
                              className={`
                                aspect-square rounded-lg flex items-center justify-center text-sm
                                transition-colors
                                ${isSelected ? 'bg-blue-600 text-white font-semibold' : ''}
                                ${!isSelected && isToday ? 'bg-blue-100 text-blue-600 font-semibold' : ''}
                                ${!isSelected && !isToday ? 'hover:bg-gray-100' : ''}
                              `}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>

                      {/* Selected date display */}
                      <div className="mt-6 text-center text-sm text-gray-600">
                        Selected: {selectedDate.toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDeliveryInfo;