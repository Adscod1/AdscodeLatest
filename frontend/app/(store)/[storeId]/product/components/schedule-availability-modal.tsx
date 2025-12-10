"use client";

import * as React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarIcon, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface ScheduleAvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    scheduledPublishDate?: Date | null;
    scheduledUnpublishDate?: Date | null;
    isScheduled: boolean;
  }) => void;
  initialPublishDate?: Date | null;
  initialUnpublishDate?: Date | null;
  initialIsScheduled?: boolean;
}

export function ScheduleAvailabilityModal({
  isOpen,
  onClose,
  onSave,
  initialPublishDate,
  initialUnpublishDate,
  initialIsScheduled = false,
}: ScheduleAvailabilityModalProps) {
  const [publishDate, setPublishDate] = React.useState<Date | null>(
    initialPublishDate || null
  );

  React.useEffect(() => {
    if (isOpen) {
      setPublishDate(initialPublishDate || null);
    }
  }, [initialPublishDate, isOpen]);

  const handleDateChange = (date: Date | null) => {
    console.log("Date selected:", date);
    setPublishDate(date);
  };

  const handleSave = () => {
    onSave({
      scheduledPublishDate: publishDate,
      scheduledUnpublishDate: null,
      isScheduled: !!publishDate,
    });
    onClose();
  };

  const handleClear = () => {
    setPublishDate(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Schedule Availability</DialogTitle>
          <DialogDescription>
            Set when this product should become available and when it should be removed from sale.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Publish Date */}
          <div className="space-y-2">
            <Label htmlFor="publish-date">
              Publish Date & Time
              <span className="text-sm font-normal text-muted-foreground ml-2">
              </span>
            </Label>
            <p className="text-sm text-muted-foreground mb-2">
              Product will become available at this date and time
            </p>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                    <CalendarIcon className="h-4 w-4 text-gray-500" />
                  </div>
                  <DatePicker
                    selected={publishDate}
                    onChange={handleDateChange}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    placeholderText="Select publish date and time"
                    minDate={new Date()}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    wrapperClassName="w-full"
                  />
                  {publishDate && (
                    <button
                      onClick={() => setPublishDate(null)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Info Message */}
              {publishDate && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                  <p className="text-sm text-blue-800">
                    Product will be published on {publishDate.toLocaleString()}
                  </p>
                </div>
              )}
        </div>        <DialogFooter>
          <Button variant="outline" onClick={handleClear}>
            Clear
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Schedule</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
