import { Users } from "lucide-react";
import React from "react";

const UserEngagement = () => {
  return (
    <div className="flex items-center text-sm text-gray-500 gap-2 mt-1">
      <span className="flex items-center gap-1">
        <Users size={14} /> 11.K followers
      </span>
      <span className="h-1 w-1 bg-gray-400 rounded-full"></span>
      <span className="flex items-center gap-1">11.K engagement</span>
    </div>
  );
};

export default UserEngagement;
