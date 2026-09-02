import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { attendances } from "@/db/schema";
import { eq, and, gte, desc } from "drizzle-orm";

export type Role = "admin" | "management" | "engine" | "limbah";

export async function checkRole(role: Role) {
  const user = await currentUser();
  return user?.publicMetadata?.role === role;
}

export async function getRole() {
  const user = await currentUser();
  return user?.publicMetadata?.role as Role | undefined;
}

export async function hasCheckedInToday(userId: string): Promise<boolean> {
  // Check if there is an attendance record for this user in the last 12 hours
  const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
  
  const records = await db
    .select()
    .from(attendances)
    .where(
      and(
        eq(attendances.userId, userId),
        gte(attendances.checkIn, twelveHoursAgo)
      )
    )
    .orderBy(desc(attendances.checkIn))
    .limit(1);
    
  return records.length > 0;
}
