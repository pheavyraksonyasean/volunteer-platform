// In app/api/opportunities/route.ts

import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

// Helper function to decode a base64 image and return a buffer
function decodeBase64Image(dataString: string) {
  const matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (matches?.length !== 3) {
    throw new Error("Invalid input string");
  }

  return {
    type: matches[1],
    data: Buffer.from(matches[2], "base64"),
  };
}

function isUuid(v: string) {
  return /^[0-9a-fA-F-]{36}$/.test(v);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient({ accessToken: undefined });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const {
    title,
    organizationName,
    categoryId,        // must be a UUID now (preferred)
    category,          // optional plain-text name; will be resolved to UUID
    description,
    location,
    date,              // matches schema column 'date'
    startTime,         // time (HH:MM or HH:MM:SS)
    endTime,
    maxVolunteers,     // maps to maximum_volunteer
    contactEmail,
    images,            // array of base64 or existing URLs
    skillsNeeded,      // NOT IN SCHEMA (ignored)
    whatToExpected,    // NOT IN SCHEMA (ignored)
  } = body;

  // Validate required mapped fields
  if (!title || !organizationName || (!categoryId && !category) || !date || !startTime || !endTime || !contactEmail) {
    return NextResponse.json(
      { error: "Missing required fields (title, organizationName, categoryId/category, date, startTime, endTime, contactEmail)" },
      { status: 400 }
    );
  }

  try {
    // Handle images => schema has single 'photo' (text). We store first image URL (if any).
    let photoUrl: string | null = null;
    if (images?.length) {
      // Take first image only (others ignored due to schema limitation)
      const first = images[0];
      if (first.startsWith("http")) {
        photoUrl = first;
      } else {
        const { type, data } = decodeBase64Image(first);
        const filePath = `public/${user.id}/${uuidv4()}`;
        const { error: uploadError } = await supabase.storage
          .from("opportunity_images")
          .upload(filePath, data, { contentType: type, upsert: true });
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage
          .from("opportunity_images")
          .getPublicUrl(filePath);
        photoUrl = urlData.publicUrl;
      }
    }

    // Resolve category UUID
    let finalCategoryId: string | null = null;
    if (categoryId) {
      if (!isUuid(categoryId)) {
        return NextResponse.json(
          { error: "categoryId must be a valid UUID" },
          { status: 400 }
        );
      }
      finalCategoryId = categoryId;
    } else if (category) {
      // Look up by name (case-insensitive) in categories table
      const { data: catRow, error: catErr } = await supabase
        .from("categories")
        .select("id")
        .ilike("name", category)
        .limit(1)
        .single();
      if (catErr || !catRow) {
        return NextResponse.json(
          { error: `Category name '${category}' not found` },
          { status: 400 }
        );
      }
      finalCategoryId = catRow.id;
    }
    if (!finalCategoryId) {
      return NextResponse.json(
        { error: "Unable to resolve category UUID" },
        { status: 400 }
      );
    }

    const insertData = {
      organization_name: organizationName,
      opportunity_title: title,
      category_id: finalCategoryId,
      description,
      location,
      date,
      start_time: startTime,
      end_time: endTime,
      maximum_volunteer: maxVolunteers ?? 1,
      contact_email: contactEmail,
      creator_id: user.id,
      photo: photoUrl,
    };

    const { data: newOpportunity, error: insertError } = await supabase
      .from("opportunities")
      .insert(insertData)
      .select()
      .single();
    if (insertError) throw insertError;

    return NextResponse.json(newOpportunity, { status: 201 });
  } catch (error: any) {
    console.error("Error creating opportunity:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const supabase = await createClient({ accessToken: undefined });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const {
    id: opportunityId,
    title,
    organizationName,
    categoryId,
    category,          // fallback
    description,
    location,
    date,
    startTime,
    endTime,
    maxVolunteers,
    contactEmail,
    images,
    skillsNeeded,      // ignored
    whatToExpected,    // ignored
  } = body;
  if (!opportunityId) {
    return NextResponse.json(
      { error: "Opportunity ID is required." },
      { status: 400 }
    );
  }

  try {
    // Ownership check (RLS should also enforce, but we keep local check)
    const { data: existing, error: fetchError } = await supabase
      .from("opportunities")
      .select("creator_id")
      .eq("id", opportunityId)
      .single();
    if (fetchError || existing?.creator_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    let photoUrl: string | undefined;
    if (images?.length) {
      const first = images[0];
      if (first.startsWith("http")) {
        photoUrl = first;
      } else {
        const { type, data } = decodeBase64Image(first);
        const filePath = `public/${user.id}/${uuidv4()}`;
        const { error: uploadError } = await supabase.storage
          .from("opportunity_images")
          .upload(filePath, data, { contentType: type, upsert: true });
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage
          .from("opportunity_images")
          .getPublicUrl(filePath);
        photoUrl = urlData.publicUrl;
      }
    }

    const updateData: Record<string, any> = {
      organization_name: organizationName,
      opportunity_title: title,
      // Resolve category for update
      category_id: undefined,
      description,
      location,
      date,
      start_time: startTime,
      end_time: endTime,
      maximum_volunteer: maxVolunteers,
      contact_email: contactEmail,
    };

    if (categoryId) {
      if (!isUuid(categoryId)) {
        return NextResponse.json({ error: "categoryId must be a valid UUID" }, { status: 400 });
      }
      updateData.category_id = categoryId;
    } else if (category) {
      const { data: catRow, error: catErr } = await supabase
        .from("categories")
        .select("id")
        .ilike("name", category)
        .limit(1)
        .single();
      if (catErr || !catRow) {
        return NextResponse.json(
          { error: `Category name '${category}' not found` },
          { status: 400 }
        );
      }
      updateData.category_id = catRow.id;
    } else {
      delete updateData.category_id; // no category change
    }
    if (photoUrl !== undefined) updateData.photo = photoUrl;

    const { data: updated, error: updateError } = await supabase
      .from("opportunities")
      .update(updateData)
      .eq("id", opportunityId)
      .select()
      .single();
    if (updateError) throw updateError;

    return NextResponse.json(updated, { status: 200 });
  } catch (error: any) {
    console.error("Error updating opportunity:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}