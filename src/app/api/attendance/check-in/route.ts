import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, attendances } from "@/db/schema";
import { eq } from "drizzle-orm";

// Helper function to calculate Euclidean distance between two vectors (128-d arrays)
function euclideanDistance(desc1: number[], desc2: number[]): number {
  if (desc1.length !== desc2.length) return 999;
  let sum = 0;
  for (let i = 0; i < desc1.length; i++) {
    const diff = desc1[i] - desc2[i];
    sum += diff * diff;
  }
  return Math.sqrt(sum);
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { faceDescriptor } = body;

    if (!faceDescriptor || !Array.isArray(faceDescriptor)) {
      return NextResponse.json({ error: "Invalid face data" }, { status: 400 });
    }

    // 1. Get user's saved face descriptor from Turso DB
    const userRecords = await db.select().from(users).where(eq(users.clerkId, userId));
    if (userRecords.length === 0 || !userRecords[0].faceDescriptor) {
      return NextResponse.json({ error: "Anda belum melakukan registrasi wajah (Face Enrollment). Hubungi Admin." }, { status: 404 });
    }

    const savedDescriptor = JSON.parse(userRecords[0].faceDescriptor);

    // 2. Compute Euclidean Distance
    const distance = euclideanDistance(faceDescriptor, savedDescriptor);
    
    // 3. Threshold check (PRD states <= 0.45 is a match)
    if (distance > 0.45) {
      return NextResponse.json({ 
        error: "Wajah tidak cocok dengan data pendaftaran Anda.",
        distance: distance.toFixed(2)
      }, { status: 403 });
    }

    // 4. Record attendance
    // Determine shift based on current time (rough estimation for now)
    const hour = new Date().getHours();
    let shift = "Pagi";
    if (hour >= 15 && hour < 23) shift = "Sore";
    if (hour >= 23 || hour < 7) shift = "Malam";

    await db.insert(attendances).values({
      id: crypto.randomUUID(),
      userId: userId,
      checkIn: new Date(),
      shift: shift,
      status: "success",
      similarityScore: distance,
    });

    return NextResponse.json({ 
      success: true, 
      message: "Presensi berhasil!",
      distance: distance.toFixed(2)
    });

  } catch (error) {
    console.error("Check-in error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
