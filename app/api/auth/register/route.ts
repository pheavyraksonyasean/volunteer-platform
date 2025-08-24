import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  console.log("[v0] Registration API called");

  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      location,
      organizationName,
      role,
      skills = [],
    } = body;

    // Basic validation
    if (!firstName || !lastName || !email || !password || !role) {
      console.log("[v0] Missing required fields");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate and normalize role
    let normalizedRole: string;
    if (role === "volunteer") {
      normalizedRole = "volunteer";
    } else if (role === "organizer") {
      normalizedRole = "organizer";
    } else {
      console.log("[v0] Invalid role:", role);
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const supabase = await createClient();

    console.log("[v0] Creating auth user");
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.toLowerCase().trim(),
      password,
    });

    if (authError) {
      console.error("[v0] Auth signup error:", authError);
      return NextResponse.json(
        { error: authError.message || "Failed to create account" },
        { status: 400 }
      );
    }

    if (!authData.user) {
      console.log("[v0] No user returned from auth signup");
      return NextResponse.json(
        { error: "Failed to create account" },
        { status: 500 }
      );
    }

    const authUser = authData.user;
    console.log("[v0] Auth user created successfully:", authUser.id);

    // Use an admin client to bypass RLS and insert the user profile
    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const userData = {
      id: authUser.id,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.toLowerCase().trim(),
      phone_number: phone?.trim() || null,
      location: location?.trim() || null,
      organization_name: organizationName?.trim() || null,
      role: normalizedRole,
    };

    const { error: userError } = await supabaseAdmin
      .from("users")
      .insert(userData);

    if (userError) {
      console.error("[v0] User creation error details:", userError);
      // Attempt to clean up the auth user if profile creation fails
      await supabaseAdmin.auth.admin.deleteUser(authUser.id);
      return NextResponse.json(
        { error: `Failed to create user profile: ${userError.message}` },
        { status: 500 }
      );
    }

    // Handle volunteer skills with the admin client
    if (normalizedRole === "volunteer" && skills.length > 0) {
      console.log("[v0] Processing volunteer skills:", skills);

      const { data: skillData, error: skillError } = await supabaseAdmin
        .from("skills")
        .select("id, name")
        .in("name", skills);

      if (!skillError && skillData && skillData.length > 0) {
        const volunteerSkills = skillData.map((skill) => ({
          volunteer_id: authUser.id,
          skill_id: skill.id,
        }));

        const { error: volunteerSkillsError } = await supabaseAdmin
          .from("volunteer_skills")
          .insert(volunteerSkills);

        if (volunteerSkillsError) {
          console.error(
            "[v0] Volunteer skills error:",
            volunteerSkillsError
          );
        }
      }
    }

    console.log("[v0] Registration completed successfully");

    return NextResponse.json(
      {
        message:
          "Account created successfully! Please check your email to verify your account before signing in.",
        user: {
          id: authUser.id,
          email: authUser.email,
          role: normalizedRole,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
        },
        needsEmailConfirmation: !authData.session,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[v0] Registration error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
