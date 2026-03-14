// src/components/ProductGallery.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Fallback if no images
  const displayImages = images.length > 0 ? images : ['/images/placeholder.jpg'];

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-accent">
        <Image
          src={displayImages[activeIndex]}
          alt={`${productName} - Image ${activeIndex + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`
                relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden transition-all duration-200
                ${activeIndex === index
                  ? 'ring-2 ring-secondary ring-offset-2'
                  : 'opacity-60 hover:opacity-100'
                }
              `}
            >
              <Image
                src={image}
                alt={`${productName} - Miniature ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
