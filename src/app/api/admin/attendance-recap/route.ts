import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, attendances } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { checkRole } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const isAdmin = await checkRole("admin");
    const isManagement = await checkRole("management");
    if (!isAdmin && !isManagement) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const clerkId = searchParams.get("clerkId");
    const monthStr = searchParams.get("month");
    const yearStr = searchParams.get("year");

    if (!clerkId || !monthStr || !yearStr) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const month = parseInt(monthStr);
    const year = parseInt(yearStr);

    // Get user internal ID
    const userRecords = await db.select().from(users).where(eq(users.clerkId, clerkId));
    if (userRecords.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const internalUserId = userRecords[0].id;

    // Fetch all attendances for the given user
    const allAttendances = await db.select().from(attendances)
      .where(eq(attendances.userId, internalUserId));

    // Filter by month and year in Javascript (since SQLite dates are stored as timestamps/strings, easier to filter here for MVP)
    const monthlyAttendances = allAttendances.filter(a => {
      const date = new Date(a.checkIn);
      return date.getMonth() + 1 === month && date.getFullYear() === year;
    });

    // Calculate Summary Stats
    const totalDaysInMonth = new Date(year, month, 0).getDate();
    
    // We assume 5 working days a week for basic MVP calculation or just count non-weekends
    let workingDays = 0;
    for (let d = 1; d <= totalDaysInMonth; d++) {
      const date = new Date(year, month - 1, d);
      if (date.getDay() !== 0 && date.getDay() !== 6) { // Skip Sunday and Saturday
        workingDays++;
      }
    }

    let hadir = 0;
    let terlambat = 0;
    let izinCuti = 0;
    let totalLateMinutes = 0;
    let totalWorkingHours = 0;

    const detailKehadiran = monthlyAttendances.map(a => {
      const checkInDate = new Date(a.checkIn);
      const checkOutDate = a.checkOut ? new Date(a.checkOut) : null;
      
      const hariMap = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
      const hari = hariMap[checkInDate.getDay()];
      const tanggal = `${checkInDate.getDate()} ${checkInDate.toLocaleString('id-ID', { month: 'short' })} ${checkInDate.getFullYear()}`;
      
      const formatTime = (d: Date) => d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      
      const jamMasuk = formatTime(checkInDate);
      const jamPulang = checkOutDate ? formatTime(checkOutDate) : "-";
      
      let durasi = "-";
      if (checkOutDate) {
        const diffMs = checkOutDate.getTime() - checkInDate.getTime();
        const diffHrs = Math.floor(diffMs / 1000 / 60 / 60);
        const diffMins = Math.floor((diffMs / 1000 / 60) % 60);
        durasi = `${diffHrs} jam ${diffMins} menit`;
        totalWorkingHours += diffHrs;
      }

      if (a.type === "presence") {
        hadir++;
        if (a.lateMinutes && a.lateMinutes > 0) {
          terlambat++;
          totalLateMinutes += a.lateMinutes;
        }
      } else if (a.type === "leave" || a.type === "sick") {
        izinCuti++;
      }

      let statusDisplay = a.type === "presence" ? (a.lateMinutes && a.lateMinutes > 0 ? "Terlambat" : "Tepat Waktu") : 
                          (a.type === "leave" ? "Izin" : (a.type === "sick" ? "Sakit" : "Alpha"));
      
      // Prevent double counting if someone checks in twice a day, but for MVP we assume 1/day
      return {
        id: a.id,
        tanggal,
        hari,
        jamMasuk,
        jamPulang,
        durasi,
        terlambat: a.lateMinutes && a.lateMinutes > 0 ? `${Math.floor(a.lateMinutes / 60)} jam ${a.lateMinutes % 60} menit` : "-",
        status: statusDisplay
      };
    });

    const tidakHadir = workingDays - hadir - izinCuti;
    const tingkatKehadiran = workingDays > 0 ? Math.round((hadir / workingDays) * 100) : 0;

    return NextResponse.json({
      summary: {
        hariKerja: workingDays,
        hadir,
        terlambat,
        tidakHadir: tidakHadir > 0 ? tidakHadir : 0,
        izinCuti,
        menitTerlambat: totalLateMinutes,
        jamKerja: totalWorkingHours,
        tingkatKehadiran: `${tingkatKehadiran}%`
      },
      detail: detailKehadiran.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime())
    });

  } catch (error) {
    console.error("Rekap error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
