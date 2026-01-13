// app/admin/layout.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies(); // ✅ await
  const isAuthenticated = cookieStore.has("admin_session");

  if (!isAuthenticated) {
    redirect("/login");
  }

  return <>{children}</>;
}