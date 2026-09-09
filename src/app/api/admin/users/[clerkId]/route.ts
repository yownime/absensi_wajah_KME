import { NextResponse } from "next/server";
import { checkRole } from "@/lib/auth";
import { clerkClient } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users as usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(
  req: Request,
  { params }: { params: { clerkId: string } }
) {
  try {
    const isAdmin = await checkRole("admin");
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { clerkId } = params;

    // 1. Delete user from Clerk to revoke login access
    const client = await clerkClient();
    try {
      await client.users.deleteUser(clerkId);
    } catch (clerkErr: any) {
      // If user is already deleted in Clerk, we can just proceed to clean up DB
      if (clerkErr.status !== 404) {
        throw clerkErr;
      }
    }

    // 2. Remove biometric data but keep the DB record for logs history
    await db.update(usersTable)
      .set({ 
        faceDescriptor: null,
        role: "deleted" // optional, to mark them as deleted in DB
      })
      .where(eq(usersTable.clerkId, clerkId));

    return NextResponse.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
