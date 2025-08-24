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
import { User, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [role, setRole] = useState<"volunteer" | "organizer">("volunteer");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
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
    <Card>
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Role Selection */}
        <div className="mb-6">
          <Label className="text-base font-medium">I am a:</Label>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <button
              type="button"
              onClick={() => setRole("volunteer")}
              className={`p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                role === "volunteer"
                  ? "border-pink-800 bg-pink-50 text-pink-800"
                  : "border-gray-200 hover:border-pink-800"
              }`}
              disabled={isLoading}
            >
              <User className="h-6 w-6" />
              <span className="font-medium text-sm">Volunteer</span>
            </button>
            <button
              type="button"
              onClick={() => setRole("organizer")}
              className={`p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                role === "organizer"
                  ? "border-pink-800 bg-pink-50 text-pink-800"
                  : "border-gray-200 hover:border-pink-800"
              }`}
              disabled={isLoading}
            >
              <Building2 className="h-6 w-6" />
              <span className="font-medium text-sm">Organization</span>
            </button>
          </div>
        </div>

        <form className="space-y-6">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
              required
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center justify-between">
            <Link
              href="/forgot-password"
              className="text-sm text-pink-800 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full bg-pink-800 hover:bg-pink-950"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-black">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-pink-800 hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
