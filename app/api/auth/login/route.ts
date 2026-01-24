// app/api/auth/login/route.ts
import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/lib/db";
import jwt from "jsonwebtoken";
 import { JWT_SECRET } from "@/lib/auth"; 
import User from "@/models/User";
import {
  verifyPassword,
  setAuthCookie,
  setTOTPSession,
  TOTP_SESSION_COOKIE_NAME,
  getAuthUserFromRequest,
} from "@/lib/auth";
import { verifyTOTPToken, decryptSecret } from "@/lib/totp";
import {
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
} from "@/lib/rateLimiter";

export async function POST(request: NextRequest) {
  try {
    const { email, password, totpToken } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y contraseña requeridos" },
        { status: 400 }
      );
    }

    const rateLimitKey = email.toLowerCase();
    const rateLimit = checkRateLimit(rateLimitKey);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `Too many login attempts. Please try again in ${rateLimit.retryAfterSeconds} seconds.`,
        },
        { status: 429 }
      );
    }

    await connectDB();
    const user = await User.findOne({ email });
    if (!user) {
      recordFailedAttempt(rateLimitKey);
      return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      recordFailedAttempt(rateLimitKey);
      return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 });
    }

    // Handle TOTP flow
    if (user.totpEnabled && user.totpSecret) {
      if (!totpToken) {
        // Step 1: Password OK → ask for TOTP
        await setTOTPSession(user._id.toString());
        return NextResponse.json({
          success: false,
          requiresTOTP: true,
          message: "Please provide TOTP code",
        });
      }

      // Step 2: TOTP provided → validate session first!
      const totpSessionToken = request.cookies.get(TOTP_SESSION_COOKIE_NAME)?.value;
// Dentro de POST, después de:
// const totpSessionToken = request.cookies.get(TOTP_SESSION_COOKIE_NAME)?.value;

if (!totpSessionToken) {
  recordFailedAttempt(rateLimitKey);
  return NextResponse.json({ error: "Invalid session" }, { status: 401 });
}

        // ✅ Verificación segura del token de sesión TOTP
       // ← añade esta importación al inicio del archivo

        let sessionId: string;
        try {
          const decoded = jwt.verify(totpSessionToken, JWT_SECRET) as { userId: string };
          sessionId = decoded.userId;
        } catch {
          recordFailedAttempt(rateLimitKey);
          return NextResponse.json({ error: "Invalid session" }, { status: 401 });
        }

        if (sessionId !== user._id.toString()) {
          recordFailedAttempt(rateLimitKey);
          return NextResponse.json({ error: "Invalid session" }, { status: 401 });
        }
      // Now verify TOTP
      try {
        const decryptedSecret = decryptSecret(user.totpSecret);
        const isTOTPValid = verifyTOTPToken(totpToken, decryptedSecret);
        if (!isTOTPValid) {
          recordFailedAttempt(rateLimitKey);
          return NextResponse.json({ error: "Invalid TOTP code" }, { status: 401 });
        }
      } catch (error) {
        console.error("TOTP verification error:", error);
        recordFailedAttempt(rateLimitKey);
        return NextResponse.json({ error: "TOTP verification failed" }, { status: 500 });
      }

      // Clear TOTP session
      const headers = new Headers();
      headers.set(
        "Set-Cookie",
        `${TOTP_SESSION_COOKIE_NAME}=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax${
          process.env.NODE_ENV === "production" ? "; Secure" : ""
        }`
      );
    }

    // Success!
    resetRateLimit(rateLimitKey);
    await setAuthCookie(user._id.toString());

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}