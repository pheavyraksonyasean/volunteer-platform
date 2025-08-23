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

    if (!data.user || !data.session) {
      // User is verified but not logged in.
      return NextResponse.json({
        message: "Email verified successfully. Please log in.",
        loggedIn: false,
      });
    }

    // User is logged in, get their role.
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (userError) {
      // This is a problem, user is authenticated but we can't get their role.
      // Forcing a logout might be safest.
      await supabase.auth.signOut();
      return NextResponse.json(
        { error: "Could not retrieve user role after verification." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Email verified successfully. You are now logged in.",
      loggedIn: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        role: userData.role,
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