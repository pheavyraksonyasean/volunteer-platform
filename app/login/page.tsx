"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart, User, Building2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [role, setRole] = useState<"volunteer" | "organization">("volunteer")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically authenticate with your backend
    console.log("Login data:", { role, ...formData })

    // Redirect to appropriate dashboard
    if (role === "volunteer") {
      router.push("/volunteer/dashboard")
    } else {
      router.push("/organization/dashboard")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12">
      <div className="max-w-md w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center mb-6">
            <Heart className="h-8 w-8 text-indigo-600 mr-2" />
            <span className="text-2xl font-bold text-gray-900">VolunteerMatch</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account to continue</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
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
                      ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <User className="h-6 w-6" />
                  <span className="font-medium text-sm">Volunteer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("organization")}
                  className={`p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                    role === "organization"
                      ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Building2 className="h-6 w-6" />
                  <span className="font-medium text-sm">Organization</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <Link href="/forgot-password" className="text-sm text-indigo-600 hover:underline">
                  Forgot your password?
                </Link>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/register" className="text-indigo-600 hover:underline font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
