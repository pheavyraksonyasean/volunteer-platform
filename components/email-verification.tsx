"use client";

import type React from "react";

import { useState, useEffect } from "react";
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Mail, ArrowLeft, CheckCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function EmailVerification() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const email = searchParams.get("email");

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    // Check for localStorage in client-side only
    if (typeof window !== "undefined") {
      const storedEndTime = localStorage.getItem("resendCooldownEndTime");
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

  // Redirect if no email provided
  useEffect(() => {
    if (!email) {
      router.push("/register");
    }
  }, [email, router]);

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter a valid 6-digit verification code",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/email-verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          token: otp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Verification failed");
      }

      if (data.loggedIn) {
        toast({
          title: "Success!",
          description: "Email verified and you are now logged in.",
        });
        if (data.user.role === "volunteer") {
          router.push("/volunteer/dashboard");
        } else if (data.user.role === "organizer") {
          router.push("/organization/dashboard");
        } else {
          router.push("/"); // Fallback
        }
      } else {
        toast({
          title: "Success!",
          description: "Email verified successfully! You can now sign in.",
        });
        router.push("/login");
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Verification failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;

    setIsResending(true);

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to resend code");
      }

      toast({
        title: "Code Sent",
        description: "A new verification code has been sent to your email.",
      });

      const cooldownEndTime = Date.now() + 65000;
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "resendCooldownEndTime",
          cooldownEndTime.toString()
        );
      }
      setCountdown(65); // 65 second cooldown
    } catch (error) {
      console.error("Resend error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to resend code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="w-full">
      <Card className="shadow-lg border-0 sm:shadow-xl">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="mx-auto flex items-center justify-center h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gradient-to-br from-pink-100 to-pink-200 shadow-lg">
            <Mail className="h-8 w-8 sm:h-10 sm:w-10 text-pink-600" />
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-600 to-pink-800 bg-clip-text text-transparent">
            Verify Your Email
          </CardTitle>
          <CardDescription className="text-base sm:text-lg text-gray-600 max-w-sm mx-auto">
            <p className=" font-semibold text-pink-600 break-all">{email}</p>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <Label
                htmlFor="otp"
                className="text-lg font-semibold text-gray-800"
              >
                Verification Code
              </Label>
              <div className="w-full flex justify-center">
                <InputOTP
                  id="otp"
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                  disabled={isLoading}
                  className="gap-2 sm:gap-3"
                >
                  <InputOTPGroup className="gap-2 sm:gap-3">
                    <InputOTPSlot
                      index={0}
                      className="w-9 h-9 sm:w-14 sm:h-14 text-lg font-semibold border-2 border-gray-300 focus:border-pink-500 rounded-lg"
                    />
                    <InputOTPSlot
                      index={1}
                      className="w-9 h-9 sm:w-14 sm:h-14 text-lg font-semibold border-2 border-gray-300 focus:border-pink-500 rounded-lg"
                    />
                    <InputOTPSlot
                      index={2}
                      className="w-9 h-9 sm:w-14 sm:h-14 text-lg font-semibold border-2 border-gray-300 focus:border-pink-500 rounded-lg"
                    />

                    <InputOTPSlot
                      index={3}
                      className="w-9 h-9 sm:w-14 sm:h-14 text-lg font-semibold border-2 border-gray-300 focus:border-pink-500 rounded-lg"
                    />
                    <InputOTPSlot
                      index={4}
                      className="w-9 h-9 sm:w-14 sm:h-14 text-lg font-semibold border-2 border-gray-300 focus:border-pink-500 rounded-lg"
                    />
                    <InputOTPSlot
                      index={5}
                      className="w-9 h-9 sm:w-14 sm:h-14 text-lg font-semibold border-2 border-gray-300 focus:border-pink-500 rounded-lg"
                    />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <p className="text-sm text-gray-500 text-center">
                Enter the 6-digit code from your email
              </p>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              size="lg"
              disabled={isLoading || otp.length !== 6}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Verifying...
                </span>
              ) : (
                <span className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Verify Email
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
              <span className="bg-white px-2 text-gray-500">Need Help?</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-3">
                Didn't receive the code?
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={handleResendCode}
                disabled={isResending || countdown > 0}
                className="w-full h-12 border-pink-200 text-pink-600 hover:bg-pink-50 hover:border-pink-300 font-medium"
              >
                {isResending ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-600 mr-2"></div>
                    Sending...
                  </span>
                ) : countdown > 0 ? (
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Resend in {countdown}s
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    Resend Code
                  </span>
                )}
              </Button>
            </div>

            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push("/register")}
              className="w-full h-12 text-gray-600 hover:text-pink-600 hover:bg-pink-50 font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Registration
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
