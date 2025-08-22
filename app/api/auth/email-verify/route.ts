import { createClient } from "@/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, token } = body;

    if (!email || !token) {
      return NextResponse.json(
        { error: "Email and token are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Verify the OTP token
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "signup",
    });

    if (error) {
      console.error("OTP verification error:", error);
      return NextResponse.json(
        {
          error: error.message || "Invalid or expired verification code",
        },
        { status: 400 }
      );
    }

    if (!data.user) {
      return NextResponse.json(
        { error: "Verification failed" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "Email verified successfully",
      user: {
        id: data.user.id,
        email: data.user.email,
        email_confirmed_at: data.user.email_confirmed_at,
      },
    });
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
