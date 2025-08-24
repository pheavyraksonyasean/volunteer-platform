import { createClient } from "@/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (!password) {
    return NextResponse.json({ error: "Password is required" }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters long" },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  // The user is already authenticated via the session cookie set
  // by the exchangeCodeForSession call in the page component.
  const { error: updateError } = await supabase.auth.updateUser({
    password: password,
  });

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 400 });
  }

  return NextResponse.json({
    message: "Password updated successfully",
  });
}