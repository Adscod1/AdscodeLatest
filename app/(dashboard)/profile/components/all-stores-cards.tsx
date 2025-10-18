import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { LoadingState } from "@/app/components/skeletons/stores-skeleton-loader";
import { ErrorState } from "@/app/components/errors/error-state";
import { Store } from "@prisma/client";
import { MoreVertical, UserPlus, Users, LogOut, X, Trash2 } from "lucide-react";

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
      const response = await fetch("/api/stores");
      if (!response.ok) {
        throw new Error("Failed to fetch stores");
      }
      return response.json();
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
    <>
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between mb-4 border-b">
          <h3 className="font-medium text-xl">My Stores</h3>
          
        </div>
        <div className="space-y-4">
          {stores?.map((store) => (
            <div key={store.id} className="relative group">
              <Link
                href={`/${store.id}`}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
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
                  <div className="text-sm font-medium flex items-center gap-1">
                    {store.name}
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {store.tagline ||
                      store.description?.substring(0, 100) ||
                      "No description"}
                  </p>
                </div>
              </Link>
              
              <button
                onClick={(e) => handleMenuToggle(store.id, e)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5  rounded-lg transition-all"
              >
                <MoreVertical className="w-4 h-4 text-gray-500" />
              </button>
              
              {/* Dropdown Menu */}
              {openMenuId === store.id && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setOpenMenuId(null)}
                  />
                  <div className="absolute right-2 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
                    <div className="px-3 py-2 border-b border-gray-100">
                      <h3 className="text-xs font-semibold text-gray-700 uppercase">Admin Actions</h3>
                    </div>
                    <button
                      onClick={(e) => handleAddUser(store.id, e)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Add User</span>
                    </button>
                    <button
                      onClick={(e) => handleManageUsers(store.id, e)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Users className="w-4 h-4" />
                      <span>Manage Users</span>
                    </button>
                    <div className="border-t border-gray-100" />
                    <button
                      onClick={(e) => handleLogout(e)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Add New User</h2>
                <p className="text-sm text-gray-500 mt-1">Add a new user to your organization with a specific role.</p>
              </div>
              <button
                onClick={handleCancelAddUser}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-left focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white flex items-center justify-between"
                  >
                    <span>{userRole}</span>
                    <svg 
                      className={`w-4 h-4 text-gray-400 transition-transform ${showRoleDropdown ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showRoleDropdown && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowRoleDropdown(false)}
                      />
                      <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                        {roles.map((role) => (
                          <button
                            key={role.value}
                            type="button"
                            onClick={() => handleRoleSelect(role.value)}
                            className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors ${
                              userRole === role.value ? 'bg-purple-50 text-purple-700 flex items-center gap-2' : 'text-gray-700'
                            }`}
                          >
                            {userRole === role.value && (
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                            {role.label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={handleCancelAddUser}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUserSubmit}
                className="px-5 py-2.5 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Users Modal */}
      {showManageUsersModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Manage Users</h2>
                <p className="text-sm text-gray-500 mt-1">View and manage all users in your organization.</p>
              </div>
              <button
                onClick={() => setShowManageUsersModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="space-y-3">
                {storeUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.email}</p>
                      <p className="text-sm text-gray-500">{user.role}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end p-6 border-t border-gray-200">
              <button
                onClick={() => setShowManageUsersModal(false)}
                className="px-6 py-2.5 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AllStoresCards;
