// app/admin/components/TwoFactorStatus.tsx
"use client";

import { useEffect, useState } from "react";

interface TwoFactorStatusProps {
  onStatusChange?: (enabled: boolean) => void;
}

export default function TwoFactorStatus({
  onStatusChange,
}: TwoFactorStatusProps) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [disabling, setDisabling] = useState(false);
  const [password, setPassword] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // SÄKERHETSÅTGÄRD: Hämta TOTP-status vid mount
  useEffect(() => {
    const checkTOTPStatus = async () => {
      try {
        // Eftersom det inte finns en dedikerad endpoint för att kontrollera status,
        // kan vi avgöra det genom att försöka komma åt skyddade resurser
        // För nu ställer vi en platshållare - i produktion, lägg till en /api/auth/totp/status endpoint
        setLoading(false);
      } catch (err) {
        console.error("Fel vid kontroll av TOTP-status:", err);
        setLoading(false);
      }
    };

    checkTOTPStatus();
  }, []);

  // SÄKERHETSÅTGÄRD: Inaktivera TOTP
  const handleDisableTOTP = async () => {
    if (!password) {
      setError("Lösenord krävs");
      return;
    }

    setDisabling(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/auth/totp/disable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        throw new Error("Misslyckades med att inaktivera TOTP");
      }

      setIsEnabled(false);
      setPassword("");
      setShowPasswordForm(false);
      setSuccess("Tvåfaktorsautentisering har inaktiverats");
      onStatusChange?.(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Misslyckades med att inaktivera TOTP");
    } finally {
      setDisabling(false);
    }
  };

  if (loading) {
    return <div className="text-gray-500">Laddar 2FA-status...</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Tvåfaktorsautentisering</h3>
        <div
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            isEnabled
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {isEnabled ? "🔒 Aktiverad" : "🔓 Inaktiverad"}
        </div>
      </div>

      {isEnabled ? (
        <div className="space-y-4">
          <p className="text-gray-600">
            Ditt konto är skyddat med tvåfaktorsautentisering. Du behöver en kod från
            din autentiseringsapp för att logga in.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-800 text-sm">{success}</p>
            </div>
          )}

          {!showPasswordForm ? (
            <button
              onClick={() => setShowPasswordForm(true)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Inaktivera 2FA
            </button>
          ) : (
            <div className="space-y-3 bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700 font-semibold">
                Ange ditt lösenord för att inaktivera 2FA:
              </p>
              <input
                type="password"
                placeholder="Lösenord"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPassword("");
                    setError("");
                  }}
                  className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400"
                >
                  Avbryt
                </button>
                <button
                  onClick={handleDisableTOTP}
                  disabled={disabling || !password}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {disabling ? "Inaktiverar..." : "Bekräfta inaktivering"}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-600">
          Tvåfaktorsautentisering är inte aktiverad. Aktivera den för att lägga till
          ett extra säkerhetsskikt till ditt konto.
        </p>
      )}
    </div>
  );
}
