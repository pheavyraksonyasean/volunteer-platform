import { createClient } from "@/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  console.log("[v0] Registration API called");

  try {
    const body = await request.json();
    console.log("[v0] Request body parsed successfully");

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

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !role) {
      console.log("[v0] Missing required fields");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate role
    if (!["volunteer", "organizer"].includes(role)) {
      console.log("[v0] Invalid role:", role);
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    console.log("[v0] Checking environment variables");
    console.log(
      "[v0] SUPABASE_URL exists:",
      !!process.env.NEXT_PUBLIC_SUPABASE_URL
    );
    console.log(
      "[v0] SUPABASE_ANON_KEY exists:",
      !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    console.log("[v0] Creating Supabase client");
    const supabase = await createClient();

    console.log("[v0] Testing database connection");
    try {
      const { data: testData, error: testError } = await supabase
        .from("skills")
        .select("count")
        .limit(1);
      if (testError) {
        console.error("[v0] Database connection test failed:", testError);
        return NextResponse.json(
          { error: "Database connection failed" },
          { status: 500 }
        );
      }
      console.log("[v0] Database connection successful");
    } catch (dbError) {
      console.error("[v0] Database connection error:", dbError);
      return NextResponse.json(
        { error: "Database connection error" },
        { status: 500 }
      );
    }

    console.log("[v0] Creating auth user");
    console.log("[v0] Auth signup parameters:", {
      email,
      passwordLength: password.length,
    });

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    console.log("[v0] Auth signup completed");
    console.log(
      "[v0] Auth data:",
      authData ? { user: !!authData.user, session: !!authData.session } : null
    );

    if (authError) {
      console.error("[v0] Auth signup error details:", {
        message: authError.message,
        status: authError.status,
        code: authError.code,
        details: authError,
        fullError: JSON.stringify(authError, null, 2),
      });
      return NextResponse.json(
        {
          error:
            authError.message || "Failed to create account. Please try again.",
        },
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
    console.log("[v0] Auth user created successfully, creating user profile");

    const { data: user, error: userError } = await supabase
      .from("users")
      .insert({
        id: authUser.id, // Use the auth user ID
        first_name: firstName,
        last_name: lastName,
        email,
        phone_number: phone,
        location,
        organization_name: organizationName,
        role,
      })
      .select()
      .single();

    if (userError) {
      console.error("[v0] User creation error:", userError);
      // If user profile creation fails, we should still return success since auth user was created
      console.log("[v0] User profile creation failed, but auth user exists");
    }

    // If volunteer and has skills, add them to volunteer_skills table
    if (role === "volunteer" && skills.length > 0 && user) {
      console.log("[v0] Adding volunteer skills");
      // Get skill IDs
      const { data: skillData, error: skillError } = await supabase
        .from("skills")
        .select("id, name")
        .in("name", skills);

      if (skillError) {
        console.error("[v0] Skills fetch error:", skillError);
      } else if (skillData && skillData.length > 0) {
        // Insert volunteer skills
        const volunteerSkills = skillData.map((skill) => ({
          volunteer_id: authUser.id, // Use authUser instead of authData.user
          skill_id: skill.id,
        }));

        const { error: volunteerSkillsError } = await supabase
          .from("volunteer_skills")
          .insert(volunteerSkills);

        if (volunteerSkillsError) {
          console.error("[v0] Volunteer skills error:", volunteerSkillsError);
        }
      }
    }

    console.log("[v0] Registration completed successfully");
    return NextResponse.json({
      message:
        "Account created successfully! Please check your email to verify your account before signing in.",
      user: {
        id: authUser.id, // Use authUser instead of authData.user
        email: authUser.email,
        role: role,
      },
      needsEmailConfirmation: true,
    });
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
