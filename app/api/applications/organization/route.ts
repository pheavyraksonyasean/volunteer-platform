import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    // Read the user's access token from cookies
    const cookieStore = await cookies();
    // DEBUG: log cookie names/values to server console to help diagnose missing token
    const allCookies = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join("; ");
    console.log("[DEBUG] Incoming cookies:", allCookies);
    // Try common cookie names used by Supabase or custom setups
    const rawToken =
      cookieStore.get("token")?.value ||
      cookieStore.get("sb:token")?.value ||
      cookieStore.get("sb-access-token")?.value ||
      cookieStore.get("supabase-auth-token")?.value ||
      "";
    // Some supabase cookie payloads are JSON with access_token field -> extract if present
    let token = rawToken;
    try {
      const parsed = JSON.parse(rawToken || "{}");
      if (parsed && parsed.access_token) token = parsed.access_token;
    } catch (e) {
      // not JSON, ignore
    }
    console.log("[DEBUG] resolved access token present:", Boolean(token));
 
    // Create supabase client that is authenticated as the user
    const supabase = await createClient({ accessToken: token });
    
    // Get the current user (organization)
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    // If auth fails, return debug payload instead of 401 so client can show what's missing
    if (userError || !user) {
      console.warn("[DEBUG] supabase auth.getUser failed:", userError);
      const debugPayload = {
        cookies: allCookies,
        rawToken,
        tokenPresent: Boolean(token),
        userError: userError ?? null,
        user: user ?? null
      };
      // Return debug info (200) temporarily — remove after debugging
      return NextResponse.json({ debug: debugPayload }, { status: 200 });
    }
 
    // First, get opportunities created by this user
    const { data: opportunities, error: oppError } = await supabase
      .from("opportunities")
      .select("id")
      .eq("creator_id", user.id); // Changed from created_by to creator_id

    if (oppError) {
      console.error("Error fetching user opportunities:", oppError);
      return NextResponse.json({ error: "Failed to fetch opportunities" }, { status: 500 });
    }
    console.log("[DEBUG] found opportunities:", (opportunities || []).length);
 
    if (!opportunities || opportunities.length === 0) {
      return NextResponse.json([]);
    }
 
    const opportunityIds = opportunities.map(opp => opp.id);
    console.log("[DEBUG] opportunityIds:", opportunityIds);
 
    // Then fetch applications for those opportunities
    const { data: applications, error } = await supabase
      .from("applications")
      .select(`
        *,
        volunteer:users!applications_volunteer_id_fkey (
          first_name,
          last_name,
          email,
          profile_image_url
        ),
        opportunity:opportunities!applications_opportunity_id_fkey (
          id,
          opportunity_title,
          organization_name,
          date,
          start_time,
          end_time,
          location
        )
      `)
      .in("opportunity_id", opportunityIds)
      .order("applied_at", { ascending: false });

    if (error) {
      console.error("Error fetching organization applications:", error);
      return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
    }

    return NextResponse.json(applications || []);
  } catch (error) {
    console.error("Error in organization applications GET route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Read the user's access token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    // Create supabase client that is authenticated as the user
    const supabase = await createClient({ accessToken: token });
    
    // Get the current user (organization)
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { applicationId, status } = await request.json();

    if (!applicationId || !status || !["approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    // Verify that the application belongs to an opportunity owned by this user
    const { data: application, error: fetchError } = await supabase
      .from("applications")
      .select(`
        *,
        opportunity:opportunities!applications_opportunity_id_fkey (
          creator_id
        )
      `)
      .eq("id", applicationId)
      .single();

    if (fetchError || !application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    if (application.opportunity.creator_id !== user.id) { // Changed from created_by to creator_id
      return NextResponse.json({ error: "Unauthorized to modify this application" }, { status: 403 });
    }

    // Update the application status
    const { data: updatedApplication, error: updateError } = await supabase
      .from("applications")
      .update({ status })
      .eq("id", applicationId)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating application status:", updateError);
      return NextResponse.json({ error: "Failed to update application" }, { status: 500 });
    }

    return NextResponse.json(updatedApplication);
  } catch (error) {
    console.error("Error in organization applications PATCH route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}