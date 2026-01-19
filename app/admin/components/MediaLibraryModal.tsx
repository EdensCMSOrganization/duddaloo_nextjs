// app/admin/components/MediaLibraryModal.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface MediaImage {
  url: string;
  name: string;
}

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (url: string) => void;
}

export default function MediaLibraryModal({
  isOpen,
  onClose,
  onSelectImage,
}: MediaLibraryModalProps) {
  const [images, setImages] = useState<MediaImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      const fetchImages = async () => {
        setLoading(true);
        try {
          const res = await fetch("/api/media");
          const data = await res.json();
          setImages(data);
        } catch (error) {
          console.error("Failed to fetch media library", error);
        } finally {
          setLoading(false);
        }
      };
      fetchImages();
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-4xl max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Media Library</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">&times;</button>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4 overflow-y-auto">
            {images.map((image) => (
              <div
                key={image.name}
                className="cursor-pointer group relative"
                onClick={() => onSelectImage(image.url)}
              >
                <Image
                  src={image.url}
                  alt={image.name}
                  width={150}
                  height={150}
                  className="object-cover w-full h-full rounded-md"
                />
                 <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition-all">
                   <p className="text-white opacity-0 group-hover:opacity-100">Select</p>
                 </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}