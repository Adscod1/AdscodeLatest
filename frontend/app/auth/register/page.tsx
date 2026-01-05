"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RegisterFormValues } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Logo } from "../../(main)/components/navbar";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string(),
    phoneNumber: z.string().optional(),
    location: z.string().optional(),
    username: z.string().optional(),
    dateOfBirth: z.string().optional(),
    acceptTerms: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => {
    // Only validate phone, username, and terms if they are provided
    if (data.phoneNumber && data.phoneNumber.length > 0 && data.phoneNumber.length < 10) {
      return false;
    }
    return true;
  }, {
    message: "Please enter a valid phone number (at least 10 digits)",
    path: ["phoneNumber"],
  })
  .refine((data) => {
    // Only validate username if it's provided
    if (data.username && data.username.length > 0) {
      if (!data.username.startsWith('@')) {
        return false;
      }
      if (data.username.length < 4) { // @ + at least 3 characters
        return false;
      }
    }
    return true;
  }, {
    message: "Username must start with @ and be at least 3 characters (excluding @)",
    path: ["username"],
  });

const RegisterPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      location: "",
      username: "",
      dateOfBirth: "",
      acceptTerms: false,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: RegisterFormValues) => {
      // Use Better-Auth to create the user account
      // Better-Auth handles both user creation and profile creation
      const result = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
      });
      
      if (result.error) {
        throw new Error(result.error.message || "Registration failed");
      }
      
      return result;
    },
    onSuccess: () => {
      toast.success("Account created successfully");
      router.push("/profile");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleGoogleSignUp = async () => {
    try {
      setIsGoogleLoading(true);
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "http://localhost:3000/auth/complete-profile",
      });
    } catch {
      toast.error("Failed to sign up with Google. Please try again.");
      setIsGoogleLoading(false);
    }
  };

  const onSubmit: SubmitHandler<RegisterFormValues> = async (data) => {
    if (!showAdditionalFields) {
      setShowAdditionalFields(true);
      return;
    }
    
    // Validate that terms are accepted when creating account
    if (!data.acceptTerms) {
      toast.error("You must accept the terms and conditions");
      return;
    }
    
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Left: Registration Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-6 py-12">
          <div className="w-full max-w-md">
            <Logo />
            <h2 className="mt-8 text-2xl font-bold">Create your Account</h2>
            <p className="text-gray-500 mb-6">
              Join thousands of businesses and people on Adscod
            </p>
            <div className="flex gap-4 mb-4">
              <Button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={isGoogleLoading || mutation.isPending}
                className="w-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {isGoogleLoading ? "Signing up..." : "Sign up with Google"}
              </Button>
            </div>
            <div className="flex items-center mb-4">
              <div className="flex-grow h-px bg-gray-200" />
              <span className="mx-2 text-gray-400 text-sm">
                or continue with email
              </span>
              <div className="flex-grow h-px bg-gray-200" />
            </div>
            {mutation.error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                {mutation.error.message}
              </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <Input
                  type="text"
                  placeholder="Full Name"
                  {...register("name")}
                  aria-invalid={!!errors.name}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="Email"
                  {...register("email")}
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  {...register("password")}
                  aria-invalid={!!errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  {...register("confirmPassword")}
                  aria-invalid={!!errors.confirmPassword}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
              {!showAdditionalFields && (
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  disabled={mutation.isPending}
                >
                  Continue
                </Button>
              )}
              
              {/* Additional Fields Dropdown */}
              {showAdditionalFields && (
                <div className="space-y-4 pt-4 border-t border-gray-200 animate-in slide-in-from-top-2">
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
                        Terms of Use of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-blue-600 hover:underline">
                        Privacy Policy
                      </Link>
                      , including{" "}
                      <Link href="/cookies" className="text-blue-600 hover:underline">
                        Cookies Use
                      </Link>
                      . Adscod may use your contact information, including your email address and phone number for purposes outlined in our Privacy Policy, like keeping your account secure and personalizing our services, including ads. Learn more. Others will be able to find you by email or phone number, when provided, unless you choose otherwise{" "}
                      <Link href="/settings" className="text-blue-600 hover:underline">
                        here
                      </Link>
                      .
                    </label>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? "Creating account..." : "Create Account"}
                  </Button>
                </div>
              )}
            </form>
            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-blue-600 hover:underline font-medium"
              >
                Log in
              </Link>
            </p>
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
              Join our growing community
            </h3>
            <p className="text-base opacity-90 mb-8">
              Connect with businesses and create meaningful partnerships
            </p>
            <div className="flex justify-center gap-2">
              <span className="inline-block w-2 h-2 bg-white rounded-full" />
              <span className="inline-block w-2 h-2 bg-white/50 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
