// app/checkout/route.ts

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Cart from "@/models/Cart";
import Stripe from "stripe";
import { Types } from "mongoose";

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
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe Secret Key missing" },
      { status: 500 }
    );
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    await connectDB();

    const { cartId, successUrl, cancelUrl } = await request.json();

    if (!cartId || !successUrl || !cancelUrl) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 }
      );
    }

    // Get cart and products
    const cart = await Cart.findOne({ sessionId: cartId }).populate(
      "items.productId"
    );

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Empty cart" }, { status: 400 });
    }

    // 3. Map with IPopulatedCartItem type
    const lineItems = cart.items.reduce(
      (acc: any[], item: IPopulatedCartItem) => {
        const product = item.productId;

        // Verificamos que el producto exista (no sea null) y tenga stripeId
        if (product && product.stripeId) {
          acc.push({
            price: product.stripeId,
            quantity: item.quantity,
          });
        }
        return acc;
      },
      []
    );

    if (lineItems.length === 0) {
      return NextResponse.json(
        { error: "No valid products in cart" },
        { status: 400 }
      );
    }

    // Create Stripe payment session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: [
        "card",
        "klarna",
        "paypal",
        "swish",
        // Apple Pay y Google Pay se muestran dinámicamente si el cliente usa un dispositivo compatible.
      ],
      line_items: lineItems,
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { cartId },
      // 1. Recoger dirección de envío
      shipping_address_collection: {
        allowed_countries: ["SE", "ES", "US"], // Ajusta los países a los que vendes
      },
      // 2. Opciones de envío
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 0, // Gratis
              currency: "sek",
            },
            display_name: "Free Shipping",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 5 },
              maximum: { unit: "business_day", value: 7 },
            },
          },
        },
      ],
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    // 4. Changed 'any' to 'unknown'
    console.error("Checkout error:", err);

    // Safe error handling for TypeScript
    const errorMessage = err instanceof Error ? err.message : "Unknown error";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
