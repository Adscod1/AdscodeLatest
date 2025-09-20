"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Logo } from "../../(main)/components/navbar";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean(),
});

type LoginFormValues = {
  email: string;
  password: string;
  rememberMe: boolean;
};

const LoginPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await authClient.signIn.email(
        {
          email: data.email,
          password: data.password,
          rememberMe: data.rememberMe,
          callbackURL: "/profile",
        },
        {
          onRequest: () => {
            setIsLoading(true);
          },
          onSuccess: () => {
            router.push("/profile");
          },
          onError: (ctx) => {
            setError(ctx.error.message);
          },
        }
      );
      if (result.error) {
        setError(result.error.message ?? "An unexpected error occurred");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Left: Login Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-6 py-12">
          <div className="w-full max-w-md">
            <Logo />
            <h2 className="mt-8 text-2xl font-bold">Log in to your Account</h2>
            <p className="text-gray-500 mb-6">
              Welcome back! Select method to log in:
            </p>
            <div className="flex gap-4 mb-4">
              <Button className="w-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
                  <g>
                    <path
                      fill="#4285F4"
                      d="M44.5 20H24v8.5h11.7C34.7 33.1 30.1 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.1 8.1 3l6.1-6.1C34.2 6.2 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.3-4z"
                    />
                    <path
                      fill="#34A853"
                      d="M6.3 14.7l7 5.1C15.5 16.1 19.4 13 24 13c3.1 0 5.9 1.1 8.1 3l6.1-6.1C34.2 6.2 29.4 4 24 4c-7.2 0-13.3 4.1-16.7 10.7z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M24 44c5.4 0 10.2-1.8 13.9-4.9l-6.4-5.2C29.7 35.7 27 36.5 24 36.5c-6.1 0-10.7-2.9-13.2-7.1l-7 5.4C7.7 41.1 15.3 44 24 44z"
                    />
                    <path
                      fill="#EA4335"
                      d="M44.5 20H24v8.5h11.7c-1.2 3.2-4.2 5.5-7.7 5.5-2.2 0-4.2-.7-5.7-2l-7 5.4C15.3 41.1 19.4 44 24 44c5.4 0 10.2-1.8 13.9-4.9l-6.4-5.2C29.7 35.7 27 36.5 24 36.5c-6.1 0-10.7-2.9-13.2-7.1l-7 5.4C7.7 41.1 15.3 44 24 44z"
                    />
                  </g>
                </svg>
                Google
              </Button>
            </div>
            <div className="flex items-center mb-4">
              <div className="flex-grow h-px bg-gray-200" />
              <span className="mx-2 text-gray-400 text-sm">
                or continue with email
              </span>
              <div className="flex-grow h-px bg-gray-200" />
            </div>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
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
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  {...register("password")}
                  aria-invalid={!!errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2 text-gray-400 hover:text-gray-600"
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
              <div className="flex items-center justify-between">
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    className="mr-2 rounded border-gray-300"
                    {...register("rememberMe")}
                  />{" "}
                  Remember me
                </label>
                <Link
                  href="#"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Log in"}
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/register"
                className="text-blue-600 hover:underline font-medium"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
        {/* Right: Illustration & Description */}
        <div className="hidden md:flex w-1/2 bg-blue-600 items-center justify-center relative">
          <div className="max-w-md text-center text-white px-8">
            {/* Placeholder for illustration */}
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
              Bringing businesses and people closer.
            </h3>
            <p className="text-base opacity-90 mb-8">
              A people-led platform for people-centric businesses.
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

export default LoginPage;
