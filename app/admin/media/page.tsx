"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Upload, Trash2, Copy, Image as ImageIcon, Loader2, CheckCircle, AlertCircle, X } from "lucide-react";

interface MediaImage {
  url: string;
  name: string;
}

const MediaPage = () => {
  const [images, setImages] = useState<MediaImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState<MediaImage | null>(null);
  const [notification, setNotification] = useState<{message: string; type: 'success' | 'error'} | null>(null);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchImages = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/media");
      if (!res.ok) throw new Error("Misslyckades med att hämta bilder");
      const data: MediaImage[] = await res.json();
      setImages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ett okänt fel inträffade");
      showNotification("Misslyckades med att ladda bilder", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    showNotification("Bild-URL kopierad till urklipp!", "success");
  };

  const handleDelete = async (name: string) => {
    if (!confirm("Är du säker på att du vill ta bort denna bild?")) return;
    try {
      const res = await fetch("/api/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error("Misslyckades med att ta bort bild");
      setImages(images.filter((img) => img.name !== name));
      showNotification("Bilden togs bort framgångsrikt!", "success");
    } catch (err) {
      showNotification(err instanceof Error ? err.message : "Ett okänt fel inträffade", "error");
    }
  };

  const uploadFiles = async (files: File[]) => {
    setUploading(true);
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        showNotification(`Hopper över icke-bildfil: ${file.name}`, "error");
        continue;
      }

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/media", { method: "POST", body: formData });
        if (!res.ok) throw new Error("Misslyckades med att ladda upp bild");
        const newImage: MediaImage = await res.json();
        setImages(prev => [newImage, ...prev]);
        showNotification(`${file.name} laddades upp framgångsrikt!`, "success");
      } catch (err) {
        showNotification(err instanceof Error ? err.message : "Ett okänt fel inträffade", "error");
      }
    }
    setUploading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) uploadFiles(Array.from(files));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files) uploadFiles(Array.from(e.dataTransfer.files));
  };

  return (
    <div className="container mx-auto min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-4">Mediebibliotek</h1>

      {/* Uppladdningsområde */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 mb-8 transition-all duration-200 ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input type="file" id="file-upload" className="hidden" onChange={handleFileChange} accept="image/*" multiple />
        <label htmlFor="file-upload" className="flex flex-col items-center justify-center cursor-pointer">
          {uploading ? <Loader2 className="w-8 h-8 text-blue-500 animate-spin" /> : <Upload className="w-8 h-8 text-blue-500" />}
          <p className="mt-2">{uploading ? "Laddar upp..." : "Dra och släpp filer här eller klicka för att bläddra"}</p>
        </label>
      </div>

      {/* Galleri */}
      {loading ? (
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
      ) : images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {images.map((img) => (
            <div key={img.name} className="relative group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md border border-gray-200">
              <div className="aspect-square relative">
                <Image src={img.url} alt={img.name} fill className="object-cover" onClick={() => setSelectedImage(img)} />
              </div>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                <button onClick={() => handleCopyUrl(img.url)} className="bg-white/90 p-2 rounded-full"><Copy className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(img.name)} className="bg-red-500 p-2 rounded-full text-white"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Inga bilder än</p>
      )}

      {/* Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center" onClick={() => setSelectedImage(null)}>
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <div className="p-4 flex justify-between border-b">
              <h3>{selectedImage.name}</h3>
              <button onClick={() => setSelectedImage(null)}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4 relative aspect-video w-full">
              <Image src={selectedImage.url} alt={selectedImage.name} fill className="object-contain" />
            </div>
          </div>
        </div>
      )}

      {/* Notifikation */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-3 rounded-lg shadow-lg ${notification.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default MediaPage;