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
import { User, Building2, ChevronDown, ChevronUp } from "lucide-react";
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
  const [showSkills, setShowSkills] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
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

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.firstName && formData.lastName && formData.email;
      case 2:
        return (
          formData.password && formData.confirmPassword && formData.location
        );
      case 3:
        return formData.agreeToTerms;
      default:
        return false;
    }
  };

  return (
    <div className="w-full">
      {/* Progress Indicator for All Devices */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm sm:text-base font-medium text-pink-800">
            Step {currentStep} of 3
          </span>
        </div>
      </div>

      <Card className="shadow-lg border-0 sm:shadow-xl">
        <CardHeader className="text-center space-y-2 pb-6">
          <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-600 to-pink-800 bg-clip-text text-transparent">
            Create Your Account
          </CardTitle>
          <CardDescription className="text-base sm:text-lg text-gray-600">
            Start making a difference in your community today
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Role Selection */}
          <div
            className={`transition-all duration-300 ${
              currentStep === 1 ? "block" : "hidden"
            }`}
          >
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
                  <p className="text-sm text-gray-600 mt-1">
                    Help make a difference
                  </p>
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
                  <p className="text-sm text-gray-600 mt-1">
                    Create opportunities
                  </p>
                </div>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Basic Information */}
            <div
              className={`space-y-4 transition-all duration-300 ${
                currentStep === 1 ? "block" : "hidden"
              }`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="firstName"
                    className="text-sm font-medium text-gray-700"
                  >
                    First Name
                  </Label>
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
                    className="h-12 border-gray-300 focus:border-pink-500 focus:ring-pink-500 rounded-lg"
                    placeholder="Enter your first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="lastName"
                    className="text-sm font-medium text-gray-700"
                  >
                    Last Name
                  </Label>
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
                    className="h-12 border-gray-300 focus:border-pink-500 focus:ring-pink-500 rounded-lg"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

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
            </div>

            {/* Step 2: Security & Contact */}
            <div
              className={`space-y-4 transition-all duration-300 ${
                currentStep === 2 ? "block" : "hidden"
              }`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700"
                  >
                    Password
                  </Label>
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
                    className="h-12 border-gray-300 focus:border-pink-500 focus:ring-pink-500 rounded-lg"
                    placeholder="Create a strong password"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </Label>
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
                    className="h-12 border-gray-300 focus:border-pink-500 focus:ring-pink-500 rounded-lg"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="phone"
                    className="text-sm font-medium text-gray-700"
                  >
                    Phone Number
                  </Label>
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
                    className="h-12 border-gray-300 focus:border-pink-500 focus:ring-pink-500 rounded-lg"
                    placeholder="Your phone number"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="location"
                    className="text-sm font-medium text-gray-700"
                  >
                    Location
                  </Label>
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
                    className="h-12 border-gray-300 focus:border-pink-500 focus:ring-pink-500 rounded-lg"
                  />
                </div>
              </div>

              {/* Organization-specific fields */}
              {role === "organizer" && (
                <div className="space-y-2">
                  <Label
                    htmlFor="organizationName"
                    className="text-sm font-medium text-gray-700"
                  >
                    Organization Name
                  </Label>
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
                    className="h-12 border-gray-300 focus:border-pink-500 focus:ring-pink-500 rounded-lg"
                    placeholder="Your organization name"
                  />
                </div>
              )}
            </div>

            {/* Step 3: Skills & Agreement */}
            <div
              className={`space-y-6 transition-all duration-300 ${
                currentStep === 3 ? "block" : "hidden"
              }`}
            >
              {/* Volunteer-specific fields */}
              {role === "volunteer" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-lg font-semibold text-gray-800">
                      Skills & Interests
                    </Label>
                    <button
                      type="button"
                      onClick={() => setShowSkills(!showSkills)}
                      className="flex items-center text-pink-600 font-medium"
                    >
                      {showSkills ? (
                        <>
                          Hide <ChevronUp className="ml-1 h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Show <ChevronDown className="ml-1 h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">
                    Select skills that match your interests and experience
                  </p>
                  <div
                    className={`${
                      showSkills ? "block" : "hidden"
                    } transition-all duration-300`}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {skillOptions.map((skill) => (
                        <div
                          key={skill}
                          className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-pink-300 hover:bg-pink-50 transition-colors"
                        >
                          <Checkbox
                            id={skill}
                            checked={formData.skills.includes(skill)}
                            onCheckedChange={() => handleSkillToggle(skill)}
                            disabled={isLoading}
                            className="data-[state=checked]:bg-pink-600 data-[state=checked]:border-pink-600"
                          />
                          <Label
                            htmlFor={skill}
                            className="text-sm font-medium text-gray-700 cursor-pointer flex-1"
                          >
                            {skill}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Terms and Conditions */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
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
                    className="data-[state=checked]:bg-pink-600 data-[state=checked]:border-pink-600 mt-0.5"
                  />
                  <Label
                    htmlFor="terms"
                    className="text-sm leading-relaxed cursor-pointer"
                  >
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="text-pink-600 hover:text-pink-800 font-medium underline"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-pink-600 hover:text-pink-800 font-medium underline"
                    >
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
              </div>
            </div>

            {/* Navigation Buttons for All Devices */}
            <div className="flex justify-between space-x-4 pt-4">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  className="flex-1 sm:flex-none sm:px-8 h-12 border-pink-200 text-pink-600 hover:bg-pink-50"
                >
                  Previous
                </Button>
              )}

              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={!isStepValid()}
                  className={`h-12 bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 ${
                    currentStep === 1
                      ? "flex-1 sm:flex-none sm:px-8"
                      : "flex-1 sm:flex-none sm:px-8"
                  }`}
                >
                  Next Step
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="flex-1 sm:flex-none sm:px-8 h-12 bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800"
                  disabled={isLoading || !isStepValid()}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Account...
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              )}
            </div>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-pink-600 hover:text-pink-800 font-semibold underline"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
