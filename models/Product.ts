// models/Product.ts
import { Schema, model, models } from 'mongoose';


export interface IProduct {
  _id?: string;
  name: string;
  description: string;
  price: number;
  stripeId: string;
  images: string[]; // ahora es un array
  inStock: boolean;
  createdAt?: Date;
}

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stripeId: { type: String, required: true, unique: true },
  images: [{ type: String }], // array de URLs
  inStock: { type: Boolean, default: true }
}, { timestamps: true });

const Product = models.Product || model('Product', productSchema);
export default Product;