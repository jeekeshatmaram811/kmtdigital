"use client";

import { useState } from "react";
import Image from "next/image";

export type UploadedImage = { url: string; altText?: string };

export default function ImageUploader({
  images,
  onChange,
}: {
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);

    try {
      const uploaded: UploadedImage[] = [];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? "Upload failed");
        }
        const data = await res.json();
        uploaded.push({ url: data.url });
      }
      onChange([...images, ...uploaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function removeImage(url: string) {
    onChange(images.filter((image) => image.url !== url));
  }

  return (
    <div className="flex flex-col gap-3">
      {images.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {images.map((image) => (
            <div
              key={image.url}
              className="relative h-24 w-24 overflow-hidden rounded-md border border-border bg-surface-2"
            >
              <Image
                src={image.url}
                alt={image.altText ?? ""}
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(image.url)}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-danger text-xs text-white"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <label className="w-fit cursor-pointer rounded-md border border-border px-4 py-2 text-sm text-foreground transition hover:border-accent hover:text-accent">
        {uploading ? "Uploading…" : "+ Add Images"}
        <input
          type="file"
          accept="image/*"
          multiple
          disabled={uploading}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>

      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}
