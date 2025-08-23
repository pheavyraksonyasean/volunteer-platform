import { createClient } from "@/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 401 });
  }

  if (!authData.user) {
    return NextResponse.json(
      { error: "Login failed, please try again" },
      { status: 500 }
    );
  }

  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("role")
    .eq("id", authData.user.id)
    .single();

  if (userError) {
    return NextResponse.json(
      { error: "Failed to retrieve user role" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    message: "Logged in successfully",
    user: {
      id: authData.user.id,
      email: authData.user.email,
      role: userData.role,
    },
  });
}
