"use client";

import { useActionState, useState } from "react";
import { updateCategory } from "../actions/updateCategory";
import { useFormStatus } from "react-dom";
import DeleteCategoryButton from "./DeleteCategoryButton";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50"
      disabled={pending}
    >
      {pending ? "Sparar..." : "Spara"}
    </button>
  );
}

export default function EditCategoryForm({
  category,
  onComplete,
}: {
  category: {
    _id: string;
    name: string;
    description?: string;
    sizes?: string[];
  };
  onComplete?: () => void;
}) {
  const [state, formAction] = useActionState(updateCategory, {
    success: false,
    error: null,
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleComplete = (data: FormData) => {
    formAction(data);
    setTimeout(() => {
      if (state?.success) {
        setIsEditing(false);
        onComplete?.();
      }
    }, 100);
  };

  if (!isEditing) {
    return (
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
        <div className="flex-1">
          <p className="font-semibold">{category.name}</p>
          <p className="text-sm text-gray-600">{category.description}</p>
          {category.sizes && category.sizes.length > 0 && (
            <p className="text-xs text-blue-600 mt-1">
              📏 Storlekar: {category.sizes.join(", ")}
            </p>
          )}
        </div>
        <div className="flex gap-2 ml-2">
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
          >
            ✏️ Redigera
          </button>
          <DeleteCategoryButton categoryId={category._id} />
        </div>
      </div>
    );
  }

  return (
    <form
      action={handleComplete}
      className="p-3 bg-blue-50 rounded-lg border border-blue-200 space-y-2"
    >
      <input type="hidden" name="id" value={category._id} />

      {state?.error && <p className="text-red-600 text-sm">{state.error}</p>}

      {state?.success && (
        <p className="text-green-600 text-sm">✅ Kategorin uppdaterad!</p>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Kategorinamn</label>
        <input
          type="text"
          name="name"
          required
          defaultValue={category.name}
          className="w-full p-2 border rounded text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Beskrivning</label>
        <textarea
          name="description"
          defaultValue={category.description || ""}
          rows={2}
          className="w-full p-2 border rounded text-sm resize-none"
          placeholder="Valfri beskrivning"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          📏 Tillgängliga storlekar
        </label>
        <input
          type="text"
          name="sizes"
          defaultValue={category.sizes ? category.sizes.join(", ") : ""}
          className="w-full p-2 border rounded text-sm"
          placeholder="t.ex. XS, S, M, L, XL (separerade med kommatecken)"
        />
        <p className="text-xs text-gray-500 mt-1">
          Lämna tomt om inte tillämpligt (t.ex. för Böcker)
        </p>
      </div>

      <div className="flex gap-2">
        <SubmitButton />
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
        >
          Avbryt
        </button>
      </div>
    </form>
  );
}
