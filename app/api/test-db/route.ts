// Create this as /api/test-db/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("🔧 Testing Supabase connection...");
    const supabase = await createClient();

    // Test 1: Basic connection
    console.log("Test 1: Basic connection test");
    const { data: connectionTest, error: connectionError } = await supabase
      .from("users")
      .select("count")
      .limit(1);

    if (connectionError) {
      console.error("❌ Connection test failed:", connectionError);
      return NextResponse.json({
        success: false,
        error: "Connection failed",
        details: connectionError,
      });
    }

    console.log("✅ Basic connection successful");

    // Test 2: Check users table structure
    console.log("Test 2: Checking users table structure");
    const { data: tableStructure, error: structureError } = await supabase
      .from("users")
      .select("*")
      .limit(0);

    if (structureError) {
      console.error("❌ Table structure check failed:", structureError);
      return NextResponse.json({
        success: false,
        error: "Table structure check failed",
        details: structureError,
      });
    }

    console.log("✅ Table structure check passed");

    // Test 3: Try a simple insert with proper UUID (and immediately delete)
    console.log("Test 3: Testing insert permissions with proper UUID");

    // Generate a proper UUID v4
    function generateUUID() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          var r = (Math.random() * 16) | 0;
          var v = c == "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
    }

    const testUserId = generateUUID();
    const testData = {
      id: testUserId,
      first_name: "Test",
      last_name: "User",
      email: `test${Date.now()}@example.com`,
      location: "Test City",
      role: "volunteer",
    };

    const { data: insertResult, error: insertError } = await supabase
      .from("users")
      .insert(testData)
      .select()
      .single();

    if (insertError) {
      console.error("❌ Insert test failed:", insertError);
      return NextResponse.json({
        success: false,
        error: "Insert test failed",
        details: insertError,
        testData: testData,
      });
    }

    console.log("✅ Insert test successful:", insertResult);

    // Clean up test data
    const { error: deleteError } = await supabase
      .from("users")
      .delete()
      .eq("id", testUserId);

    if (deleteError) {
      console.error("⚠️ Failed to clean up test data:", deleteError);
    } else {
      console.log("✅ Test data cleaned up");
    }

    return NextResponse.json({
      success: true,
      message: "All database tests passed",
      insertResult: insertResult,
    });
  } catch (error) {
    console.error("💥 Unexpected error:", error);
    return NextResponse.json({
      success: false,
      error: "Unexpected error",
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
