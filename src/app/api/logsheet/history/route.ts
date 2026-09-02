import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { engineLogs, limbahLogs } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const department = searchParams.get("department");
    const date = searchParams.get("date");

    if (!department || !date) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    let records = [];
    if (department === "engine") {
      records = await db.select().from(engineLogs).where(eq(engineLogs.date, date));
    } else if (department === "limbah") {
      records = await db.select().from(limbahLogs).where(eq(limbahLogs.date, date));
    } else {
      return NextResponse.json({ error: "Invalid department" }, { status: 400 });
    }

    // Convert flat records back into nested object: { "07:00": { temp: "30" } }
    const data: Record<string, any> = {};
    for (const record of records) {
      const { hour, id, userId: uId, date: d, createdAt, ...params } = record;
      // Filter out nulls
      const cleanParams: any = {};
      for (const [k, v] of Object.entries(params)) {
        if (v !== null) cleanParams[k] = v.toString();
      }
      data[hour as string] = cleanParams;
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching logsheet:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
