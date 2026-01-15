// models/Cart.ts
import { Schema, model, models, Types } from "mongoose";

export interface ICartItem {
  productId: Types.ObjectId | string;
  quantity: number;
}

export interface ICart {
  _id?: string;
  sessionId: string;
  items: ICartItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

const cartItemSchema = new Schema<ICartItem>({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, min: 1, default: 1 },
});

const cartSchema = new Schema<ICart>(
  {
    sessionId: { type: String, required: true, index: true },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

const Cart = models.Cart || model("Cart", cartSchema);
export default Cart;
