import Link from "next/link";

// app/success/page.tsx
export default function SuccessPage() {
  return (
    <div className="max-w-md mx-auto p-8 text-center">
      <h1 className="text-2xl font-bold text-green-600">Payment completed!</h1>
      <p>Thank you for your purchase.</p>
      <Link href="/" className="text-blue-600 mt-4 inline-block">Back to store</Link>
    </div>
  );
}
