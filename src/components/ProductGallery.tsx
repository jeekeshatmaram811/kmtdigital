"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({
  images,
  name,
  discount,
}: {
  images: { url: string; altText: string | null }[];
  name: string;
  discount: number;
}) {
  const gallery = images.length > 0 ? images : [{ url: "https://placehold.co/600x600?text=No+Image", altText: null }];
  const [selected, setSelected] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-surface-2">
        {discount > 0 && (
          <span className="absolute left-3 top-3 z-10 rounded bg-accent px-2 py-1 text-xs font-bold text-accent-foreground">
            {discount}% OFF
          </span>
        )}
        <Image
          src={gallery[selected].url}
          alt={gallery[selected].altText ?? name}
          fill
          className="object-cover"
          unoptimized
        />
      </div>
      {gallery.length > 1 && (
        <div className="flex gap-2">
          {gallery.map((image, index) => (
            <button
              key={image.url}
              onClick={() => setSelected(index)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 ${
                index === selected ? "border-accent" : "border-border"
              }`}
            >
              <Image
                src={image.url}
                alt={image.altText ?? name}
                fill
                className="object-cover"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
