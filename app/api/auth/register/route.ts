// src/app/api/auth/register/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Types
interface VolunteerRegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  location: string;
  skills: string[];
  availability: string;
  role: "volunteer";
}

interface OrganizationRegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  location: string;
  organizationName: string;
  organizationType: string;
  website?: string;
  description: string;
  role: "organization";
}

type RegistrationData =
  | VolunteerRegistrationData
  | OrganizationRegistrationData;

// Utility functions
const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const generateToken = (userId: string, email: string): string => {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: "24h" });
};

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (
  password: string
): { isValid: boolean; message?: string } => {
  if (password.length < 6) {
    return {
      isValid: false,
      message: "Password must be at least 6 characters long",
    };
  }
  return { isValid: true };
};

// Check if user exists
const getUserByEmail = async (email: string) => {
  const { data: user, error } = await supabase
    .from("user")
    .select("*")
    .eq("email", email.toLowerCase())
    .single();

  if (error) {
    return null;
  }
  return user;
};

// Create skill if it doesn't exist
const getOrCreateSkill = async (skillName: string) => {
  // Check if skill exists
  let { data: skill, error } = await supabase
    .from("skill")
    .select("id")
    .eq("name", skillName)
    .single();

  // If skill doesn't exist, create it
  if (error && error.code === "PGRST116") {
    const { data: newSkill, error: createError } = await supabase
      .from("skill")
      .insert([{ name: skillName }])
      .select("id")
      .single();

    if (createError) {
      throw new Error(`Failed to create skill: ${skillName}`);
    }
    skill = newSkill;
  } else if (error) {
    throw new Error(`Failed to fetch skill: ${skillName}`);
  }

  return skill;
};

// Create user skills
const createUserSkills = async (userId: string, skills: string[]) => {
  if (!skills || skills.length === 0) return;

  try {
    const skillPromises = skills.map((skillName) =>
      getOrCreateSkill(skillName)
    );
    const skillResults = await Promise.all(skillPromises);
    const validSkills = skillResults.filter((skill) => skill !== null);

    if (validSkills.length > 0) {
      const userSkills = validSkills.map((skill) => ({
        user: userId,
        skill_id: skill!.id,
      }));

      const { error: skillsError } = await supabase
        .from("user_skill")
        .insert(userSkills);

      if (skillsError) {
        throw new Error("Failed to create user skills");
      }
    }
  } catch (error) {
    console.error("Error in createUserSkills:", error);
    throw error;
  }
};

// Validation functions
const validateCommonFields = (data: RegistrationData) => {
  const errors: string[] = [];

  if (!data.firstName?.trim()) errors.push("First name is required");
  if (!data.lastName?.trim()) errors.push("Last name is required");
  if (!data.email?.trim()) errors.push("Email is required");
  if (!data.password) errors.push("Password is required");
  if (!data.confirmPassword) errors.push("Password confirmation is required");
  if (!data.location?.trim()) errors.push("Location is required");

  if (data.email && !validateEmail(data.email)) {
    errors.push("Please provide a valid email address");
  }

  if (data.password) {
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.isValid) {
      errors.push(passwordValidation.message!);
    }
  }

  if (
    data.password &&
    data.confirmPassword &&
    data.password !== data.confirmPassword
  ) {
    errors.push("Passwords do not match");
  }

  return errors;
};

const validateVolunteerFields = (data: VolunteerRegistrationData) => {
  const errors: string[] = [];
  if (!data.availability) errors.push("Availability is required");
  if (!data.skills || data.skills.length === 0)
    errors.push("At least one skill is required");
  return errors;
};

const validateOrganizationFields = (data: OrganizationRegistrationData) => {
  const errors: string[] = [];
  if (!data.organizationName?.trim())
    errors.push("Organization name is required");
  if (!data.organizationType) errors.push("Organization type is required");
  if (!data.description?.trim())
    errors.push("Organization description is required");

  if (data.website && data.website.trim()) {
    try {
      new URL(data.website);
    } catch {
      errors.push("Please provide a valid website URL");
    }
  }
  return errors;
};

