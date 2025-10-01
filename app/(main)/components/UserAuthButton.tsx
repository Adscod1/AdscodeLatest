"use client";

import { Button } from "@/components/ui/button";
import { User, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const fetchSession = async () => {
  const session = await authClient.getSession();
  return session?.data?.user ?? null;
};

export const UserAuthButton = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["session"],
    queryFn: fetchSession,
  });

  const logoutMutation = useMutation({
    mutationFn: () => authClient.signOut(),
    onSuccess: () => {
      queryClient.setQueryData(["session"], null);
      router.push("/auth/login");
    },
    onError: (error) => {
      console.error("Failed to logout:", error);
    },
  });

  // Helper function to get user initials
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse flex items-center justify-center">
        <User className="size-4 text-gray-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <Link href="/auth/login">
        <Button
          variant="outline"
          className="rounded-full flex items-center gap-2 hover:bg-gray-50 transition-colors"
        >
          <User className="size-4" />
          Login / Signup
        </Button>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative group">
          <div className="w-10 h-10 rounded-full bg-black to-purple-600 flex items-center justify-center text-white font-semibold text-sm hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer border-2 border-white shadow-sm">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || "Profile"}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span>{getUserInitials(user.name || user.email || "U")}</span>
            )}
          </div>
          {/* Online indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        </button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-72 p-0 border border-gray-200 shadow-lg">
        <div className="bg-white rounded-lg overflow-hidden">
          {/* Header with white background */}
          <div className="bg-white px-4 py-4 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white font-semibold border border-gray-200">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "Profile"}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-lg">{getUserInitials(user.name || user.email || "U")}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg text-gray-900 truncate">
                  {user.name || "User"}
                </h3>
                <p className="text-gray-500 text-sm truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <Link href="/profile">
              <DropdownMenuItem className="cursor-pointer mx-2 rounded-md px-3 py-2.5 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                    <User className="size-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Profile</p>
                    <p className="text-xs text-gray-500">View and edit your profile</p>
                  </div>
                </div>
              </DropdownMenuItem>
            </Link>

            <Link href="/settings">
              <DropdownMenuItem className="cursor-pointer mx-2 rounded-md px-3 py-2.5 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                    <Settings className="size-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Settings</p>
                    <p className="text-xs text-gray-500">Manage your preferences</p>
                  </div>
                </div>
              </DropdownMenuItem>
            </Link>

            <DropdownMenuSeparator className="my-1 mx-2" />

            <DropdownMenuItem
              className="cursor-pointer mx-2 rounded-md px-3 py-2.5 hover:bg-gray-50 transition-colors focus:bg-gray-50"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                  <LogOut className="size-4 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-red-500">
                    {logoutMutation.isPending ? "Logging out..." : "Logout"}
                  </p>
                  <p className="text-xs text-gray-500">Sign out of your account</p>
                </div>
              </div>
            </DropdownMenuItem>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
