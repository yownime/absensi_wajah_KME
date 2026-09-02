import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: "Anda belum login. Silakan login terlebih dahulu." }, { status: 401 });
  }

  try {
    const client = await clerkClient();
    
    // Set role menjadi admin
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: "admin",
      },
    });

    // Arahkan kembali ke halaman utama
    const url = new URL("/", req.url);
    return NextResponse.redirect(url);
  } catch (error) {
    console.error("Error setting admin role:", error);
    return NextResponse.json({ error: "Gagal mengatur role admin" }, { status: 500 });
  }
}
