import Image from "next/image";
import React from "react";
import CreateProductForm from "./CreateProductForm";
import Link from "next/link";

function AdminAsyde() {
  return (
    <>
      <aside className="w-full md:w-1/2 lg:w-2/4 bg-[#F8F6F2] rounded-2xl border-r border-gray-200 min-h-screen p-6 sticky top-0 self-start my-6 shadow-2xl">
        <div className="mb-6">
          <Image
            src="/logo.svg"
            alt="CMS-logotyp"
            width={80}
            height={80}
            priority
          />
          <h1 className="text-2xl font-bold text-gray-800">Adminpanel</h1>
          <p className="text-gray-600 text-sm mt-1">Hantera dina produkter</p>
        </div>

        <div className="bg-lineart-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-6 border border-green-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Lägg till ny produkt
          </h2>
          <CreateProductForm />
        </div>

        <div className="mt-4 mx-4 space-y-3">
          <Link
            href="/admin/categories"
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg w-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            Hantera kategorier
          </Link>

          <Link
            href="/admin/media"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg w-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Hantera media
          </Link>

          {/* SECURITY FIX: Länk till säkerhetsinställningar */}
          <Link
            href="/admin/settings"
            className="inline-flex items-center justify-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors shadow-lg w-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            Säkerhetsinställningar
          </Link>
        </div>
      </aside>
    </>
  );
}

export default AdminAsyde;
