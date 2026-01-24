// app/admin/components/TwoFactorSetup.tsx
"use client";

import { useState } from "react";
import Image from "next/image";

interface TwoFactorSetupProps {
  onSetupComplete?: () => void;
}

export default function TwoFactorSetup({
  onSetupComplete,
}: TwoFactorSetupProps) {
  const [step, setStep] = useState<"initial" | "setup" | "verify" | "complete">(
    "initial",
  );
  const [qrCode, setQrCode] = useState<string>("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [totpCode, setTotpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [secret, setSecret] = useState("");

  // SECURITY FIX: Initiate TOTP setup
  const handleStartSetup = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/totp/setup", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to setup TOTP");
      }

      const data = await response.json();
      setQrCode(data.qrCode);
      setBackupCodes(data.backupCodes);
      setSecret(data.secret);
      setStep("setup");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Setup failed");
    } finally {
      setLoading(false);
    }
  };

  // SECURITY FIX: Verify TOTP code and enable 2FA
  const handleVerifyTOTP = async () => {
    if (!totpCode || totpCode.length !== 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/totp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret,
          totpToken: totpCode,
        }),
      });

      if (!response.ok) {
        throw new Error("Invalid TOTP code");
      }

      setStep("complete");
      onSetupComplete?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  // SECURITY FIX: Copy backup code to clipboard
  const copyBackupCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">
        {step === "initial" && "Enable Two-Factor Authentication"}
        {step === "setup" && "Scan QR Code"}
        {step === "verify" && "Verify Setup"}
        {step === "complete" && "2FA Enabled Successfully"}
      </h2>

      {/* SECURITY FIX: Initial step */}
      {step === "initial" && (
        <div className="space-y-4">
          <p className="text-gray-600">
            Two-Factor Authentication adds an extra layer of security to your
            account. You&apos;ll need to enter a code from your authenticator app
            when logging in.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              💡 You&apos;ll need an authenticator app like Google Authenticator,
              Microsoft Authenticator, or Authy.
            </p>
          </div>
          <button
            onClick={handleStartSetup}
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Setting up..." : "Get Started"}
          </button>
        </div>
      )}

      {/* SECURITY FIX: Setup step - Show QR code */}
      {step === "setup" && (
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-6 flex flex-col items-center">
            {qrCode && (
              <>
                <p className="text-sm text-gray-600 mb-4">
                  Scan this QR code with your authenticator app:
                </p>
                <Image
                  src={qrCode}
                  alt="TOTP QR Code"
                  width={250}
                  height={250}
                  className="border-4 border-white shadow-lg"
                />
              <p className="text-xs text-gray-500 mt-4 text-center">
                    If you can&apos;t scan, enter this key manually:{" "}
                    <code className="bg-white px-2 py-1 rounded">{secret}</code>
              </p>
                            </>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900">Backup Codes</h3>
            <p className="text-sm text-gray-600">
              Save these codes in a safe place. You can use them to access your
              account if you lose access to your authenticator app.
            </p>
            <div className="grid grid-cols-2 gap-2 bg-gray-50 p-4 rounded-lg">
              {backupCodes.map((code, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-white p-2 rounded border border-gray-200 cursor-pointer hover:bg-gray-100"
                  onClick={() => copyBackupCode(code, index)}
                >
                  <code className="font-mono text-sm">{code}</code>
                  <span className="text-xs text-gray-500 ml-2">
                    {copiedIndex === index ? "✓" : "📋"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setStep("verify")}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Next: Verify Code
          </button>
        </div>
      )}

      {/* SECURITY FIX: Verify step */}
      {step === "verify" && (
        <div className="space-y-4">
          <p className="text-gray-600">
            Enter the 6-digit code from your authenticator app to confirm setup:
          </p>
          <input
            type="text"
            placeholder="000000"
            value={totpCode}
            onChange={(e) =>
              setTotpCode(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            maxLength={6}
            className="w-full p-3 border-2 rounded-lg text-center text-2xl tracking-widest font-mono"
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="flex gap-3">
            <button
              onClick={() => setStep("setup")}
              className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400"
            >
              Back
            </button>
            <button
              onClick={handleVerifyTOTP}
              disabled={loading || totpCode.length !== 6}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify & Enable"}
            </button>
          </div>
        </div>
      )}

      {/* SECURITY FIX: Success step */}
      {step === "complete" && (
        <div className="space-y-4 text-center">
          <div className="text-5xl mb-4">✅</div>
          <p className="text-green-600 font-semibold text-lg">
            Two-Factor Authentication is now enabled!
          </p>
          <p className="text-gray-600">
            You&apos;ll need to enter a code from your authenticator app when logging
            in.
          </p>
          <button
            onClick={() => {
              setStep("initial");
              setQrCode("");
              setBackupCodes([]);
              setTotpCode("");
            }}
            className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
