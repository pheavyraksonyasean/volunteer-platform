import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Get category ID from name
    const { data: category, error: categoryError } = await supabase
      .from("categories")
      .select("id")
      .eq("name", data.category)
      .single();

    if (categoryError || !category) {
      console.error("Category error:", categoryError?.message);
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    // Insert into opportunities table
    const { error, data: inserted } = await supabase
      .from("opportunities")
      .insert([
        {
          opportunity_title: data.title,
          organization_name: data.organizationName,
          category_id: category.id,
          description: data.description,
          location: data.location,
          date: data.date,
          start_time: data.startTime,
          end_time: data.endTime,
          maximum_volunteer: data.maxVolunteers,
          contact_email: data.contactEmail,
          photo: data.images?.[0] || null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error.message, error.details);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Insert skills if provided
    if (data.skillsNeeded && data.skillsNeeded.length > 0) {
      // Get skill IDs
      const { data: skills, error: skillsError } = await supabase
        .from("skill_expectations")
        .select("id, name")
        .in("name", data.skillsNeeded);

      if (skillsError) {
        console.error("Skill lookup error:", skillsError.message);
        return NextResponse.json({ error: skillsError.message }, { status: 400 });
      }

      // Insert into opportunity_skill_expectations
      const skillLinks = skills.map((skill: any) => ({
        opportunity_id: inserted.id,
        skill_expectation_id: skill.id,
      }));

      const { error: linkError } = await supabase
        .from("opportunity_skill_expectations")
        .insert(skillLinks);

      if (linkError) {
        console.error("Skill link error:", linkError.message);
        return NextResponse.json({ error: linkError.message }, { status: 400 });
      }
    }

    return NextResponse.json({ opportunity: inserted }, { status: 201 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}