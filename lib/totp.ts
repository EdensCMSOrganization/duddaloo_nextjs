// lib/totp.ts
// SECURITY FIX: TOTP (Time-based One-Time Password) implementation for 2FA
// Uses speakeasy for TOTP logic and AES-256-GCM for secret encryption

import speakeasy from "speakeasy";
import QRCode from "qrcode";
import bcrypt from "bcryptjs";
import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

// 🔒 Load encryption key from environment
const TOTP_SECRET_KEY_RAW = process.env.TOTP_SECRET_KEY;
if (!TOTP_SECRET_KEY_RAW) {
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "SECURITY ERROR: TOTP_SECRET_KEY is required in production. Generate one with PowerShell."
    );
  }
  console.warn("⚠️ Using fallback TOTP_SECRET_KEY (dev only)");
}

// Use first 32 bytes of the key (AES-256 requires 32-byte key)
const ENCRYPTION_KEY = Buffer.from(TOTP_SECRET_KEY_RAW || "fallback-32-byte-key-for-dev-1234", "utf8").slice(0, 32);
const ALGORITHM = "aes-256-gcm"; // Authenticated encryption

// TOTP configuration
const TOTP_CONFIG = {
  name: "Duddaloo Store",
  issuer: "Duddaloo",
  length: 32, // Base32 secret length
  window: 1,  // Allow 1 time step (30s) before/after for clock skew
};

/**
 * Generates a TOTP secret and QR code for user setup.
 * @param email User's email (used in QR label)
 * @returns Secret (base32) and QR code data URL
 */
export async function generateTOTPSecret(email: string) {
  try {
    const secret = speakeasy.generateSecret({
      name: `${TOTP_CONFIG.name} (${email})`,
      issuer: TOTP_CONFIG.issuer,
      length: TOTP_CONFIG.length,
    });

    const qrCode = await QRCode.toDataURL(secret.otpauth_url || "");
    return {
      secret: secret.base32, // This will be encrypted before DB storage
      qrCode,
    };
  } catch (error) {
    console.error("Error generating TOTP secret:", error);
    throw new Error("Failed to generate TOTP secret");
  }
}

/**
 * Verifies a 6-digit TOTP token against a secret.
 * @param token 6-digit code from authenticator app
 * @param secret Base32-encoded TOTP secret
 * @returns true if valid
 */
export function verifyTOTPToken(token: string, secret: string): boolean {
  try {
    const cleanToken = token.replace(/\s/g, "");
    if (!/^\d{6}$/.test(cleanToken)) return false;

    return speakeasy.totp.verify({
      secret,
      encoding: "base32",
      token: cleanToken,
      window: TOTP_CONFIG.window,
    }) === true;
  } catch (error) {
    console.error("Error verifying TOTP token:", error);
    return false;
  }
}

/**
 * Generates 10 backup codes (8 chars, uppercase alphanumeric).
 * @returns Array of plain-text backup codes
 */
export async function generateBackupCodes(): Promise<string[]> {
  const codes: string[] = [];
  for (let i = 0; i < 10; i++) {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    // Ensure it's exactly 8 chars and alphanumeric
    codes.push(code.padEnd(8, "X").substring(0, 8));
  }
  return codes;
}

/**
 * Hashes a backup code for secure storage.
 * @param code Plain-text backup code
 * @returns Hashed code (using bcrypt)
 */
export async function hashBackupCode(code: string): Promise<string> {
  return await bcrypt.hash(code, 10);
}

/**
 * Verifies a plain-text backup code against its hash.
 * @param code User-provided code
 * @param hashedCode Stored hash
 * @returns true if matches
 */
export async function verifyBackupCode(code: string, hashedCode: string): Promise<boolean> {
  return await bcrypt.compare(code, hashedCode);
}

/**
 * 🔒 Encrypts TOTP secret using AES-256-GCM.
 * Format: iv:encrypted:authTag (all hex)
 */
export function encryptSecret(secret: string): string {
  const iv = randomBytes(12); // 96-bit IV for GCM
  const cipher = createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  const encrypted = cipher.update(secret, "utf8", "hex") + cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");
  return `${iv.toString("hex")}:${encrypted}:${authTag}`;
}

/**
 * 🔒 Decrypts TOTP secret using AES-256-GCM.
 * @param encryptedSecret Format: iv:encrypted:authTag
 * @returns Decrypted secret (plain text)
 */
export function decryptSecret(encryptedSecret: string): string {
  try {
    const [ivHex, encryptedHex, authTagHex] = encryptedSecret.split(":");
    if (!ivHex || !encryptedHex || !authTagHex) {
      throw new Error("Invalid encrypted secret format");
    }

    const decipher = createDecipheriv(
      ALGORITHM,
      ENCRYPTION_KEY,
      Buffer.from(ivHex, "hex")
    );
    decipher.setAuthTag(Buffer.from(authTagHex, "hex"));

    const decrypted = decipher.update(encryptedHex, "hex", "utf8") + decipher.final("utf8");
    return decrypted;
  } catch (error) {
    console.error("Decryption failed:", error);
    throw new Error("Failed to decrypt TOTP secret");
  }
}