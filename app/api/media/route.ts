// app/api/media/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getAuthUserFromRequest } from "@/lib/auth";

const BUCKET = "duddallos_products";
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Listar imágenes
export async function GET() {
  try {
    const { data, error } = await supabase.storage.from(BUCKET).list("");
    if (error) throw error;

    const images = data.map((file) => {
      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(file.name);
      return { name: file.name, url: urlData.publicUrl };
    });

    return NextResponse.json(images);
  } catch (err) {
    console.error("GET /api/media error:", err);
    return NextResponse.json({ error: "Failed to list images" }, { status: 500 });
  }
}

// Subir imagen
export async function POST(request: NextRequest) {
  try {
    const user = getAuthUserFromRequest(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) return NextResponse.json({ error: "No file found" }, { status: 400 });
    if (!ALLOWED_MIME_TYPES.includes(file.type)) return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    if (file.size > MAX_FILE_SIZE) return NextResponse.json({ error: "File too large" }, { status: 400 });

    const uniqueName = `${Date.now()}-${file.name}`;
    const buffer = new Uint8Array(await file.arrayBuffer());

    const { error } = await supabase.storage.from(BUCKET).upload(uniqueName, buffer, { contentType: file.type });
    if (error) throw error;

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(uniqueName);

    return NextResponse.json({ name: uniqueName, url: urlData.publicUrl });
  } catch (err) {
    console.error("POST /api/media error:", err);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}

// Borrar imagen
export async function DELETE(request: NextRequest) {
  try {
    const user = getAuthUserFromRequest(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name } = await request.json();
    if (!name) return NextResponse.json({ error: "File name required" }, { status: 400 });

    const { error } = await supabase.storage.from(BUCKET).remove([name]);
    if (error) throw error;

    return NextResponse.json({ message: "Image deleted successfully" });
  } catch (err) {
    console.error("DELETE /api/media error:", err);
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}