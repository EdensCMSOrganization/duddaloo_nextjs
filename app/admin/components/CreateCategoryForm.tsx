// app/admin/components/CreateCategoryForm.tsx
"use client";

import { useActionState, useRef, useEffect } from "react";
import { createCategory } from "../actions/createCategory";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
      disabled={pending}
    >
      {pending ? "Skapar..." : "Lägg till kategori"}
    </button>
  );
}

export default function CreateCategoryForm() {
  const [state, formAction] = useActionState(createCategory, {
    success: false,
    error: null,
  });
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state?.success]);

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      {state?.error && (
        <p className="text-red-600 text-sm bg-red-50 p-2 rounded">
          {state.error}
        </p>
      )}

      {state?.success && (
        <p className="text-green-600 text-sm bg-green-50 p-2 rounded">
          ✅ Kategorin skapades!
        </p>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Kategorinamn</label>
        <input
          type="text"
          name="name"
          required
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="t.ex. Affischer"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Slug (valfritt)
        </label>
        <input
          type="text"
          name="slug"
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="autogenereras från namn"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Beskrivning</label>
        <textarea
          name="description"
          rows={2}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Valfri beskrivning"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          📏 Tillgängliga storlekar (valfritt)
        </label>
        <input
          type="text"
          name="sizes"
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="t.ex. XS, S, M, L, XL (separerade med kommatecken)"
        />
        <p className="text-xs text-gray-500 mt-1">
          Om denna kategori har storleksvarianter, ange dem här. Lämna tomt om inte tillämpligt (t.ex. Böcker).
        </p>
      </div>

      <SubmitButton />
    </form>
  );
}
