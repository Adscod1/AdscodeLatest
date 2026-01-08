"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Logo } from "../../(main)/components/navbar";
import api from "@/lib/api-client";

const completeProfileSchema = z
  .object({
    phoneNumber: z.string().optional(),
    location: z.string().optional(),
    username: z.string().optional(),
    dateOfBirth: z.string().optional(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => {
    if (data.phoneNumber && data.phoneNumber.length > 0 && data.phoneNumber.length < 10) {
      return false;
    }
    return true;
  }, {
    message: "Please enter a valid phone number (at least 10 digits)",
    path: ["phoneNumber"],
  })
  .refine((data) => {
    if (data.username && data.username.length > 0) {
      if (!data.username.startsWith('@')) {
        return false;
      }
      if (data.username.length < 4) {
        return false;
      }
    }
    return true;
  }, {
    message: "Username must start with @ and be at least 3 characters (excluding @)",
    path: ["username"],
  });

type CompleteProfileFormValues = z.infer<typeof completeProfileSchema>;

const CompleteProfilePage = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompleteProfileFormValues>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: {
      phoneNumber: "",
      location: "",
      username: "",
      dateOfBirth: "",
      acceptTerms: false,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: CompleteProfileFormValues) => {
      return await api.profiles.update({
        phoneNumber: data.phoneNumber || undefined,
        location: data.location || undefined,
        username: data.username || undefined,
        dateOfBirth: data.dateOfBirth || undefined,
      });
    },
    onSuccess: () => {
      toast.success("Profile completed successfully");
      router.push("/profile");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to complete profile");
    },
  });

  const onSubmit: SubmitHandler<CompleteProfileFormValues> = async (data) => {
    if (!data.acceptTerms) {
      toast.error("You must accept the terms and conditions");
      return;
    }
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Left: Complete Profile Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-6 py-12">
          <div className="w-full max-w-md">
            <Logo />
            <h2 className="mt-8 text-2xl font-bold">Complete Your Profile</h2>
            <p className="text-gray-500 mb-6">
              Help us personalize your experience on Adscod
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  placeholder="Phone Number"
                  {...register("phoneNumber")}
                  aria-invalid={!!errors.phoneNumber}
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <Input
                  type="text"
                  placeholder="Location (e.g., New York, USA)"
                  {...register("location")}
                  aria-invalid={!!errors.location}
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.location.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <Input
                  type="text"
                  placeholder="Username (e.g., @johndoe)"
                  {...register("username", {
                    onChange: (e) => {
                      const value = e.target.value;
                      if (value && !value.startsWith('@')) {
                        e.target.value = '@' + value;
                      }
                    }
                  })}
                  aria-invalid={!!errors.username}
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.username.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <Input
                  type="date"
                  placeholder="Date of Birth"
                  {...register("dateOfBirth")}
                  aria-invalid={!!errors.dateOfBirth}
                />
                {errors.dateOfBirth && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.dateOfBirth.message}
                  </p>
                )}
              </div>
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  {...register("acceptTerms")}
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  aria-invalid={!!errors.acceptTerms}
                />
                <label className="text-sm text-gray-600">
                  By signing up, you agree to the{" "}
                  <Link href="/terms" className="text-blue-600 hover:underline">
                    Terms of Use
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </Link>
                  , including{" "}
                  <Link href="/cookies" className="text-blue-600 hover:underline">
                    Cookies Use
                  </Link>
                  . Adscod may use your contact information, including your email address and phone number for purposes outlined in our Privacy Policy, like keeping your account secure and personalizing our services,{""}
                  <Link href="/settings" className="text-blue-600 hover:underline">
                    here
                  </Link>
                  .
                </label>
              </div>
              {errors.acceptTerms && (
                <p className="text-sm text-red-600">
                  {errors.acceptTerms.message}
                </p>
              )}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Completing profile..." : "Complete Profile"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => router.push("/profile")}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Skip for now
              </button>
            </div>
          </div>
        </div>

        {/* Right: Illustration & Description */}
        <div className="hidden md:flex w-1/2 bg-blue-600 items-center justify-center relative">
          <div className="max-w-md text-center text-white px-8">
            <div className="mb-8 flex justify-center">
              <div className="rounded-full bg-blue-500/30 p-8">
                <svg
                  width="120"
                  height="120"
                  viewBox="0 0 120 120"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="60"
                    cy="60"
                    r="60"
                    fill="#2563EB"
                    fillOpacity="0.2"
                  />
                  <rect
                    x="70"
                    y="40"
                    width="40"
                    height="40"
                    rx="6"
                    fill="#fff"
                  />
                  <circle cx="40" cy="60" r="10" fill="#fff" />
                  <circle cx="40" cy="90" r="10" fill="#fff" />
                  <circle cx="40" cy="30" r="10" fill="#fff" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-2">
              Almost there!
            </h3>
            <p className="text-base opacity-90 mb-8">
              Complete your profile to get the most out of Adscod
            </p>
            <div className="flex justify-center gap-2">
              <span className="inline-block w-2 h-2 bg-white/50 rounded-full" />
              <span className="inline-block w-2 h-2 bg-white rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfilePage;