// Main registration handler
export async function POST(req: NextRequest) {
  try {
    console.log("=== REGISTRATION API CALLED ===");

    const data: RegistrationData = await req.json();
    console.log("Registration data received:", {
      ...data,
      password: "[HIDDEN]",
      confirmPassword: "[HIDDEN]",
    });

    // Validate common fields
    const commonErrors = validateCommonFields(data);

    // Role-specific validation
    let roleErrors: string[] = [];
    if (data.role === "volunteer") {
      roleErrors = validateVolunteerFields(data as VolunteerRegistrationData);
    } else if (data.role === "organization") {
      roleErrors = validateOrganizationFields(
        data as OrganizationRegistrationData
      );
    } else {
      roleErrors.push("Invalid role specified");
    }

    // Combine all validation errors
    const allErrors = [...commonErrors, ...roleErrors];

    if (allErrors.length > 0) {
      console.log("Validation errors:", allErrors);
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: allErrors,
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    console.log("Checking if user exists...");
    const existingUser = await getUserByEmail(data.email);
    if (existingUser) {
      console.log("User already exists");
      return NextResponse.json(
        {
          success: false,
          error: "User with this email already exists",
        },
        { status: 409 }
      );
    }

    // Hash password
    console.log("Hashing password...");
    const hashedPassword = await hashPassword(data.password);

    // Create user record
    console.log("Creating user in database...");
    const { data: newUser, error: insertError } = await supabase
      .from("user")
      .insert([
        {
          first_name: data.firstName.trim(),
          last_name: data.lastName.trim(),
          email: data.email.toLowerCase(),
          pass: hashedPassword,
          number: data.phone?.trim() || null,
          location: data.location.trim(),
        },
      ])
      .select("id, first_name, last_name, email, created_at, location")
      .single();

    if (insertError) {
      console.error("Database insert error:", insertError);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to create user account",
          details: [insertError.message],
        },
        { status: 500 }
      );
    }

    console.log("User created successfully:", newUser.id);

    try {
      // Handle role-specific data
      if (data.role === "volunteer") {
        const volunteerData = data as VolunteerRegistrationData;
        console.log("Creating volunteer profile...");

        // Create volunteer profile
        const { error: volunteerError } = await supabase
          .from("volunteer_profile")
          .insert([
            {
              user_id: newUser.id,
              availability: volunteerData.availability,
            },
          ]);

        if (volunteerError) {
          console.error("Volunteer profile error:", volunteerError);
          throw new Error("Failed to create volunteer profile");
        }

        // Create user skills
        console.log("Creating user skills...");
        await createUserSkills(newUser.id, volunteerData.skills);
      } else if (data.role === "organization") {
        const orgData = data as OrganizationRegistrationData;
        console.log("Creating organization profile...");

        // Create organization profile
        const { error: orgError } = await supabase
          .from("organization_profile")
          .insert([
            {
              user_id: newUser.id,
              organization_name: orgData.organizationName.trim(),
              organization_type: orgData.organizationType,
              website: orgData.website?.trim() || null,
              description: orgData.description.trim(),
            },
          ]);

        if (orgError) {
          console.error("Organization profile error:", orgError);
          throw new Error("Failed to create organization profile");
        }
      }
    } catch (profileError) {
      console.error("Error creating profile:", profileError);

      // Cleanup: Delete the user if profile creation failed
      await supabase.from("user").delete().eq("id", newUser.id);

      return NextResponse.json(
        {
          success: false,
          error: "Failed to create user profile. Please try again.",
          details: [
            profileError instanceof Error
              ? profileError.message
              : "Profile creation failed",
          ],
        },
        { status: 500 }
      );
    }

    // Generate JWT token
    console.log("Generating token...");
    const token = generateToken(newUser.id, newUser.email);

    console.log("Registration completed successfully");
    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        data: {
          token,
          user: {
            id: newUser.id,
            firstName: newUser.first_name,
            lastName: newUser.last_name,
            email: newUser.email,
            location: newUser.location,
            created_at: newUser.created_at,
            role: data.role,
          },
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error during registration",
        details: [error instanceof Error ? error.message : "Unknown error"],
      },
      { status: 500 }
    );
  }
}
