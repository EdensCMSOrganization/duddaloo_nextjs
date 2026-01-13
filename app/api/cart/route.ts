import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import { Types } from "mongoose";

// Interface for the items inside the Cart document
interface ICartItem {
  productId: Types.ObjectId;
  quantity: number;
}

// Interface for the final response to the frontend
interface CartItemResponse {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

// Interface for the Product model (simplified for the map)
interface IProduct {
  _id: Types.ObjectId;
  name: string;
  price: number;
  images: string[];
}
// ::::::::::::::HELPER (move to helper) :::::::::::::::
// Helper para obtener y formatear el carrito (reutilizable en GET, PUT, DELETE)
async function getCartData(cartId: string) {
  const cart = await Cart.findOne({ sessionId: cartId });

  if (!cart) {
    return { items: [], totalItems: 0, totalPrice: 0 };
  }

  // Extract IDs and fetch products with explicit typing
  const productIds = cart.items
    .map((item: ICartItem) => item.productId)
    .filter((id: Types.ObjectId | null) => id);

  const products: IProduct[] = await Product.find({ _id: { $in: productIds } });
  const productMap = new Map<string, IProduct>(
    products.map((p) => [p._id.toString(), p])
  );

  let totalItems = 0;
  let totalPrice = 0;

  const populatedItems = cart.items.reduce(
    (acc: CartItemResponse[], item: ICartItem) => {
      if (!item.productId) return acc;

      const productIdStr = item.productId.toString();
      const product = productMap.get(productIdStr);

      if (product) {
        const itemTotal = (product.price || 0) * item.quantity;
        totalItems += item.quantity;
        totalPrice += itemTotal;

        acc.push({
          productId: productIdStr,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || "",
          quantity: item.quantity,
        });
      }
      return acc;
    },
    []
  );

  return { items: populatedItems, totalItems, totalPrice };
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const cartId = request.nextUrl.searchParams.get("cartId");

    if (!cartId) {
      return NextResponse.json({ items: [], totalItems: 0, totalPrice: 0 });
    }

    const data = await getCartData(cartId);
    return NextResponse.json(data);
  } catch (err) {
    console.error("❌ Error in GET /api/cart:", err);
    return NextResponse.json(
      { error: "Error loading cart", items: [], totalItems: 0, totalPrice: 0 },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const { cartId, productId, quantity } = await request.json();

    if (!cartId || !productId || typeof quantity !== "number") {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const cart = await Cart.findOne({ sessionId: cartId });
    if (!cart)
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });

    const item = cart.items.find(
      (item: ICartItem) => item.productId.toString() === productId
    );

    if (item) {
      item.quantity = quantity;
      // Si la cantidad es 0 o menor, eliminamos el item (seguridad adicional)
      if (item.quantity <= 0) {
        cart.items = cart.items.filter(
          (i: ICartItem) => i.productId.toString() !== productId
        );
      }
    }

    await cart.save();

    const cartData = await getCartData(cartId);
    return NextResponse.json(cartData);
  } catch (err) {
    console.error("❌ Error in PUT /api/cart:", err);
    return NextResponse.json({ error: "Error updating cart" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const { cartId, productId } = await request.json();

    if (!cartId || !productId) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const cart = await Cart.findOne({ sessionId: cartId });
    if (cart) {
      cart.items = cart.items.filter(
        (item: ICartItem) => item.productId.toString() !== productId
      );
      await cart.save();
    }

    const cartData = await getCartData(cartId);
    return NextResponse.json(cartData);
  } catch (err) {
    console.error("❌ Error in DELETE /api/cart:", err);
    return NextResponse.json({ error: "Error removing item" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { cartId, productId, quantity = 1 } = body;

    if (!cartId || !productId) {
      return NextResponse.json(
        { error: "Missing required data" },
        { status: 400 }
      );
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    let cart = await Cart.findOne({ sessionId: cartId });
    if (!cart) {
      cart = new Cart({ sessionId: cartId, items: [] });
    }

    const existingItem = cart.items.find(
      (item: ICartItem) => item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId: new Types.ObjectId(productId), quantity });
    }

    await cart.save();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Error in POST /api/cart:", err);
    return NextResponse.json(
      { error: "Error adding item to cart" },
      { status: 500 }
    );
  }
}
