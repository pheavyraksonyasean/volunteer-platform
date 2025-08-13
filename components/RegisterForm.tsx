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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Building2 } from "lucide-react";

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") || "volunteer";

  const [role, setRole] = useState<"volunteer" | "organization">(
    initialRole as "volunteer" | "organization"
  );
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    location: "",
    organizationName: "",
    organizationType: "",
    website: "",
    description: "",
    skills: [] as string[],
    availability: "",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log("Registration data:", { role, ...formData });

    // Redirect to appropriate dashboard
    if (role === "volunteer") {
      router.push("/volunteer/dashboard");
    } else {
      router.push("/organization/dashboard");
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
              onClick={() => setRole("organization")}
              className={`p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                role === "organization"
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
              />
            </div>
          </div>

          {/* Organization-specific fields */}
          {role === "organization" && (
            <>
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
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="organizationType">Organization Type</Label>
                  <Select
                    value={formData.organizationType}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        organizationType: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nonprofit">Non-profit</SelectItem>
                      <SelectItem value="charity">Charity</SelectItem>
                      <SelectItem value="community">Community Group</SelectItem>
                      <SelectItem value="religious">
                        Religious Organization
                      </SelectItem>
                      <SelectItem value="educational">
                        Educational Institution
                      </SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="environmental">
                        Environmental
                      </SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="website">Website (Optional)</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://example.com"
                    value={formData.website}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        website: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Organization Description</Label>
                <Textarea
                  id="description"
                  placeholder="Tell us about your organization and mission..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={4}
                />
              </div>
            </>
          )}

          {/* Volunteer-specific fields */}
          {role === "volunteer" && (
            <>
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
                      />
                      <Label htmlFor={skill} className="text-sm">
                        {skill}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="availability">Availability</Label>
                <Select
                  value={formData.availability}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      availability: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekdays">Weekdays</SelectItem>
                    <SelectItem value="weekends">Weekends</SelectItem>
                    <SelectItem value="evenings">Evenings</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                    <SelectItem value="once-week">Once a week</SelectItem>
                    <SelectItem value="multiple-week">
                      Multiple times a week
                    </SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
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
            className="w-full bg-pink-800 hover:bg-pink-950 "
            size="lg"
          >
            Create Account
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
