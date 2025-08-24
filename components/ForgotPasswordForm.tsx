"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
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
import { Mail, ArrowLeft, Send, Clock, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ForgotPasswordForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    // Check for localStorage in client-side only
    if (typeof window !== "undefined") {
      const storedEndTime = localStorage.getItem(
        "forgotPasswordCooldownEndTime"
      );
      if (storedEndTime) {
        const endTime = parseInt(storedEndTime, 10);
        const remainingTime = Math.ceil((endTime - Date.now()) / 1000);
        if (remainingTime > 0) {
          setCountdown(remainingTime);
        }
      }
    }
  }, []);

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      // Supabase returns 200 OK even if the email doesn't exist for security reasons
      if (response.status !== 200) {
        throw new Error(data.error || "Failed to send reset email");
      }

      setIsSubmitted(true);
      const cooldownEndTime = Date.now() + 65000;
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "forgotPasswordCooldownEndTime",
          cooldownEndTime.toString()
        );
      }
      setCountdown(65);

      toast({
        title: "Reset email sent!",
        description: "Check your email for password reset instructions.",
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to send reset email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="w-full">
        <Card className="shadow-lg border-0 sm:shadow-xl">
          <CardHeader className="text-center space-y-4 pb-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gradient-to-br from-green-100 to-green-200 shadow-lg">
              <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-600 to-pink-800 bg-clip-text text-transparent">
              Check Your Email
            </CardTitle>
            <CardDescription className="text-base sm:text-lg text-gray-600 max-w-sm mx-auto">
              <h1 className="font-semibold text-pink-600 break-all">{email}</h1>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Success Message */}
            <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-green-800">
                  <p className="font-medium mb-1">Email sent successfully!</p>
                  <p>
                    Click the link in your email to reset your password. The
                    link will expire in 24 hours.
                  </p>
                </div>
              </div>
            </div>

            {/* Help Text */}
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                Didn't receive the email? Check your spam folder or try again
                {countdown > 0 ? ` in ${countdown} seconds.` : "."}
              </p>

              <div className="space-y-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsSubmitted(false);
                    setEmail("");
                  }}
                  disabled={countdown > 0}
                  className="w-full h-12 border-pink-200 text-pink-600 hover:bg-pink-50 hover:border-pink-300 font-medium"
                >
                  {countdown > 0 ? (
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Try again in {countdown}s
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      Try Different Email
                    </span>
                  )}
                </Button>

                <Button
                  variant="ghost"
                  asChild
                  className="w-full h-12 text-gray-600 hover:text-pink-600 hover:bg-pink-50 font-medium"
                >
                  <Link href="/login">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Sign In
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Card className="shadow-lg border-0 sm:shadow-xl">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="mx-auto flex items-center justify-center h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gradient-to-br from-pink-100 to-pink-200 shadow-lg">
            <Mail className="h-8 w-8 sm:h-10 sm:w-10 text-pink-600" />
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-600 to-pink-800 bg-clip-text text-transparent">
            Reset Your Password
          </CardTitle>
          <CardDescription className="text-base sm:text-lg text-gray-600 max-w-sm mx-auto">
            Enter your email address and we'll send you a secure link to reset
            your password
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Instructions */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Mail className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-500">
                <p className="font-medium mb-1">How it works</p>
                <p>
                  We'll send you a secure link to create a new password. The
                  link will expire in 24 hours for your security.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
                disabled={isLoading || countdown > 0}
                className="h-12 border-gray-300 focus:border-pink-500 focus:ring-pink-500 rounded-lg"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              size="lg"
              disabled={isLoading || !email || countdown > 0}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </span>
              ) : countdown > 0 ? (
                <span className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Try again in {countdown}s
                </span>
              ) : (
                <span className="flex items-center">
                  <Send className="h-5 w-5 mr-2" />
                  Send Reset Link
                </span>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or</span>
            </div>
          </div>

          {/* Navigation Options */}
          <div className="space-y-3">
            <Button
              variant="ghost"
              asChild
              className="w-full h-12 text-gray-600 hover:text-pink-600 hover:bg-pink-50 font-medium"
            >
              <Link href="/login">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Sign In
              </Link>
            </Button>

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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
