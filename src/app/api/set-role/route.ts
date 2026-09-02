import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId: adminId } = await auth();
    
    // Simple admin check
    const client = await clerkClient();
    if (!adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const adminUser = await client.users.getUser(adminId);
    if (adminUser.publicMetadata.role !== "admin") {
      return NextResponse.json({ error: "Only admins can set roles" }, { status: 403 });
    }

    const body = await req.json();
    const { targetUserId, role } = body;

    if (!targetUserId || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Set role
    await client.users.updateUserMetadata(targetUserId, {
      publicMetadata: {
        role: role,
      },
    });

    return NextResponse.json({ success: true, message: "Role updated successfully." });
  } catch (error) {
    console.error("Error setting role:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
