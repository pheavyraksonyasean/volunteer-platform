import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { cookies } from "next/headers";

// Reusable Supabase admin client for bypassing RLS on storage
const getSupabaseAdmin = () => createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Uploads a file buffer to a specified Supabase storage bucket.
 * @returns The public URL of the uploaded file.
 */
async function uploadFileToBucket(
  userId: string,
  applicationId: string,
  file: File,
  bucketName: string = "application-documents"
) {
  const supabaseAdmin = getSupabaseAdmin();
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileExtension = file.name.split(".").pop() || "bin";
  const filePath = `${userId}/${applicationId}/${uuidv4()}.${fileExtension}`;

  const doUpload = async () => {
    const { error: uploadError } = await supabaseAdmin.storage
      .from(bucketName)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabaseAdmin.storage.from(bucketName).getPublicUrl(filePath);
    return data.publicUrl;
  };

  try {
    return await doUpload();
  } catch (uploadError: any) {
    // If bucket doesn't exist, try to create it and retry the upload
    if (
      uploadError?.message?.toLowerCase().includes("bucket not found") ||
      uploadError?.message?.toLowerCase().includes("no such bucket")
    ) {
      console.warn(`Storage bucket '${bucketName}' not found. Attempting to create it...`);

      const { error: createError } = await supabaseAdmin.storage.createBucket(bucketName, {
        public: true,
      });

      if (createError) {
        console.error(`Failed to create storage bucket '${bucketName}':`, createError);
        throw new Error(`Storage bucket '${bucketName}' not found and could not be created: ${createError.message}`);
      }

      // Retry upload after creating bucket
      try {
        return await doUpload();
      } catch (retryError: any) {
        console.error("Upload retry after bucket creation failed:", retryError);
        throw retryError;
      }
    }

    // Other upload error: rethrow
    throw uploadError;
  }
}

export async function POST(request: NextRequest) {
  // Read the user's access token from cookies (common names used by Supabase)
  const cookieStore = await cookies(); // resolve the Promise<ReadonlyRequestCookies>
  const token = cookieStore.get("token")?.value; // string | undefined

  // Create supabase client that is authenticated as the user so RLS policies using auth.uid() work.
  const supabase = await createClient({ accessToken: token });

  // 1. Authenticate the user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized: You must be logged in to apply." }, { status: 401 });
  }

  try {
    // 2. Parse FormData from the request
    const formData = await request.formData();
    const opportunityId = formData.get("opportunityId") as string;
    const motivation = formData.get("motivation") as string;
    const experience = formData.get("experience") as string;
    const emergencyContact = formData.get("emergencyContact") as string;
    const emergencyPhone = formData.get("emergencyPhone") as string;
    const skills = JSON.parse(formData.get("skills") as string || "[]") as string[];
    const resumeFile = formData.get("resume") as File | null;

    // 3. Validate required fields
    if (!opportunityId || !motivation || !emergencyContact || !emergencyPhone) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // This ID is needed for the file path, so we generate it beforehand
    const newApplicationId = uuidv4();

    // 4. Handle Resume Upload
    let resumeUrl: string | null = null;
    if (resumeFile) {
      try {
        resumeUrl = await uploadFileToBucket(user.id, newApplicationId, resumeFile);
      } catch (uploadError: any) {
        console.error("Resume upload failed:", uploadError);
        return NextResponse.json({ error: "Failed to upload resume.", details: uploadError.message }, { status: 500 });
      }
    }

    // 5. Insert into the 'applications' table
    const { data: newApplication, error: applicationError } = await supabase
      .from("applications")
      .insert({
        id: newApplicationId, // Use the pre-generated UUID
        opportunity_id: opportunityId,
        volunteer_id: user.id,
        motivation: motivation,
        relevant_experience: experience,
        emergency_contact_name: emergencyContact,
        emergency_contact_phone: emergencyPhone,
        resume_file_url: resumeUrl,
        // status defaults to 'pending' in the database
      })
      .select()
      .single();

    if (applicationError) {
      console.error("Error inserting application:", applicationError);
      throw applicationError;
    }

    // 6. Handle skills relationship in 'application_skills'
    if (skills.length > 0) {
      // Find the IDs of the selected skills
      const { data: skillRows, error: skillFetchError } = await supabase
        .from("skills")
        .select("id, name")
        .in("name", skills);

      if (skillFetchError) {
        // Log this error but don't fail the whole application
        console.error("Could not fetch skill IDs:", skillFetchError.message);
      }

      if (skillRows && skillRows.length > 0) {
        const applicationSkills = skillRows.map(skill => ({
          application_id: newApplication.id,
          skill_id: skill.id,
        }));

        // Insert into the junction table
        const { error: appSkillsError } = await supabase
          .from("application_skills")
          .insert(applicationSkills);

        if (appSkillsError) {
            // Also log this as a non-critical error
            console.error("Failed to link skills to application:", appSkillsError.message);
        }
      }
    }

    return NextResponse.json(newApplication, { status: 201 });

  } catch (error: any) {
    console.error("An unexpected error occurred:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}