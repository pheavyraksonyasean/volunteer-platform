import { createClient } from "@/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const supabase = await createClient();

    // Resend the OTP
    const { data, error } = await supabase.auth.resend({
      type: "signup",
      email: email.toLowerCase().trim(),
    });

    if (error) {
      console.error("Resend verification error:", error);

      // Handle specific error cases
      let errorMessage = "Failed to resend verification code";
      if (error.message.includes("already confirmed")) {
        errorMessage = "This email is already verified. Please try signing in.";
      } else if (error.message.includes("rate limit")) {
        errorMessage =
          "Too many requests. Please wait before requesting another code.";
      } else if (error.message.includes("not found")) {
        errorMessage = "No account found with this email address.";
      }

      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    return NextResponse.json({
      message: "Verification code sent successfully",
      messageId: data?.messageId, // Optional: include if available
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
