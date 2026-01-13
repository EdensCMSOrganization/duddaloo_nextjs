// lib/db.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable for Isra Store');
}

/**
 * Interface to ensure TypeScript knows exactly
 * what we're storing in the global object.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

/**
 * Initially use 'unknown' when accessing global,
 * then safely cast to our interface.
 */
let cached = (global as unknown as { mongoose: MongooseCache }).mongoose;

if (!cached) {
  cached = (global as unknown as { mongoose: MongooseCache }).mongoose = {
    conn: null,
    promise: null
  };
}

export default async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((m) => {
      console.log('🔗 Isra Store: Connected to MongoDB');
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
