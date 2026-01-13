// app/checkout/route.ts

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Cart from '@/models/Cart';
import stripe from '@/lib/stripe';
import { Types } from 'mongoose';

// 1. Define the product interface to avoid 'any'
interface IStripeProduct {
  _id: Types.ObjectId;
  stripeId: string;
}

// 2. Interface for populated cart item
interface IPopulatedCartItem {
  productId: IStripeProduct;
  quantity: number;
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { cartId, successUrl, cancelUrl } = await request.json();

    if (!cartId || !successUrl || !cancelUrl) {
      return NextResponse.json(
        { error: 'Missing parameters' },
        { status: 400 }
      );
    }

    // Get cart and products
    const cart = await Cart.findOne({ sessionId: cartId }).populate('items.productId');

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: 'Empty cart' },
        { status: 400 }
      );
    }

    // 3. Map with IPopulatedCartItem type
    const lineItems = cart.items.map((item: IPopulatedCartItem) => {
      const product = item.productId;

      if (!product?.stripeId) {
        throw new Error(`Product with ID ${product?._id} has no Stripe Price ID configured.`);
      }

      return {
        price: product.stripeId,
        quantity: item.quantity,
      };
    });

    // Create Stripe payment session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { cartId },
    });

    return NextResponse.json({ url: session.url });

  } catch (err: unknown) { // 4. Changed 'any' to 'unknown'
    console.error('Checkout error:', err);

    // Safe error handling for TypeScript
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
