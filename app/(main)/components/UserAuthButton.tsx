"use client";

import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
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

  if (isLoading) {
    return (
      <Button variant="outline" className="rounded-full" disabled>
        <User className="size-4 mr-2 animate-pulse" />
        Loading...
      </Button>
    );
  }

  if (!user) {
    return (
      <Link href="/auth/login">
        <Button
          variant="outline"
          className="rounded-full flex items-center gap-2"
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
        <Button
          variant="outline"
          className="rounded-full flex items-center gap-2"
        >
          <User className="size-4" />
          {user.name || "My Profile"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 z-100">
        <Link href="/profile">
          <DropdownMenuItem className="cursor-pointer">
            <User className="size-4 mr-2" />
            Profile
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-red-600 focus:text-red-600"
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
        >
          <LogOut className="size-4 mr-2" />
          {logoutMutation.isPending ? "Logging out..." : "Logout"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
