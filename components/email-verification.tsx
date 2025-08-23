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
import { Mail, ArrowLeft } from "lucide-react";
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

      setCountdown(60); // 60 second cooldown
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-pink-100">
              <Mail className="h-6 w-6 text-pink-800" />
            </div>
            <CardTitle className="mt-4">Verify Your Email</CardTitle>
            <CardDescription>
              We've sent a 6-digit verification code to <strong>{email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <Label htmlFor="otp">Verification Code</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                  required
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-pink-800 hover:bg-pink-950"
                size="lg"
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? "Verifying..." : "Verify Email"}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-4">
              <p className="text-sm text-gray-600">Didn't receive the code?</p>
              <Button
                type="button"
                variant="outline"
                onClick={handleResendCode}
                disabled={isResending || countdown > 0}
                className="w-full"
              >
                {isResending
                  ? "Sending..."
                  : countdown > 0
                  ? `Resend in ${countdown}s`
                  : "Resend Code"}
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push("/register")}
                className="w-full text-pink-800 hover:text-pink-950"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Registration
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
