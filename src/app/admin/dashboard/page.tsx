import { clerkClient } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users as usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { UserCheck, UserX, Users, Activity, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const client = await clerkClient();
  const allUsers = await client.users.getUserList();

  // Fetch enrolled users from DB
  const dbUsers = await db.select({ clerkId: usersTable.clerkId, faceDescriptor: usersTable.faceDescriptor }).from(usersTable);
  const enrolledClerkIds = new Set(dbUsers.filter(u => u.faceDescriptor).map(u => u.clerkId));

  // Process data
  let totalEngine = 0;
  let totalLimbah = 0;
  let totalPending = 0;

  const operators = allUsers.data.map(user => {
    const role = (user.publicMetadata?.role as string) || "Unassigned";
    const isEnrolled = enrolledClerkIds.has(user.id);

    if (role === "engine") totalEngine++;
    if (role === "limbah") totalLimbah++;
    
    // Only count as pending if they are an operator (engine/limbah) and not enrolled
    if ((role === "engine" || role === "limbah") && !isEnrolled) {
      totalPending++;
    }

    return {
      id: user.id,
      name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.emailAddresses[0]?.emailAddress || "Unknown",
      email: user.emailAddresses[0]?.emailAddress || "-",
      imageUrl: user.imageUrl,
      role: role,
      isEnrolled
    };
  }).filter(u => u.role === "engine" || u.role === "limbah" || u.role === "Unassigned");

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-agency-dark uppercase tracking-tight">
            Dashboard Admin
          </h1>
          <p className="text-gray-500 mt-1 font-medium">Manajemen user dan registrasi wajah biometrik.</p>
        </div>
        <Link 
          href="/admin/enrollment"
          className="inline-flex items-center gap-2 px-6 py-3 bg-agency-lime hover:bg-[#a3e635] text-agency-dark font-bold uppercase tracking-wider rounded-xl transition-all shadow-[0_10px_20px_rgba(190,242,100,0.2)] hover:scale-105"
        >
          <UserCheck className="w-5 h-5" />
          Registrasi Wajah
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="relative overflow-hidden bg-white border border-gray-100 p-8 rounded-[2rem] shadow-xl group hover:border-agency-lime transition-colors">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <Activity className="w-20 h-20 text-agency-dark" />
          </div>
          <div className="relative z-10">
            <div className="text-gray-500 font-bold mb-2 flex items-center gap-2 uppercase tracking-wider text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              Operator Engine
            </div>
            <div className="text-5xl font-black text-agency-dark mt-2">{totalEngine}</div>
          </div>
        </div>

        <div className="relative overflow-hidden bg-white border border-gray-100 p-8 rounded-[2rem] shadow-xl group hover:border-emerald-500 transition-colors">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <Users className="w-20 h-20 text-agency-dark" />
          </div>
          <div className="relative z-10">
            <div className="text-gray-500 font-bold mb-2 flex items-center gap-2 uppercase tracking-wider text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              Operator Limbah
            </div>
            <div className="text-5xl font-black text-agency-dark mt-2">{totalLimbah}</div>
          </div>
        </div>

        <div className="relative overflow-hidden bg-agency-dark border border-agency-lime/20 p-8 rounded-[2rem] shadow-xl group hover:border-agency-lime transition-colors">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <UserX className="w-20 h-20 text-agency-lime" />
          </div>
          <div className="relative z-10">
            <div className="text-agency-lime font-bold mb-2 flex items-center gap-2 uppercase tracking-wider text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse"></span>
              Belum Terdaftar Wajah
            </div>
            <div className="text-5xl font-black text-white mt-2">{totalPending}</div>
          </div>
        </div>
      </div>

      {/* Modern Data Table */}
      <div className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-xl">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-agency-dark uppercase tracking-tight">Daftar Operator</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-agency-dark text-white text-xs uppercase tracking-widest font-bold">
                <th className="px-8 py-5">Profil</th>
                <th className="px-8 py-5">Divisi (Role)</th>
                <th className="px-8 py-5">Status Biometrik</th>
                <th className="px-8 py-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {operators.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-16 text-center text-gray-400 font-medium">
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
                    <td className="px-8 py-5">
                      {op.isEnrolled ? (
                        <div className="flex items-center gap-2 text-sm font-bold text-emerald-600">
                          <CheckCircleIcon className="w-5 h-5" />
                          <span>Terdaftar</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-sm font-bold text-rose-500">
                          <XCircleIcon className="w-5 h-5" />
                          <span>Belum Terdaftar</span>
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-5 text-right">
                      {!op.isEnrolled ? (
                        <Link 
                          href="/admin/enrollment"
                          className="inline-flex items-center gap-1 text-sm font-bold text-agency-dark hover:text-agency-lime transition-colors border border-gray-200 hover:border-agency-lime hover:bg-agency-dark px-4 py-2 rounded-xl"
                        >
                          Daftarkan <ChevronRight className="w-4 h-4" />
                        </Link>
                      ) : (
                        <span className="text-sm font-bold text-gray-300">-</span>
                      )}
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

function CheckCircleIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>
    </svg>
  );
}

function XCircleIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>
    </svg>
  );
}
