import { clerkClient } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users as usersTable } from "@/db/schema";
import EnrollmentClient from "./EnrollmentClient";

export const dynamic = "force-dynamic";

export default async function EnrollmentPage() {
  const client = await clerkClient();
  const allUsers = await client.users.getUserList();

  // Fetch enrolled users from DB
  const dbUsers = await db.select({ clerkId: usersTable.clerkId, faceDescriptor: usersTable.faceDescriptor }).from(usersTable);
  const enrolledClerkIds = new Set(dbUsers.filter(u => u.faceDescriptor).map(u => u.clerkId));

  // Filter out admins and users who are already enrolled
  const pendingUsers = allUsers.data
    .filter(user => {
      const role = user.publicMetadata?.role as string;
      return role !== "admin" && !enrolledClerkIds.has(user.id);
    })
    .map(user => ({
      id: user.id,
      name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.emailAddresses[0]?.emailAddress || "Unknown",
      email: user.emailAddresses[0]?.emailAddress || "-",
      role: (user.publicMetadata?.role as string) || "Unassigned"
    }));

  return <EnrollmentClient users={pendingUsers} />;
}
