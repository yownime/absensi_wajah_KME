import { checkRole, getRole, hasCheckedInToday } from "@/lib/auth";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import LogsheetWrapper from "@/components/LogsheetWrapper";

export default async function LogsheetPage({ params }: { params: Promise<{ department: string }> }) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const role = await getRole();
  const { department } = await params;

  const hasCheckedIn = await hasCheckedInToday(userId);
  if (!hasCheckedIn) {
    redirect("/operator/presensi");
  }

  // Verify access
  if (role !== department) {
    if (role === "admin" || role === "management") {
      // Allow view for admin/management but maybe read-only in real app
    } else {
      redirect("/operator/dashboard");
    }
  }

  if (department !== "engine" && department !== "limbah") {
    redirect("/");
  }

  return (
    <LogsheetWrapper department={department as "engine" | "limbah"} />
  );
}
