// app/admin/settings/page.tsx
// SECURITY FIX: Admin settings page for 2FA and security configuration

import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import TwoFactorSetup from "../components/TwoFactorSetup";
import TwoFactorStatus from "../components/TwoFactorStatus";
import AdminAsyde from "../components/AdminAsyde";

export default async function SettingsPage() {
  // SECURITY FIX: Verify user is authenticated
  const user = await getAuthUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminAsyde />

        <main className="flex-1 p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Security Settings
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your account security and authentication preferences
            </p>
          </div>

          <div className="space-y-8">
            {/* SECURITY FIX: Two-Factor Authentication Section */}
            <section className="max-w-2xl">
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                Two-Factor Authentication (2FA)
              </h2>
              <TwoFactorStatus />
              <div className="mt-6">
                <TwoFactorSetup />
              </div>
            </section>

            {/* SECURITY FIX: Password Security Section */}
            <section className="max-w-2xl bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                Password Security
              </h2>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Keep your password strong and unique to protect your account.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                  <p className="text-sm font-semibold text-blue-900">
                    ✓ Password Requirements:
                  </p>
                  <ul className="text-sm text-blue-900 space-y-1 ml-4 list-disc">
                    <li>At least 8 characters</li>
                    <li>Mix of uppercase and lowercase letters</li>
                    <li>Numbers and special characters</li>
                    <li>Avoid common words and personal information</li>
                  </ul>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Change Password
                </button>
              </div>
            </section>

            {/* SECURITY FIX: Active Sessions Section */}
            <section className="max-w-2xl bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                Active Sessions
              </h2>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Your current session is active. Sessions expire after 24 hours
                  of inactivity for security.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">
                        Current Device
                      </p>
                      <p className="text-sm text-gray-500">Active now</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* SECURITY FIX: Security Tips Section */}
            <section className="max-w-2xl bg-amber-50 rounded-xl border border-amber-200 p-6">
              <h2 className="text-xl font-bold mb-4 text-amber-900">
                🛡️ Security Tips
              </h2>
              <ul className="space-y-3 text-sm text-amber-900">
                <li>
                  • ✅ Enable Two-Factor Authentication for maximum security
                </li>
                <li>• ✅ Use a unique password for your admin account</li>
                <li>• ✅ Save backup codes in a secure location</li>
                <li>• ✅ Log out of sessions you don&apos;t recognize</li>
                <li>• ✅ Never share your TOTP codes with anyone</li>
                <li>• ✅ Keep your authenticator app backed up</li>
              </ul>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
