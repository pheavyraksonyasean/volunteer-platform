import { createClient } from "@/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email, password, role } = await request.json();

  if (!email || !password || !role) {
    return NextResponse.json(
      { error: "Email, password and role are required" },
      { status: 400 }
    );
  }

  const supabase = await createClient({ accessToken: undefined });

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
    .select("*")
    .eq("id", authData.user.id)
    .single();

  if (userError) {
    return NextResponse.json(
      { error: "Failed to retrieve user data" },
      { status: 500 }
    );
  }

  if (userData.role !== role) {
    return NextResponse.json(
      { error: "Invalid login credentials" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    message: "Logged in successfully",
    user: userData,
  });
}
