// app/api/auth/totp/status/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getAuthUserFromRequest } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    // Cast to NextRequest to access cookies
    const authUser = getAuthUserFromRequest(request as any);
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(authUser.userId);
    return NextResponse.json({ enabled: !!user?.totpEnabled });
  } catch (error) {
    console.error("TOTP status error:", error);
    return NextResponse.json({ enabled: false }, { status: 500 });
  }
}