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

    // Validate and normalize role - adjust this based on your CHECK constraint
    let normalizedRole: string;
    if (role === "volunteer") {
      normalizedRole = "volunteer"; // or "VOLUNTEER" if uppercase required
    } else if (role === "organizer") {
      normalizedRole = "organizer"; // might need to be "organization" - check your constraint
    } else {
      console.log("[v0] Invalid role:", role);
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    console.log("[v0] Normalized role:", normalizedRole);

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

    // Check if user already exists (created by trigger)
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("*")
      .eq("id", authUser.id)
      .maybeSingle();

    if (checkError) {
      console.error("[v0] Error checking existing user:", checkError);
      return NextResponse.json(
        { error: "Database error checking user" },
        { status: 500 }
      );
    }

    let user;

    if (existingUser) {
      console.log("[v0] User profile already exists, updating...");

      const { data: updatedUser, error: updateError } = await supabase
        .from("users")
        .update({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          phone_number: phone?.trim() || null,
          location: location?.trim() || null,
          organization_name: organizationName?.trim() || null,
          role: normalizedRole, // Use normalized role
          updated_at: new Date().toISOString(),
        })
        .eq("id", authUser.id)
        .select()
        .single();

      if (updateError) {
        console.error("[v0] User update error:", updateError);
        return NextResponse.json(
          { error: `Failed to update user profile: ${updateError.message}` },
          { status: 500 }
        );
      }

      user = updatedUser;
    } else {
      console.log("[v0] Creating new user profile");

      const userData = {
        id: authUser.id,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.toLowerCase().trim(),
        phone_number: phone?.trim() || null,
        location: location?.trim() || null,
        organization_name: organizationName?.trim() || null,
        role: normalizedRole, // Use normalized role
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log("[v0] Attempting to insert user with role:", normalizedRole);

      const { data: newUser, error: userError } = await supabase
        .from("users")
        .insert(userData)
        .select()
        .single();

      if (userError) {
        console.error("[v0] User creation error details:", {
          message: userError.message,
          details: userError.details,
          hint: userError.hint,
          code: userError.code,
        });

        // Clean up auth user if profile creation fails
        try {
          await supabase.auth.admin.deleteUser(authUser.id);
        } catch (cleanupError) {
          console.error("[v0] Failed to cleanup auth user:", cleanupError);
        }

        return NextResponse.json(
          {
            error: `Failed to create user profile: ${userError.message}`,
            details: userError.details,
            hint: userError.hint,
          },
          { status: 500 }
        );
      }

      user = newUser;
    }

    // Handle volunteer skills
    if (normalizedRole === "volunteer" && skills.length > 0) {
      console.log("[v0] Processing volunteer skills:", skills);

      try {
        const { data: skillData, error: skillError } = await supabase
          .from("skills")
          .select("id, name")
          .in("name", skills);

        if (!skillError && skillData && skillData.length > 0) {
          const volunteerSkills = skillData.map((skill) => ({
            volunteer_id: authUser.id,
            skill_id: skill.id,
            created_at: new Date().toISOString(),
          }));

          const { error: volunteerSkillsError } = await supabase
            .from("volunteer_skills")
            .insert(volunteerSkills);

          if (volunteerSkillsError) {
            console.error("[v0] Volunteer skills error:", volunteerSkillsError);
          } else {
            console.log("[v0] Volunteer skills added successfully");
          }
        }
      } catch (skillError) {
        console.error("[v0] Skills processing error:", skillError);
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
