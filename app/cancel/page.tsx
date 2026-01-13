// app/cancel/page.tsx
export default function CancelPage() {
  return (
    <div className="max-w-md mx-auto p-8 text-center">
      <h1 className="text-2xl font-bold text-red-600">Payment canceled</h1>
      <p>No charge was made.</p>
      <a href="/cart" className="text-blue-600 mt-4 inline-block">Back to cart</a>
    </div>
  );
}
