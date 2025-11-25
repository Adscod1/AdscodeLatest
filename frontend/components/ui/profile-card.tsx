"use client";
import React from 'react';
import { Profile } from "@prisma/client";
import Image from "next/image";
import { X, Users, User } from 'lucide-react';
import { ProfileEditForm } from "@/app/(dashboard)/profile/components/profile-edit-form";

interface ProfileCardProps {
  profile: Profile | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ 
  profile, 
  isOpen, 
  onClose,
  onSuccess 
}) => {
  const [isEditing, setIsEditing] = React.useState(false);

  if (!isOpen || !profile) return null;

  const avatarUrl =
    profile?.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      profile?.name || "User"
    )}&background=000000&color=fff&size=150`;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-[60]"
        onClick={onClose}
      />
      
      {/* Profile Card */}
      <div className="fixed top-16 right-4 w-80 bg-white rounded-lg shadow-xl z-[70] max-h-[calc(100vh-5rem)] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Profile</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Profile Section */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-start">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 mr-4">
              <Image
                src={avatarUrl}
                alt={profile?.name || "Profile"}
                width={64}
                height={64}
                className="rounded-full"
              />
            </div>
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <div className="w-full">
                  <ProfileEditForm
                    profile={profile}
                    onSuccess={() => {
                      setIsEditing(false);
                      if (onSuccess) onSuccess();
                    }}
                    onCancel={() => setIsEditing(false)}
                  />
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-gray-900 truncate">{profile?.name || "Anonymous User"}</p>
                    <button
                      className="text-blue-500 text-xs hover:text-blue-700 ml-2"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 truncate mb-3">{profile?.role || "User"}</p>
                  
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span className="font-medium">236</span>
                      <span className="text-gray-500">Followers</span>
                    </div>
                    
                    <div className="flex items-center space-x-1 text-gray-600">
                      <User className="w-4 h-4" />
                      <span className="font-medium">128</span>
                      <span className="text-gray-500">Rating</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bio Section */}
        {!isEditing && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-sm text-gray-900">Bio</h4>
              <button
                className="text-blue-500 text-xs hover:text-blue-700"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {profile?.bio || "No bio available. Click edit to add your bio."}
            </p>
          </div>
        )}
      </div>
    </>
  );
};
