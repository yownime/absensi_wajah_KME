import { clerkClient } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users as usersTable } from "@/db/schema";
import { Users, Search, ChevronRight } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function RekapAbsensiIndex() {
  const client = await clerkClient();
  const allUsers = await client.users.getUserList();

  // Fetch users from DB
  const dbUsers = await db.select({ clerkId: usersTable.clerkId }).from(usersTable);
  const dbClerkIds = new Set(dbUsers.map(u => u.clerkId));

  const operators = allUsers.data.map(user => {
    const role = (user.publicMetadata?.role as string) || "Unassigned";
    return {
      id: user.id,
      name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.emailAddresses[0]?.emailAddress || "Unknown",
      email: user.emailAddresses[0]?.emailAddress || "-",
      imageUrl: user.imageUrl,
      role: role,
      isInDb: dbClerkIds.has(user.id)
    };
  }).filter(u => (u.role === "engine" || u.role === "limbah") && u.isInDb);

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-extrabold text-agency-dark uppercase tracking-tight">
          Rekap Absensi
        </h1>
        <p className="text-gray-500 mt-1 font-medium">Pilih karyawan untuk melihat rekap kehadiran bulanan.</p>
      </div>

      {/* Modern Data Table */}
      <div className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-xl">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="relative w-full max-w-sm">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari karyawan..." 
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-agency-lime focus:ring-agency-lime transition-colors"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-agency-dark text-white text-xs uppercase tracking-widest font-bold">
                <th className="px-8 py-5">Profil Karyawan</th>
                <th className="px-8 py-5">Divisi (Role)</th>
                <th className="px-8 py-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {operators.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-8 py-16 text-center text-gray-400 font-medium">
                    Belum ada data operator yang terdaftar.
                  </td>
                </tr>
              ) : (
                operators.map(op => (
                  <tr key={op.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <img 
                          src={op.imageUrl} 
                          alt={op.name}
                          className="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover"
                        />
                        <div>
                          <div className="font-bold text-agency-dark">{op.name}</div>
                          <div className="text-xs font-medium text-gray-500">{op.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex px-4 py-1.5 text-xs font-bold rounded-full uppercase tracking-wider ${
                        op.role === 'engine' ? 'bg-blue-50 text-blue-600 border border-blue-200' : 
                        op.role === 'limbah' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {op.role}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <Link 
                        href={`/admin/rekap-absensi/${op.id}`}
                        className="inline-flex items-center gap-2 text-sm font-bold bg-agency-lime text-agency-dark hover:bg-[#a3e635] transition-colors px-6 py-2.5 rounded-xl shadow-[0_5px_15px_rgba(190,242,100,0.2)]"
                      >
                        Lihat Rekap <ChevronRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
