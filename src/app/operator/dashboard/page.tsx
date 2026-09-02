import { getRole, hasCheckedInToday } from "@/lib/auth";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Camera, FileText, CheckCircle2, Clock, AlertTriangle, Activity, BarChart3, ShieldCheck } from "lucide-react";
import LiveClock from "@/components/LiveClock";
import { db } from "@/db";
import { engineLogs, limbahLogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ENGINE_PARAMS, LIMBAH_PARAMS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function OperatorDashboard() {
  const { userId } = await auth();
  if (!userId) redirect("/");
  
  const user = await currentUser();
  const role = await getRole();

  const hasCheckedIn = await hasCheckedInToday(userId);
  if (!hasCheckedIn) {
    redirect("/operator/presensi");
  }

  const todayDate = new Date().toISOString().split("T")[0];
  const currentHour = new Date().getHours();
  
  let shiftName = "Pagi";
  if (currentHour >= 15 && currentHour < 23) shiftName = "Sore";
  if (currentHour >= 23 || currentHour < 7) shiftName = "Malam";

  // Fetch today's logs
  let logs: any[] = [];
  if (role === "engine") {
    logs = await db.select().from(engineLogs).where(eq(engineLogs.date, todayDate));
  } else if (role === "limbah") {
    logs = await db.select().from(limbahLogs).where(eq(limbahLogs.date, todayDate));
  }
  
  const filledHours = logs.length;
  const progressPercent = Math.min(100, Math.round((filledHours / 24) * 100));

  // Detect anomalies
  const anomalies: { hour: string, paramName: string, value: any, rule: string }[] = [];
  const PARAMS = role === "engine" ? ENGINE_PARAMS : LIMBAH_PARAMS;

  for (const log of logs) {
    for (const p of PARAMS) {
      const valStr = log[p.id as keyof typeof log];
      if (valStr === null || valStr === undefined) continue;
      
      const num = parseFloat(valStr as string);
      if (isNaN(num)) continue;
      
      if (p.max !== undefined && num > p.max) {
        anomalies.push({ hour: log.hour, paramName: p.name, value: num, rule: `> ${p.max}` });
      } else if (p.min !== undefined && num < p.min) {
        anomalies.push({ hour: log.hour, paramName: p.name, value: num, rule: `< ${p.min}` });
      }
    }
  }

  // Group anomalies by hour
  const recentAnomalies = anomalies.slice(-3); // Show max 3

  return (
    <div className="space-y-8 pb-10">
      {/* Welcome Banner */}
      <div className="bg-agency-dark border border-agency-lime/10 p-8 rounded-[2rem] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-agency-lime/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 space-y-2">
          <h1 className="text-3xl font-bold text-white">Selamat Datang, {user?.firstName || user?.username || "Operator"}!</h1>
          <p className="text-gray-300">Pastikan Anda menjaga kebersihan dan keamanan selama bertugas.</p>
        </div>
        <div className="relative z-10 flex flex-col items-end gap-1 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-gray-300">
            <Clock className="w-4 h-4 text-agency-lime" />
            <span className="font-medium text-sm">Shift {shiftName} • <span className="font-mono text-white"><LiveClock /></span> WIB</span>
          </div>
          <div className="font-bold text-lg text-white">{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </div>
      </div>
      
      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Progress Widget */}
        <div className="bg-white border border-gray-100 p-8 rounded-[2rem] space-y-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-agency-dark flex items-center gap-2 uppercase tracking-tight">
              <BarChart3 className="w-5 h-5 text-agency-lime" />
              Progres Logsheet Hari Ini
            </h2>
            <span className="text-3xl font-black text-agency-dark">{filledHours} <span className="text-gray-400 text-lg">/ 24</span></span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-5 overflow-hidden border border-gray-200">
            <div 
              className="bg-agency-lime h-5 rounded-full transition-all duration-1000 ease-out relative"
              style={{ width: `${progressPercent}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
            </div>
          </div>
          <p className="text-sm font-bold text-gray-500 text-right uppercase tracking-wider">{progressPercent}% Tuntas</p>
        </div>

        {/* Anomaly Widget */}
        <div className="bg-white border border-gray-100 p-8 rounded-[2rem] flex flex-col justify-center shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
          <h2 className="text-lg font-bold text-agency-dark flex items-center gap-2 mb-6 uppercase tracking-tight">
            <Activity className="w-5 h-5 text-rose-500" />
            Analisis Parameter Operasional
          </h2>
          
          {anomalies.length === 0 ? (
            <div className="flex items-center gap-4 bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl">
              <ShieldCheck className="w-8 h-8 text-emerald-500 flex-shrink-0" />
              <div>
                <div className="font-semibold text-emerald-400">Semua Sistem Normal</div>
                <div className="text-sm text-emerald-500/70">Tidak ada deviasi parameter yang terdeteksi hari ini.</div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-rose-400 font-semibold mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Terdeteksi {anomalies.length} Anomali
              </div>
              {recentAnomalies.map((a, i) => (
                <div key={i} className="flex justify-between items-center bg-rose-500/10 border border-rose-500/20 px-4 py-3 rounded-xl text-sm">
                  <span className="text-gray-300"><span className="text-gray-500 font-mono mr-2">[{a.hour}]</span> {a.paramName}</span>
                  <span className="text-rose-400 font-bold font-mono">{a.value} <span className="text-rose-500/50 text-xs">({a.rule})</span></span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-agency-dark p-8 rounded-[2rem] space-y-8 shadow-2xl relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-agency-lime/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <h2 className="text-xl font-bold text-white uppercase tracking-wider relative z-10">Jalan Pintas Aktivitas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <Link 
            href={`/operator/logsheet/${role}`}
            className="group flex flex-col items-center justify-center p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-agency-lime hover:border-agency-lime transition-all duration-300 cursor-pointer"
          >
            <div className="w-16 h-16 bg-white/10 text-white group-hover:bg-agency-dark group-hover:text-agency-lime rounded-full flex items-center justify-center mb-6 relative transition-colors shadow-lg">
              <Camera className="w-8 h-8" />
              <CheckCircle2 className="w-6 h-6 absolute -bottom-1 -right-1 bg-agency-dark rounded-full text-agency-lime group-hover:bg-agency-lime group-hover:text-agency-dark" />
            </div>
            <span className="font-bold text-xl text-white group-hover:text-agency-dark transition-colors uppercase tracking-tight">1. Presensi Selesai</span>
            <span className="text-sm text-gray-400 group-hover:text-agency-dark/80 mt-2 text-center font-medium">Klik di sini untuk lanjut mengisi logsheet.</span>
          </Link>

          {progressPercent === 100 ? (
            <Link 
              href={`/operator/logsheet/${role}`}
              className="group flex flex-col items-center justify-center p-8 bg-agency-lime border border-agency-lime rounded-3xl hover:bg-[#a3e635] transition-all duration-300 cursor-pointer shadow-[0_10px_30px_rgba(190,242,100,0.2)]"
            >
              <div className="w-16 h-16 bg-agency-dark text-agency-lime rounded-full flex items-center justify-center mb-6 relative shadow-lg group-hover:scale-110 transition-transform">
                <FileText className="w-8 h-8" />
                <CheckCircle2 className="w-6 h-6 absolute -bottom-1 -right-1 bg-agency-lime rounded-full text-agency-dark" />
              </div>
              <span className="font-bold text-xl text-agency-dark uppercase tracking-tight">2. Logsheet Tuntas</span>
              <span className="text-sm text-agency-dark/80 mt-2 text-center font-medium">Data logsheet hari ini sudah lengkap (24/24). Klik untuk melihat histori.</span>
            </Link>
          ) : (
            <Link 
              href={`/operator/logsheet/${role}`}
              className="group flex flex-col items-center justify-center p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-white hover:border-white transition-all duration-300 cursor-pointer shadow-lg"
            >
              <div className="w-16 h-16 bg-white/10 text-white group-hover:bg-agency-dark group-hover:text-white rounded-full flex items-center justify-center mb-6 transition-colors">
                <FileText className="w-8 h-8" />
              </div>
              <span className="font-bold text-xl text-white group-hover:text-agency-dark transition-colors uppercase tracking-tight">2. Isi Logsheet</span>
              <span className="text-sm text-gray-400 group-hover:text-gray-600 mt-2 text-center font-medium">Lanjutkan pengisian parameter operasional untuk shift Anda.</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
