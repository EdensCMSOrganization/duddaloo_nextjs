// app/admin/components/MediaLibraryModal.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import PortalModal from "./PortalModal"; // Import the portal wrapper

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

  // Fetch images when modal opens
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

  // Early return if not open - PortalModal will handle the rest
  if (!isOpen) {
    return null;
  }

  return (
    <PortalModal
      isOpen={isOpen}
      onClose={onClose}
      closeOnBackdropClick={true}
    >
      {/* Modal content wrapped in PortalModal */}
      <div className="fixed inset-0 bg-black bg-opacity-70 z-10000 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-6xl max-h-[85vh] flex flex-col animate-fadeIn">
          {/* Modal header */}
          <div className="flex justify-between items-center mb-4 pb-4 border-b">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Media Library</h2>
              <p className="text-gray-600 text-sm mt-1">
                Select an image to use in your product
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 text-2xl bg-gray-100 hover:bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
              aria-label="Close modal"
            >
              &times;
            </button>
          </div>

          {/* Loading state */}
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading media library...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Images grid */}
              <div className="flex-1 overflow-y-auto mb-4">
                {images.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No images found in library</p>
                    <button className="mt-4 text-blue-600 hover:text-blue-800">
                      Upload new images
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-1">
                    {images.map((image) => (
                      <div
                        key={image.name}
                        className="relative group cursor-pointer transition-transform hover:scale-[1.02]"
                        onClick={() => {
                          onSelectImage(image.url);
                          onClose(); // Close modal after selection
                        }}
                      >
                        {/* Image container */}
                        <div className="aspect-square relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                          <Image
                            src={image.url}
                            alt={image.name}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                            className="object-cover group-hover:opacity-90 transition-opacity"
                            priority={false}
                          />
                          
                          {/* Selection overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                            <p className="text-white text-sm font-medium truncate">
                              {image.name}
                            </p>
                            <span className="text-white/80 text-xs mt-1">
                              Click to select
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal footer */}
              <div className="pt-4 border-t flex justify-between items-center">
                <p className="text-gray-600 text-sm">
                  {images.length} images available
                </p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </PortalModal>
  );
}