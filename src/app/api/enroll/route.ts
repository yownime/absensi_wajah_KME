import { NextResponse } from "next/server";
import { checkRole } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const isAdmin = await checkRole("admin");
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { userId, faceDescriptor } = body;

    if (!userId || !faceDescriptor) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Convert Float32Array array back to string for storage
    const descriptorString = JSON.stringify(faceDescriptor);

    // Upsert the user's face descriptor into the database
    // Using SQLite ON CONFLICT DO UPDATE behavior
    await db.insert(users).values({
      id: userId,
      clerkId: userId,
      department: "assigned-by-clerk", // Normally you'd read this from Clerk metadata too
      role: "operator", 
      faceDescriptor: descriptorString,
    }).onConflictDoUpdate({
      target: users.clerkId,
      set: { faceDescriptor: descriptorString }
    });

    return NextResponse.json({ success: true, message: "Face descriptor saved." });
  } catch (error) {
    console.error("Error saving face descriptor:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
