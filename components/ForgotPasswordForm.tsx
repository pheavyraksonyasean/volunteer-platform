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
import { useToast } from "@/hooks/use-toast";

export default function ForgotPasswordForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    const storedEndTime = localStorage.getItem("forgotPasswordCooldownEndTime");
    if (storedEndTime) {
      const endTime = parseInt(storedEndTime, 10);
      const remainingTime = Math.ceil((endTime - Date.now()) / 1000);
      if (remainingTime > 0) {
        setCountdown(remainingTime);
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
      localStorage.setItem(
        "forgotPasswordCooldownEndTime",
        cooldownEndTime.toString()
      );
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
      <Card>
        <CardHeader>
          <CardTitle>Check Your Email</CardTitle>
          <CardDescription>
            We've sent password reset instructions to {email}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Didn't receive the email? Check your spam folder or try again
              {countdown > 0 ? ` in ${countdown} seconds` : "."}
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setIsSubmitted(false);
                setEmail("");
              }}
              className="w-full"
            >
              Try Different Email
            </Button>
            <div className="text-center">
              <Link
                href="/login"
                className="text-sm text-pink-800 hover:underline"
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reset Your Password</CardTitle>
        <CardDescription>
          Enter your email address and we'll send you a link to reset your
          password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              disabled={isLoading || countdown > 0}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-pink-800 hover:bg-pink-950"
            size="lg"
            disabled={isLoading || !email || countdown > 0}
          >
            {isLoading
              ? "Sending..."
              : countdown > 0
              ? `Try again in ${countdown}s`
              : "Send Reset Link"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/login" className="text-sm text-pink-800 hover:underline">
            Back to Sign In
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
