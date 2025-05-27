"use client";
import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import axios from "axios";

interface ImageData {
  id: string;
  prompt: string;
  imageData: string;
}

export function ImageGallery() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const url = import.meta.env.VITE_IMG_URL;

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        if (!url) {
          throw new Error(
            "Image URL is not defined in the environment variables."
          );
        }
        const response = await axios.get(url);

        if (!response.data) {
          throw new Error(
            `Failed to fetch images: ${response.status} ${response.statusText}`
          );
        }
        setImages(response.data);
      } catch (err) {
        console.error("Error fetching images:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch images");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const handleDownload = (image: ImageData) => {
    // link element
    const link = document.createElement("a");
    const isBase64 =
      image.imageData.startsWith("/9j") || image.imageData.startsWith("iVBOR");
    const imageUrl = isBase64
      ? `data:image/jpeg;base64,${image.imageData}`
      : `http://localhost:4000${image.imageData}`;

    link.href = imageUrl;
    link.download = `ai-image-${image.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-80 px-5 md:px-10 items-center">
      {loading
        ? // skeletons
          Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="bg-[#171717] rounded-lg overflow-hidden shadow-lg"
            >
              <div className="h-64 bg-gray-700 animate-pulse"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-700 rounded animate-pulse w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-700 rounded animate-pulse w-1/2"></div>
              </div>
              <div className="p-4 pt-0">
                <div className="h-10 bg-gray-700 rounded animate-pulse w-full"></div>
              </div>
            </div>
          ))
        : //  images
          images.map((image) => (
            <div
              key={image.id}
              className="bg-[#171717] rounded-lg overflow-hidden shadow-lg"
            >
              <div className="relative h-64 bg-gray-900">
                {/* If img is base64 */}
                {image.imageData.startsWith("/9j") ||
                image.imageData.startsWith("iVBOR") ? (
                  <img
                    src={`data:image/jpeg;base64,${image.imageData}`}
                    alt={image.prompt}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={`http://localhost:4000${image.imageData}`}
                    alt={image.prompt}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-300">{image.prompt}</p>
              </div>
              <div className="p-4 pt-0">
                <button
                  onClick={() => handleDownload(image)}
                  className="w-full flex items-center justify-center px-4 py-2 bg-[#000000] hover:bg-[#00000054] cursor-pointer text-white rounded transition-colors"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Image
                </button>
              </div>
            </div>
          ))}

      {!loading && images.length === 0 && (
        <div className="col-span-full text-center py-12">
          <p className="text-gray-400">No images found. Try again later.</p>
        </div>
      )}
    </div>
  );
}
