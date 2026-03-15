// app/admin/media/page.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Upload,
  Trash2,
  Copy,
  Image as ImageIcon,
  Loader2,
  CheckCircle,
  AlertCircle,
  X
} from "lucide-react";

interface MediaImage {
  url: string;
  name: string;
  size?: string;
  uploadedAt?: string;
}

const MediaPage = () => {
  const [images, setImages] = useState<MediaImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState<MediaImage | null>(null);
  const [notification, setNotification] = useState<{message: string; type: 'success' | 'error'} | null>(null);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/media");
      if (!res.ok) {
        throw new Error("Misslyckades med att hämta bilder");
      }
      const data = await res.json();
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

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

 // Cambia esto en handleCopyUrl:
  const handleCopyUrl = (url: string) => {
    // No hace falta concatenar window.location.origin
    navigator.clipboard.writeText(url);
    showNotification("Bild-URL kopierad till urklipp!", "success");
  };

  const handleDelete = async (name: string) => {
    if (!confirm("Är du säker på att du vill ta bort denna bild?")) return;

    try {
      const res = await fetch("/api/media", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        throw new Error("Misslyckades med att ta bort bild");
      }

      setImages(images.filter((image) => image.name !== name));
      showNotification("Bilden togs bort framgångsrikt!", "success");
    } catch (err) {
      showNotification(err instanceof Error ? err.message : "Ett okänt fel inträffade", "error");
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      await uploadFiles(Array.from(files));
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await uploadFiles(Array.from(files));
    }
  };

  const uploadFiles = async (files: File[]) => {
    setUploading(true);

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        showNotification(`Hopper över icke-bildfil: ${file.name}`, "error");
        continue;
      }

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/media", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          throw new Error("Misslyckades med att ladda upp bild");
        }

        const newImage = await res.json();
        setImages(prev => [newImage, ...prev]);
        showNotification(`${file.name} laddades upp framgångsrikt!`, "success");
      } catch (err) {
        showNotification(err instanceof Error ? err.message : "Ett okänt fel inträffade", "error");
      }
    }

    setUploading(false);
  };

  return (
    <div className="container mx-auto min-h-screen p-6">
      <button className="mb-4 bg-blue-200 hover:bg-blue-300 px-4 py-2 rounded-lg" onClick={() => window.history.back()}>Gå tillbaka</button>
      {/* Rubrik */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mediebibliotek</h1>
        <p className="text-gray-600 mt-2">Ladda upp och hantera dina bilder</p>
      </div>

      {/* Uppladdningsområde */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 mb-8 transition-all duration-200 ${
          dragActive
            ? "border-blue-500 bg-blue-50 border-solid"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleFileChange}
          accept="image/*"
          multiple
        />
        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            {uploading ? (
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            ) : (
              <Upload className="w-8 h-8 text-blue-500" />
            )}
          </div>
          <p className="text-lg font-medium text-gray-700 mb-2">
            {uploading ? "Laddar upp..." : "Dra och släpp filer här"}
          </p>
          <p className="text-gray-500 mb-4">eller klicka för att bläddra</p>
          <p className="text-sm text-gray-400">Stöder: JPG, PNG, GIF, WebP</p>
        </label>
      </div>

      {/* Meddelande */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
          notification.type === 'success'
            ? 'bg-green-50 text-green-800 border border-green-200'
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Bildgalleri */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <div>
            <p className="font-medium text-red-800">Fel vid laddning av bilder</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      ) : (
        <>
          {/* Statistik */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700">
                {images.length} {images.length === 1 ? 'bild' : 'bilder'}
              </span>
            </div>
          </div>

          {/* Bildernas rutnät */}
          {images.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {images.map((image) => (
                <div
                  key={image.name}
                  className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200"
                >
                  <div className="aspect-square relative">
                    <Image
                      src={image.url}
                      alt={image.name}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                      className="object-cover hover:scale-105 transition-transform duration-200"
                      onClick={() => setSelectedImage(image)}
                    />
                  </div>

                  {/* Överlagring vid hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyUrl(image.url);
                      }}
                      className="bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full transition-colors duration-200"
                      title="Kopiera URL"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(image.name);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors duration-200"
                      title="Ta bort"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Bildinformation */}
                  <div className="p-3">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {image.name}
                    </p>
                    {image.size && (
                      <p className="text-xs text-gray-500 mt-1">{image.size}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Inga bilder än</h3>
              <p className="text-gray-500 mb-6">Ladda upp din första bild för att komma igång</p>
              <label htmlFor="file-upload" className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 cursor-pointer">
                <Upload className="w-4 h-4" />
                Ladda upp bilder
              </label>
            </div>
          )}
        </>
      )}

      {/* Bildmodal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-medium">{selectedImage.name}</h3>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <div className="relative aspect-video w-full max-h-[70vh]">
                <Image
                  src={selectedImage.url}
                  alt={selectedImage.name}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => handleCopyUrl(selectedImage.url)}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors duration-200"
                >
                  <Copy className="w-4 h-4" />
                  Kopiera URL
                </button>
                <button
                  onClick={() => {
                    handleDelete(selectedImage.name);
                    setSelectedImage(null);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-colors duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                  Ta bort
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaPage;
