import { createClient } from "@/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const supabase = await createClient();

  // The redirect URL should point to your new reset password page
  const redirectURL = new URL("/reset-password", request.url).toString();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectURL,
  });

  if (error) {
    console.error("Forgot password error:", error);
    // It's often better not to reveal if an email is registered or not.
    // Returning a generic message is safer.
    return NextResponse.json(
      { message: "If an account with this email exists, a reset link has been sent." },
      { status: 200 }
    );
  }

  return NextResponse.json({
    message: "If an account with this email exists, a reset link has been sent.",
  });
}