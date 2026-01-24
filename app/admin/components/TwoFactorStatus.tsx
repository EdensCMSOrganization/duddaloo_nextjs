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

  // SECURITY FIX: Fetch TOTP status on mount
  useEffect(() => {
    const checkTOTPStatus = async () => {
      try {
        // Since there's no dedicated endpoint to check status,
        // we can determine it by attempting to access protected resources
        // For now, we'll set a placeholder - in production, add a /api/auth/totp/status endpoint
        setLoading(false);
      } catch (err) {
        console.error("Error checking TOTP status:", err);
        setLoading(false);
      }
    };

    checkTOTPStatus();
  }, []);

  // SECURITY FIX: Disable TOTP
  const handleDisableTOTP = async () => {
    if (!password) {
      setError("Password is required");
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
        throw new Error("Failed to disable TOTP");
      }

      setIsEnabled(false);
      setPassword("");
      setShowPasswordForm(false);
      setSuccess("Two-Factor Authentication has been disabled");
      onStatusChange?.(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to disable TOTP");
    } finally {
      setDisabling(false);
    }
  };

  if (loading) {
    return <div className="text-gray-500">Loading 2FA status...</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Two-Factor Authentication</h3>
        <div
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            isEnabled
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {isEnabled ? "🔒 Enabled" : "🔓 Disabled"}
        </div>
      </div>

      {isEnabled ? (
        <div className="space-y-4">
          <p className="text-gray-600">
            Your account is protected with Two-Factor Authentication. You&apos;ll
            need a code from your authenticator app to log in.
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
              Disable 2FA
            </button>
          ) : (
            <div className="space-y-3 bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700 font-semibold">
                Enter your password to disable 2FA:
              </p>
              <input
                type="password"
                placeholder="Password"
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
                  Cancel
                </button>
                <button
                  onClick={handleDisableTOTP}
                  disabled={disabling || !password}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {disabling ? "Disabling..." : "Confirm Disable"}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-600">
          Two-Factor Authentication is not enabled. Enable it to add an extra
          layer of security to your account.
        </p>
      )}
    </div>
  );
}
