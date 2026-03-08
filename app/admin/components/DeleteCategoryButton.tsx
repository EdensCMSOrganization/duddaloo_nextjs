// app/admin/components/DeleteCategoryButton.tsx
"use client";

import { deleteCategory } from "../actions/deleteCategory";

export default function DeleteCategoryButton({
  categoryId,
}: {
  categoryId: string;
}) {
  const handleDelete = async () => {
    if (confirm("Delete this category?")) {
      await deleteCategory(categoryId);
      window.location.reload();
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
    >
      Radera
    </button>
  );
}
