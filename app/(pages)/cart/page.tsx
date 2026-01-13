'use client';

import { useCartId } from '@/lib/cartUtils';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';

type CartItem = {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type CartData = {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
};

export default function CartPage() {
  const cartId = useCartId();
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [updatingItem, setUpdatingItem] = useState<string | null>(null);

  useEffect(() => {
    if (!cartId) return;
    const fetchCart = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/cart?cartId=${cartId}`);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const data = await res.json();
        setCart(data);
      } catch (error) {
        console.error("Error fetching cart:", error);
        setCart({ items: [], totalItems: 0, totalPrice: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [cartId]);

  const updateQuantity = async (productId: string, newQuantity: number) => {
    if (!cartId || newQuantity < 1) return;
    
    setUpdatingItem(productId);
    try {
      const res = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartId, productId, quantity: newQuantity }),
      });

      if (res.ok) {
        const updatedCart = await res.json();
        setCart(updatedCart);
        window.dispatchEvent(new Event('cart-updated'));
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setUpdatingItem(null);
    }
  };

  const removeItem = async (productId: string) => {
    if (!cartId) return;
    
    setUpdatingItem(productId);
    try {
      const res = await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartId, productId }),
      });

      if (res.ok) {
        const updatedCart = await res.json();
        setCart(updatedCart);
        window.dispatchEvent(new Event('cart-updated'));
      }
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setUpdatingItem(null);
    }
  };

  const handleCheckout = async () => {
    if (!cartId) return;

    try {
      setIsRedirecting(true);
      const successUrl = `${window.location.origin}/success`;
      const cancelUrl = `${window.location.origin}/cart`;

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartId, successUrl, cancelUrl }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Error starting payment: ' + (data.error || 'unknown'));
        setIsRedirecting(false);
      }
    } catch (error) {
      alert('Network error while connecting to Stripe');
      setIsRedirecting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen max-w-4xl mx-auto p-4 md:p-8 font-sans">
        <div className="text-center pt-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
            <ShoppingBag className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Looks like you haven&apos;t added any products to your cart yet.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">
            {cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {cart.items.map((item) => (
                <div
                  key={item.productId}
                  className="p-6 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <div className="relative w-28 h-28 shrink-0">
                      <div className="relative w-full h-full overflow-hidden rounded-xl border border-gray-200">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 112px) 100vw, 112px"
                        />
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900 mb-1">
                            {item.name}
                          </h3>
                          <p className="text-green-600 font-bold text-lg">
                            {item.price} SEK
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.productId)}
                          disabled={updatingItem === item.productId}
                          className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Quantity Controls */}
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            disabled={updatingItem === item.productId || item.quantity <= 1}
                            className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          
                          <div className="min-w-15 text-center">
                            {updatingItem === item.productId ? (
                              <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-green-600 border-t-transparent"></div>
                            ) : (
                              <span className="font-semibold text-lg px-3 py-1">
                                {item.quantity}
                              </span>
                            )}
                          </div>
                          
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            disabled={updatingItem === item.productId}
                            className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            {item.quantity * item.price} SEK
                          </p>
                          <p className="text-sm text-gray-500">
                            {item.quantity} × {item.price} SEK
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 sticky top-8">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                
                {/* Price Breakdown */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{cart.totalPrice} SEK</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Taxes</span>
                    <span>Included</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  {/* Total Display */}
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-green-600">
                        {cart.totalPrice} SEK
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Including VAT
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 mb-6">
                    You&apos;ll pay in Swedish Krona
                  </p>

                  {/* Checkout Button */}
                  <button
                    onClick={handleCheckout}
                    disabled={isRedirecting}
                    className="w-full bg-linear-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-3"
                  >
                    {isRedirecting ? (
                      <>
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <span>Proceed to Payment</span>
                          <span className="text-xl">→</span>
                        </div>
                      </>
                    )}
                  </button>

                  {/* Continue Shopping Link */}
                  <Link
                    href="/"
                    className="mt-4 w-full text-center text-gray-600 hover:text-gray-900 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Continue Shopping
                  </Link>

                  {/* Security Badge */}
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
                      <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      </div>
                      Secure payment powered by Stripe
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}