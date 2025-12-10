"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface ProductStatusCardProps {
  product?: any;
  // If provided, register will be used for the select (react-hook-form)
  register?: any;
  // Controlled props - used when not using register
  statusValue?: string;
  onStatusChange?: (value: string) => void;
  updateProduct?: (patch: Partial<any>) => void;
  // scheduling
  showScheduleButton?: boolean;
  onOpenSchedule?: () => void;
}

export function ProductStatusCard({
  product,
  register,
  statusValue,
  onStatusChange,
  updateProduct,
  showScheduleButton = false,
  onOpenSchedule,
}: ProductStatusCardProps) {
  const handleStatusChange = (value: string) => {
    if (onStatusChange) onStatusChange(value);
    if (updateProduct) updateProduct({ status: value } as any);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label className="mb-1">Status</Label>
            {register ? (
              <Select {...register("status")} defaultValue={product?.status}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Select value={statusValue || product?.status || "DRAFT"} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
            )}
            <p className="text-sm text-muted-foreground mt-1">
              This product will be available to 2 sale channels
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Sale channels and Apps</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="select-all" defaultChecked />
                <Label htmlFor="select-all">Select all</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="online-store" defaultChecked />
                <Label htmlFor="online-store">Online Store</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="buy-button" defaultChecked />
                <Label htmlFor="buy-button">Buy Button</Label>
              </div>
            </div>
            {showScheduleButton && (
              <Button
                type="button"
                variant="link"
                className="text-pink-500 mt-2 h-auto p-0"
                onClick={onOpenSchedule}
              >
                Schedule availability
              </Button>
            )}

            {/* show scheduled info if available on product */}
            {product?.isScheduled && (product?.scheduledPublishDate || product?.scheduledUnpublishDate) && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-xs text-blue-800">
                  <strong>Scheduled:</strong>
                  {product?.scheduledPublishDate && (
                    <span className="block mt-1">Publish: {new Date(product.scheduledPublishDate).toLocaleString()}</span>
                  )}
                  {product?.scheduledUnpublishDate && (
                    <span className="block mt-1">Unpublish: {new Date(product.scheduledUnpublishDate).toLocaleString()}</span>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProductStatusCard;
