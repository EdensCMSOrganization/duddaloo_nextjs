"use client";

import Link from "next/link";
import AdminAsyde from "./AdminAsyde";
import InactivityLogout from "./InactivityLogout";
import LogoutButton from "./LogoutButton";

export default function AdminContent({
  productList,
}: {
  productList: React.ReactNode;
}) {
  return (
    <div className="container mx-auto min-h-screen bg-gray-50">
      <InactivityLogout timeoutMinutes={60} />

      <div className="flex">
        <AdminAsyde />

        <main className="flex-1 p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Produktadministration
                </h2>
                <p className="text-gray-600">Visa och hantera alla produkter</p>
              </div>

              <div className="flex gap-4">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-lg"
                >
                  Tillbaka till startsidan
                </Link>

                <div className="w-48">
                  <LogoutButton />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {productList}
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[linear-gradient(90deg,#f5f3ff,#ede9fe)] rounded-xl p-4 border border-purple-100">
              <h4 className="font-semibold text-gray-800 mb-2">Tips</h4>
              <p className="text-sm text-gray-600">
                Lägg till tydliga produktbilder och detaljerade beskrivningar för bättre konvertering.
              </p>
            </div>
            <div className="bg-[linear-gradient(90deg,#fffbeb,#fef3c7)] rounded-xl p-4 border border-yellow-100">
              <h4 className="font-semibold text-gray-800 mb-2">Kvalitet</h4>
              <p className="text-sm text-gray-600">
                Se till att all produktinformation är korrekt och uppdaterad.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
