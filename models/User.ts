// models/User.ts
import { Schema, model, models } from 'mongoose';

export interface IUser {
  _id?: string;
  email: string;
  password: string; // hashed
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = models.User || model('User', userSchema);
export default User;