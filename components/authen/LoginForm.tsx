"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Building2, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [role, setRole] = useState<"volunteer" | "organizer">("volunteer");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      toast({
        title: "Success!",
        description: "Logged in successfully.",
      });

      if (role === "volunteer") {
        router.push("/volunteer/dashboard");
      } else {
        router.push("/organization/dashboard");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Login failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <Card className="shadow-lg border-0 sm:shadow-xl">
        <CardHeader className="text-center space-y-2 pb-6">
          <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-600 to-pink-800 bg-clip-text text-transparent">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-base sm:text-lg text-gray-600">
            Sign in to continue making a difference
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Role Selection */}
          <div>
            <Label className="text-lg font-semibold text-gray-800 block mb-4">
              Choose your role:
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole("volunteer")}
                className={`group p-4 sm:p-6 border-2 rounded-xl flex flex-col items-center space-y-3 transition-all duration-200 transform hover:scale-105 ${
                  role === "volunteer"
                    ? "border-pink-500 bg-gradient-to-br from-pink-50 to-pink-100 text-pink-800 shadow-lg"
                    : "border-gray-200 hover:border-pink-300 hover:shadow-md"
                }`}
                disabled={isLoading}
              >
                <div
                  className={`p-3 rounded-full ${
                    role === "volunteer"
                      ? "bg-pink-200"
                      : "bg-gray-100 group-hover:bg-pink-100"
                  }`}
                >
                  <User className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
                <div className="text-center">
                  <span className="font-semibold text-base sm:text-lg">
                    Volunteer
                  </span>
                  <p className="text-sm text-gray-600 mt-1">Continue helping</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setRole("organizer")}
                className={`group p-4 sm:p-6 border-2 rounded-xl flex flex-col items-center space-y-3 transition-all duration-200 transform hover:scale-105 ${
                  role === "organizer"
                    ? "border-pink-500 bg-gradient-to-br from-pink-50 to-pink-100 text-pink-800 shadow-lg"
                    : "border-gray-200 hover:border-pink-300 hover:shadow-md"
                }`}
                disabled={isLoading}
              >
                <div
                  className={`p-3 rounded-full ${
                    role === "organizer"
                      ? "bg-pink-200"
                      : "bg-gray-100 group-hover:bg-pink-100"
                  }`}
                >
                  <Building2 className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
                <div className="text-center">
                  <span className="font-semibold text-base sm:text-lg">
                    Organization
                  </span>
                  <p className="text-sm text-gray-600 mt-1">Manage projects</p>
                </div>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                required
                disabled={isLoading}
                className="h-12 border-gray-300 focus:border-pink-500 focus:ring-pink-500 rounded-lg"
                placeholder="your.email@example.com"
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  required
                  disabled={isLoading}
                  className="h-12 border-gray-300 focus:border-pink-500 focus:ring-pink-500 rounded-lg pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex items-center justify-end">
              <Link
                href="/forgot-password"
                className="text-sm text-pink-600 hover:text-pink-800 font-medium underline"
              >
                Forgot your password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              size="lg"
              disabled={isLoading || !formData.email || !formData.password}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing In...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-pink-600 hover:text-pink-800 font-semibold underline"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
