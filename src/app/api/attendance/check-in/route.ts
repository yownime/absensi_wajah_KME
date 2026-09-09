import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, attendances } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

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
    // Check if user already checked in recently and hasn't checked out
    const lastAttendance = await db.select().from(attendances)
      .where(eq(attendances.userId, userId))
      .orderBy(sql`${attendances.checkIn} DESC`)
      .limit(1);

    const now = new Date();
    let isCheckOut = false;

    if (lastAttendance.length > 0) {
      const lastCheckIn = new Date(lastAttendance[0].checkIn);
      // If checked in less than 16 hours ago and checkOut is null, it's a check-out
      const diffHours = (now.getTime() - lastCheckIn.getTime()) / (1000 * 60 * 60);
      
      if (!lastAttendance[0].checkOut && diffHours < 16) {
        // Perform Check-Out
        await db.update(attendances)
          .set({ checkOut: now })
          .where(eq(attendances.id, lastAttendance[0].id));
        isCheckOut = true;
      }
    }

    if (!isCheckOut) {
      // Determine shift based on current time (rough estimation for now)
      const hour = now.getHours();
      let shift = "Pagi";
      if (hour >= 15 && hour < 23) shift = "Sore";
      if (hour >= 23 || hour < 7) shift = "Malam";

      // Calculate late minutes (assuming standard start is 08:00 for Pagi, 16:00 for Sore, 00:00 for Malam)
      let lateMinutes = 0;
      if (shift === "Pagi" && (hour > 8 || (hour === 8 && now.getMinutes() > 0))) {
        lateMinutes = (hour - 8) * 60 + now.getMinutes();
      } else if (shift === "Sore" && (hour > 16 || (hour === 16 && now.getMinutes() > 0))) {
        lateMinutes = (hour - 16) * 60 + now.getMinutes();
      } else if (shift === "Malam" && (hour > 0 || (hour === 0 && now.getMinutes() > 0))) {
        lateMinutes = hour * 60 + now.getMinutes();
      }

      await db.insert(attendances).values({
        id: crypto.randomUUID(),
        userId: userId,
        checkIn: now,
        shift: shift,
        type: "presence",
        lateMinutes: lateMinutes > 0 ? lateMinutes : 0,
        status: "success",
        similarityScore: distance,
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: isCheckOut ? "Check-out berhasil!" : "Presensi berhasil!",
      isCheckOut: isCheckOut,
      distance: distance.toFixed(2)
    });

  } catch (error) {
    console.error("Check-in error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
