// app/admin/components/CategoryList.tsx
import connectDB from "@/lib/db";
import Category from "@/models/Category";
import EditCategoryForm from "./EditCategoryForm";

export default async function CategoryList() {
  await connectDB();
  const categories = await Category.find({}).sort({ createdAt: -1 }).lean();

  if (categories.length === 0) {
    return <p className="text-gray-600">Inga kategorier än.</p>;
  }

  return (
    <div className="space-y-2">
      {(categories as any[]).map((category) => (
        <EditCategoryForm
          key={category._id.toString()}
          category={{
            _id: category._id.toString(),
            name: category.name,
            description: category.description,
            sizes: category.sizes,
          }}
        />
      ))}
    </div>
  );
}
