import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { engineLogs, limbahLogs } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { department, date, data } = await req.json();

    if (!department || !date || !data) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (department === "engine") {
      // Delete existing for this date to perform a simple full replace (upsert)
      await db.delete(engineLogs).where(eq(engineLogs.date, date));
      
      const insertData = [];
      for (const [hour, params] of Object.entries(data)) {
        if (Object.keys(params as object).length === 0) continue;
        
        insertData.push({
          id: crypto.randomUUID(),
          userId,
          date,
          hour,
          ...params as any
        });
      }

      if (insertData.length > 0) {
        await db.insert(engineLogs).values(insertData);
      }
    } else if (department === "limbah") {
      await db.delete(limbahLogs).where(eq(limbahLogs.date, date));
      
      const insertData = [];
      for (const [hour, params] of Object.entries(data)) {
        if (Object.keys(params as object).length === 0) continue;
        
        insertData.push({
          id: crypto.randomUUID(),
          userId,
          date,
          hour,
          ...params as any
        });
      }

      if (insertData.length > 0) {
        await db.insert(limbahLogs).values(insertData);
      }
    } else {
      return NextResponse.json({ error: "Invalid department" }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Data saved successfully" });
  } catch (error) {
    console.error("Error saving logsheet:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
