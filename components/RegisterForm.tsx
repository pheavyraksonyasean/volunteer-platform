"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
import { Checkbox } from "@/components/ui/checkbox";
import { User, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const initialRole = searchParams.get("role") || "volunteer";

  const [role, setRole] = useState<"volunteer" | "organizer">(
    initialRole as "volunteer" | "organizer"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    location: "",
    organizationName: "",
    skills: [] as string[],
    agreeToTerms: false,
  });

  const skillOptions = [
    "Teaching",
    "Healthcare",
    "Technology",
    "Marketing",
    "Event Planning",
    "Fundraising",
    "Social Media",
    "Photography",
    "Writing",
    "Translation",
    "Construction",
    "Cooking",
    "Childcare",
    "Elder Care",
    "Environmental",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("[v0] Form submission started");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    // Validate terms agreement
    if (!formData.agreeToTerms) {
      toast({
        title: "Error",
        description: "Please agree to the terms and conditions",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log("[v0] Making API request to /api/auth/register");

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          location: formData.location,
          organizationName: formData.organizationName,
          role: role === "organizer" ? "organizer" : "volunteer",
          skills: formData.skills,
        }),
      });

      console.log("[v0] Response status:", response.status);
      console.log(
        "[v0] Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("[v0] Response is not JSON, content-type:", contentType);
        const textResponse = await response.text();
        console.error("[v0] Response text:", textResponse);
        throw new Error("Server returned invalid response format");
      }

      const data = await response.json();
      console.log("[v0] Response data:", data);

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      const { user, needsEmailConfirmation } = data;

      if (needsEmailConfirmation) {
        toast({
          title: "Success!",
          description:
            "Account created! Please check your email for a verification code.",
        });
        console.log("[v0] Redirecting to verification page");
        router.push(
          `/verify-email?email=${encodeURIComponent(formData.email)}`
        );
      } else {
        toast({
          title: "Success!",
          description: "Account created and you are now logged in.",
        });
        if (user.role === "volunteer") {
          console.log("[v0] Redirecting to volunteer dashboard");
          router.push("/volunteer/dashboard");
        } else if (user.role === "organizer") {
          console.log("[v0] Redirecting to organization dashboard");
          router.push("/organization/dashboard");
        } else {
          router.push("/");
        }
      }
    } catch (error) {
      console.error("[v0] Registration error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Registration failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkillToggle = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registration</CardTitle>
        <CardDescription>
          Choose your role and fill in your information to get started
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
            >
              <User className="h-8 w-8" />
              <span className="font-medium">Volunteer</span>
            </button>
            <button
              type="button"
              onClick={() => setRole("organizer")}
              className={`p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                role === "organizer"
                  ? "border-pink-800 bg-pink-50 text-pink-800"
                  : "border-gray-200 hover:border-pink-800"
              }`}
            >
              <Building2 className="h-8 w-8" />
              <span className="font-medium">Organization</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    firstName: e.target.value,
                  }))
                }
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    lastName: e.target.value,
                  }))
                }
                required
                disabled={isLoading}
              />
            </div>
          </div>

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    phone: e.target.value,
                  }))
                }
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="City, State"
                value={formData.location}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    location: e.target.value,
                  }))
                }
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Organization-specific fields */}
          {role === "organizer" && (
            <div>
              <Label htmlFor="organizationName">Organization Name</Label>
              <Input
                id="organizationName"
                value={formData.organizationName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    organizationName: e.target.value,
                  }))
                }
                required
                disabled={isLoading}
              />
            </div>
          )}

          {/* Volunteer-specific fields */}
          {role === "volunteer" && (
            <div>
              <Label className="text-base font-medium">
                Skills & Interests
              </Label>
              <p className="text-sm text-gray-600 mb-3">
                Select all that apply
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {skillOptions.map((skill) => (
                  <div key={skill} className="flex items-center space-x-2">
                    <Checkbox
                      id={skill}
                      checked={formData.skills.includes(skill)}
                      onCheckedChange={() => handleSkillToggle(skill)}
                      disabled={isLoading}
                    />
                    <Label htmlFor={skill} className="text-sm">
                      {skill}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Terms and Conditions */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={formData.agreeToTerms}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  agreeToTerms: checked as boolean,
                }))
              }
              required
              disabled={isLoading}
            />
            <Label htmlFor="terms" className="text-sm">
              I agree to the{" "}
              <Link href="/terms" className="text-pink-800 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-pink-800 hover:underline">
                Privacy Policy
              </Link>
            </Label>
          </div>

          <Button
            type="submit"
            className="w-full bg-pink-800 hover:bg-pink-950"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-pink-800 hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
