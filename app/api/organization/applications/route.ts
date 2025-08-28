import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    console.log("Organization applications API called");
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    console.log("Token found:", !!token);

    const supabase = await createClient({ accessToken: token });
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    console.log("User:", user?.id, "Error:", userError);
    
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get opportunities for this organization using creator_id
    console.log("Fetching opportunities for user:", user.id);
    const { data: opportunities, error: oppError } = await supabase
      .from("opportunities")
      .select("id, opportunity_title")
      .eq("creator_id", user.id);

    console.log("Opportunities found:", opportunities?.length || 0);

    if (oppError) {
      console.error("Error fetching opportunities:", oppError);
      return NextResponse.json({ 
        error: "Failed to fetch opportunities", 
        details: oppError.message 
      }, { status: 500 });
    }

    if (!opportunities || opportunities.length === 0) {
      console.log("No opportunities found for this user, returning empty array");
      return NextResponse.json([]);
    }

    const opportunityIds = opportunities.map(opp => opp.id);
    console.log("Opportunity IDs:", opportunityIds);

    // Get applications for these opportunities - be careful with column names
    const { data: applications, error: appsError } = await supabase
      .from("applications")
      .select("*")
      .in("opportunity_id", opportunityIds)
      .order("created_at", { ascending: false });

    console.log("Applications query result:", { applications, error: appsError });

    if (appsError) {
      console.error("Error fetching applications:", appsError);
      return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
    }

    if (!applications || applications.length === 0) {
      console.log("No applications found for these opportunities");
      return NextResponse.json([]);
    }

    // Log the first application to see what columns actually exist
    if (applications.length > 0) {
      console.log("Available application columns:", Object.keys(applications[0]));
    }

    // Get user details for each application
    const userIds = [...new Set(applications.map(app => app.volunteer_id))];
    console.log("User IDs to fetch:", userIds);
    
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id, first_name, last_name, email, phone_number")
      .in("id", userIds);

    if (usersError) {
      console.error("Error fetching users:", usersError);
    }

    console.log("Users found:", users?.length || 0);

    // Transform the data - only use columns that exist
    const transformedApplications = applications.map((app: any) => {
      const volunteer = users?.find(u => u.id === app.volunteer_id);
      const opportunity = opportunities.find(o => o.id === app.opportunity_id);
      
      const transformed = {
        id: app.id,
        volunteer_id: app.volunteer_id,
        opportunity_id: app.opportunity_id,
        status: app.status || 'pending',
        applied_at: app.applied_at || app.created_at,
        motivation: app.motivation || '',
        relevant_experience: app.relevant_experience || '',
        emergency_contact_name: app.emergency_contact_name || '',
        emergency_contact_phone: app.emergency_contact_phone || '',
        // Only include emergency_contact_relationship if it exists
        ...(app.hasOwnProperty('emergency_contact_relationship') && {
          emergency_contact_relationship: app.emergency_contact_relationship || ''
        }),
        volunteer_name: volunteer 
          ? `${volunteer.first_name || ""} ${volunteer.last_name || ""}`.trim() 
          : "Unknown Volunteer",
        volunteer_email: volunteer?.email || '',
        volunteer_phone: volunteer?.phone_number || '',
        skills: [], // We'll handle skills separately if needed
        opportunity: {
          id: opportunity?.id,
          opportunity_title: opportunity?.opportunity_title
        }
      };
      
      return transformed;
    });

    console.log("Final transformed applications count:", transformedApplications.length);
    return NextResponse.json(transformedApplications);
  } catch (error) {
    console.error("Error in organization applications GET route:", error);
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    console.log("PATCH applications called");
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const supabase = await createClient({ accessToken: token });
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { applicationId, status } = await request.json();
    console.log("Updating application:", applicationId, "to status:", status);

    if (!applicationId || !status) {
      return NextResponse.json({ error: "Missing applicationId or status" }, { status: 400 });
    }

    // Update the application status
    const { data, error } = await supabase
      .from("applications")
      .update({ 
        status,
        reviewed_at: new Date().toISOString(),
        reviewed_by: user.id
      })
      .eq("id", applicationId)
      .select()
      .single();

    if (error) {
      console.error("Error updating application:", error);
      return NextResponse.json({ error: "Failed to update application" }, { status: 500 });
    }

    console.log("Application updated successfully:", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in organization applications PATCH route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}