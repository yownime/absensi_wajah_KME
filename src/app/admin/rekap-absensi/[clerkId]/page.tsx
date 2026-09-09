import { clerkClient } from "@clerk/nextjs/server";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import RekapClient from "./RekapClient";

export const dynamic = "force-dynamic";

export default async function EmployeeRekapPage({ params }: { params: Promise<{ clerkId: string }> }) {
  const { clerkId } = await params;
  const client = await clerkClient();
  const user = await client.users.getUser(clerkId);
  const name = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.emailAddresses[0]?.emailAddress || "Karyawan";

  return (
    <div className="space-y-6 pb-12">
      <Link 
        href="/admin/rekap-absensi"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-agency-lime transition-colors font-medium mb-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Daftar Karyawan
      </Link>
      
      <div>
        <h1 className="text-3xl font-extrabold text-agency-dark tracking-tight">
          Rekap Absensi: <span className="text-agency-lime">{name}</span>
        </h1>
        <p className="text-gray-500 mt-1 font-medium">Lihat rekap kehadiran bulanan</p>
      </div>

      <RekapClient clerkId={clerkId} />
    </div>
  );
}
