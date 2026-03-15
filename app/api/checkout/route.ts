import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Cart from "@/models/Cart";
import Stripe from "stripe";
import { Types } from "mongoose";

interface IStripeProduct {
  _id: Types.ObjectId;
  stripeId: string;
  stock?: number;
  name?: string;
}

interface IPopulatedCartItem {
  productId: IStripeProduct | null;
  quantity: number;
}

export async function POST(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe Secret Key saknas" },
      { status: 500 },
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    await connectDB();

    const { cartId, successUrl, cancelUrl, shippingCost } = await request.json();

    if (!cartId || !successUrl || !cancelUrl) {
      return NextResponse.json(
        { error: "Saknade parametrar: cartId, successUrl eller cancelUrl" },
        { status: 400 },
      );
    }

    const finalShippingCost = typeof shippingCost === "number" ? shippingCost : 69;
    const shippingAmountInOre = finalShippingCost * 100;

    const cart = await Cart.findOne({ sessionId: cartId }).populate(
      "items.productId",
    );

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Varukorgen är tom" }, { status: 400 });
    }

    const cartItems = cart.items as IPopulatedCartItem[];
    
    for (const item of cartItems) {
      const prod = item.productId;
      if (!prod) continue;
      if (item.quantity > (prod.stock || 0)) {
        return NextResponse.json(
          {
            error: `Endast ${prod.stock || 0} enheter av ${prod.name || "produkten"} finns kvar i lager`,
          },
          { status: 400 },
        );
      }
    }

    type StripeLineItem = { price: string; quantity: number };
    const lineItems = cartItems.reduce(
      (acc: StripeLineItem[], item): StripeLineItem[] => {
        const product = item.productId;
        if (product && product.stripeId) {
          acc.push({
            price: product.stripeId,
            quantity: item.quantity,
          });
        }
        return acc;
      },
      [],
    );

    if (lineItems.length === 0) {
      return NextResponse.json(
        { error: "Inga giltiga produkter i varukorgen" },
        { status: 400 },
      );
    }

 
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "klarna", "paypal"],
      line_items: lineItems,
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { cartId },

      
      customer_creation: 'always',

      invoice_creation: {
        enabled: true,
      },

      shipping_address_collection: {
        allowed_countries: ["SE", "ES", "US"],
      },

      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: shippingAmountInOre,
              currency: "sek",
            },
            display_name:
              finalShippingCost === 0
                ? "Gratis frakt"
                : `Standardfrakt (${finalShippingCost} SEK)`,
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
    console.error("Fel vid utcheckning:", err);
    const errorMessage = err instanceof Error ? err.message : "Okänt fel";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}