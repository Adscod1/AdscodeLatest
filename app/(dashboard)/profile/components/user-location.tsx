import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Box } from "lucide-react";
import { MapPin } from "lucide-react";
import React from "react";
import { Role } from "@prisma/client";

interface UserLocationProps {
  location: string | null | undefined;
  role: Role | undefined;
}

const UserLocation = ({ location, role }: UserLocationProps) => {
  if (!location || !role) return null;

  const roleName =
    role === "ADMIN" ? (
      "Admin"
    ) : role === "INFLUENCER" ? (
      "Influencer"
    ) : (
      <Badge variant="default">
        Become an Influencer
        <ArrowUpRight size={14} />
      </Badge>
    );

  return (
    <div className="flex flex-col w-full mt-4 gap-2">
      <div className="flex items-center gap-2 text-xs text-gray-600">
        <MapPin size={14} />
        <span>{location || "Enter Location"}</span>
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-600">
        <Box size={14} />
        <span>{roleName}</span>
      </div>
    </div>
  );
};

export default UserLocation;
