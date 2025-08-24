import { createClient } from "@/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profileData = await request.json();

    // Destructure and map fields from request to database columns
    const { firstName, lastName, phone, location, bio } = profileData;

    const updatePayload: { [key: string]: any } = {
      updated_at: new Date().toISOString(),
    };

    if (firstName) updatePayload.first_name = firstName;
    if (lastName) updatePayload.last_name = lastName;
    if (phone) updatePayload.phone_number = phone;
    if (location) updatePayload.location = location;
    if (profileData.profile_image_url) updatePayload.profile_image_url = profileData.profile_image_url;
    // Assuming 'bio' is a column in your 'users' table.
    // If not, you should add it or remove this line.
    if (bio) updatePayload.bio = bio;

    const { data: updatedUser, error: updateError } = await supabase
      .from("users")
      .update(updatePayload)
      .eq("id", authUser.id)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating profile:", updateError);
      return NextResponse.json(
        { error: `Failed to update profile: ${updateError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    console.error("[API] Profile update error:", errorMessage);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("id", authUser.id)
      .single();

    if (fetchError) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    console.error("[API] Profile fetch error:", errorMessage);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
