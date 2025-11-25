import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { LoadingState } from "@/app/components/skeletons/stores-skeleton-loader";
import { ErrorState } from "@/app/components/errors/error-state";
import { Store } from "@prisma/client";
import { MoreVertical, UserPlus, Users, LogOut, X, Trash2 } from "lucide-react";
import api from "@/lib/api-client";

const AllStoresCards = () => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showManageUsersModal, setShowManageUsersModal] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState<string>("");
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("User");
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  
  // Mock users data - replace with actual API call
  const [storeUsers, setStoreUsers] = useState([
    { id: "1", email: "admin@adscod.com", role: "Admin" },
    { id: "2", email: "moderator@adscod.com", role: "Moderator" },
    { id: "3", email: "user@adscod.com", role: "User" }
  ]);
  
  const {
    data: stores,
    isLoading,
    isError,
  } = useQuery<Store[]>({
    queryKey: ["stores"],
    queryFn: async () => {
      const result = await api.stores.getUserStores();
      return result.stores;
    },
  });

  const handleMenuToggle = (storeId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenMenuId(openMenuId === storeId ? null : storeId);
  };

  const handleAddUser = (storeId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedStoreId(storeId);
    setShowAddUserModal(true);
    setOpenMenuId(null);
  };

  const handleAddUserSubmit = async () => {
    // Add user API call here
    console.log("Adding user:", { email: userEmail, role: userRole, storeId: selectedStoreId });
    // Reset form and close modal
    setUserEmail("");
    setUserRole("User");
    setShowAddUserModal(false);
  };

  const handleCancelAddUser = () => {
    setUserEmail("");
    setUserRole("User");
    setShowAddUserModal(false);
    setShowRoleDropdown(false);
  };

  const handleRoleSelect = (role: string) => {
    setUserRole(role);
    setShowRoleDropdown(false);
  };

  const roles = [
    { value: "User", label: "User" },
    { value: "Admin", label: "Admin" },
    { value: "Moderator", label: "Moderator" }
  ];

  const handleManageUsers = (storeId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedStoreId(storeId);
    setShowManageUsersModal(true);
    setOpenMenuId(null);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setStoreUsers(storeUsers.filter(user => user.id !== userId));
    }
  };

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Logout functionality
    if (confirm("Are you sure you want to logout?")) {
      window.location.href = "/logout";
    }
    setOpenMenuId(null);
  };

  if (isLoading) return <LoadingState />;

  if (isError) return <ErrorState message="Failed to load stores" />;

  if (!stores?.length) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="text-center py-4">
          <h3 className="font-medium text-gray-900 mb-1">No stores yet</h3>
          <p className="text-sm text-gray-500 mb-3">
            Create your first store to get started
          </p>
          <Link
            href="/new"
            className="text-sm text-blue-500 hover:text-blue-600 font-medium"
          >
            Create Store →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">My Stores</h3>
        
      </div>
      <div className="space-y-4">
        {stores?.map((store) => (
          <Link
            href={`/${store.id}`}
            key={store.id}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-xl bg-gray-100 flex-shrink-0 flex items-center justify-center">
              {store.logo ? (
                <Image
                  src={store.logo}
                  alt={store.name}
                  width={32}
                  height={32}
                  className="w-full h-full rounded object-cover"
                />
              ) : (
                <span className="text-sm font-medium">
                  {store.name.substring(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium flex items-center gap-1">
                  {store.name}
                </div>
              </div>
              <p className="text-xs text-gray-500 truncate">
                {store.tagline ||
                  store.description?.substring(0, 100) ||
                  "No description"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AllStoresCards;
