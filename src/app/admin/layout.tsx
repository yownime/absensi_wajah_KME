import { checkRole } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UserPlus, LayoutDashboard, LogOut, ClipboardList } from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAdmin = await checkRole("admin");
  if (!isAdmin) {
    redirect("/");
  }

  return (
    <div suppressHydrationWarning className="min-h-screen bg-agency-cream text-agency-dark flex flex-col md:flex-row font-sans selection:bg-agency-lime selection:text-agency-dark">
      <aside className="w-full md:w-64 bg-agency-dark border-r border-gray-800/50 flex flex-col p-4 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-agency-lime/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="mb-10 relative z-10 px-2 pt-2">
          <img src="/logo.png" alt="KME Attendance Logo" className="h-14 bg-white p-2 rounded-xl" />
        </div>
        <nav className="flex-1 space-y-2 relative z-10">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3 px-4 py-3.5 rounded-2xl hover:bg-agency-lime hover:text-agency-dark text-gray-300 transition-all font-semibold group"
          >
            <LayoutDashboard className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Dashboard
          </Link>
          <Link
            href="/admin/enrollment"
            className="flex items-center gap-3 px-4 py-3.5 rounded-2xl hover:bg-agency-lime hover:text-agency-dark text-gray-300 transition-all font-semibold group"
          >
            <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Face Enrollment
          </Link>
          <Link
            href="/admin/rekap-absensi"
            className="flex items-center gap-3 px-4 py-3.5 rounded-2xl hover:bg-agency-lime hover:text-agency-dark text-gray-300 transition-all font-semibold group"
          >
            <ClipboardList className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Rekap Absensi
          </Link>
        </nav>
        <div className="mt-auto relative z-10 pt-4 border-t border-white/10">
          <SignOutButton>
            <div role="button" className="flex items-center justify-center gap-3 px-4 py-3 w-full rounded-2xl cursor-pointer hover:bg-white text-gray-300 hover:text-agency-dark font-bold transition-colors">
              <LogOut className="w-5 h-5" />
              Keluar
            </div>
          </SignOutButton>
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-auto bg-agency-cream relative">{children}</main>
    </div>
  );
}
