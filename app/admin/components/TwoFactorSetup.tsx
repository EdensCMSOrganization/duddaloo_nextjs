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

  // SÄKERHETSÅTGÄRD: Starta inställning av TOTP
  const handleStartSetup = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/totp/setup", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Misslyckades med att ställa in TOTP");
      }

      const data = await response.json();
      setQrCode(data.qrCode);
      setBackupCodes(data.backupCodes);
      setSecret(data.secret);
      setStep("setup");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Inställningen misslyckades");
    } finally {
      setLoading(false);
    }
  };

  // SÄKERHETSÅTGÄRD: Verifiera TOTP-kod och aktivera 2FA
  const handleVerifyTOTP = async () => {
    if (!totpCode || totpCode.length !== 6) {
      setError("Ange en giltig 6-siffrig kod");
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
        throw new Error("Ogiltig TOTP-kod");
      }

      setStep("complete");
      onSetupComplete?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verifieringen misslyckades");
    } finally {
      setLoading(false);
    }
  };

  // SÄKERHETSÅTGÄRD: Kopiera reservkod till urklipp
  const copyBackupCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">
        {step === "initial" && "Aktivera tvåfaktorsautentisering"}
        {step === "setup" && "Skanna QR-kod"}
        {step === "verify" && "Verifiera inställning"}
        {step === "complete" && "2FA aktiverat framgångsrikt"}
      </h2>

      {/* SÄKERHETSÅTGÄRD: Första steget */}
      {step === "initial" && (
        <div className="space-y-4">
          <p className="text-gray-600">
            Tvåfaktorsautentisering lägger till ett extra säkerhetsskikt till ditt
            konto. Du behöver ange en kod från din autentiseringsapp när du loggar in.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              💡 Du behöver en autentiseringsapp som Google Authenticator,
              Microsoft Authenticator eller Authy.
            </p>
          </div>
          <button
            onClick={handleStartSetup}
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Ställer in..." : "Kom igång"}
          </button>
        </div>
      )}

      {/* SÄKERHETSÅTGÄRD: Inställningssteg - Visa QR-kod */}
      {step === "setup" && (
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-6 flex flex-col items-center">
            {qrCode && (
              <>
                <p className="text-sm text-gray-600 mb-4">
                  Skanna denna QR-kod med din autentiseringsapp:
                </p>
                <Image
                  src={qrCode}
                  alt="TOTP QR-kod"
                  width={250}
                  height={250}
                  className="border-4 border-white shadow-lg"
                />
              <p className="text-xs text-gray-500 mt-4 text-center">
                    Om du inte kan skanna, ange denna nyckel manuellt:{" "}
                    <code className="bg-white px-2 py-1 rounded">{secret}</code>
              </p>
                            </>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900">Reservkoder</h3>
            <p className="text-sm text-gray-600">
              Spara dessa koder på en säker plats. Du kan använda dem för att komma åt
              ditt konto om du förlorar tillgången till din autentiseringsapp.
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
            Nästa: Verifiera kod
          </button>
        </div>
      )}

      {/* SÄKERHETSÅTGÄRD: Verifieringssteg */}
      {step === "verify" && (
        <div className="space-y-4">
          <p className="text-gray-600">
            Ange den 6-siffriga koden från din autentiseringsapp för att bekräfta inställningen:
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
              Tillbaka
            </button>
            <button
              onClick={handleVerifyTOTP}
              disabled={loading || totpCode.length !== 6}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Verifierar..." : "Verifiera & Aktivera"}
            </button>
          </div>
        </div>
      )}

      {/* SÄKERHETSÅTGÄRD: Slutsteg */}
      {step === "complete" && (
        <div className="space-y-4 text-center">
          <div className="text-5xl mb-4">✅</div>
          <p className="text-green-600 font-semibold text-lg">
            Tvåfaktorsautentisering är nu aktiverat!
          </p>
          <p className="text-gray-600">
            Du behöver ange en kod från din autentiseringsapp när du loggar in.
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
            Stäng
          </button>
        </div>
      )}
    </div>
  );
}
