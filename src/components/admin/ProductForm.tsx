"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader, { UploadedImage } from "./ImageUploader";

type Category = { id: string; name: string };

type InitialProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice: number | null;
  sku: string | null;
  stock: number;
  isActive: boolean;
  rating: number;
  reviewCount: number;
  features: string[];
  seoTitle: string | null;
  seoDescription: string | null;
  categoryId: string;
  images: { url: string; altText: string | null }[];
};

const inputClass =
  "rounded-md border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted focus:border-accent focus:outline-none";
const labelClass = "text-sm font-medium text-foreground";

export default function ProductForm({
  categories,
  initialProduct,
}: {
  categories: Category[];
  initialProduct?: InitialProduct;
}) {
  const router = useRouter();
  const isEdit = Boolean(initialProduct);

  const [name, setName] = useState(initialProduct?.name ?? "");
  const [slug, setSlug] = useState(initialProduct?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [description, setDescription] = useState(initialProduct?.description ?? "");
  const [price, setPrice] = useState(initialProduct?.price?.toString() ?? "");
  const [originalPrice, setOriginalPrice] = useState(
    initialProduct?.originalPrice?.toString() ?? ""
  );
  const [sku, setSku] = useState(initialProduct?.sku ?? "");
  const [stock, setStock] = useState(initialProduct?.stock?.toString() ?? "0");
  const [isActive, setIsActive] = useState(initialProduct?.isActive ?? true);
  const [rating, setRating] = useState(initialProduct?.rating?.toString() ?? "0");
  const [reviewCount, setReviewCount] = useState(
    initialProduct?.reviewCount?.toString() ?? "0"
  );
  const [categoryId, setCategoryId] = useState(
    initialProduct?.categoryId ?? categories[0]?.id ?? ""
  );
  const [features, setFeatures] = useState<string[]>(
    initialProduct?.features?.length ? initialProduct.features : [""]
  );
  const [images, setImages] = useState<UploadedImage[]>(
    initialProduct?.images.map((img) => ({ url: img.url, altText: img.altText ?? undefined })) ?? []
  );
  const [seoTitle, setSeoTitle] = useState(initialProduct?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(
    initialProduct?.seoDescription ?? ""
  );

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function slugify(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function handleNameChange(value: string) {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  function updateFeature(index: number, value: string) {
    setFeatures((prev) => prev.map((f, i) => (i === index ? value : f)));
  }

  function removeFeature(index: number) {
    setFeatures((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const payload = {
      name,
      slug,
      description,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : null,
      sku: sku || null,
      stock: Number(stock),
      isActive,
      rating: Number(rating),
      reviewCount: Number(reviewCount),
      categoryId,
      features: features.map((f) => f.trim()).filter(Boolean),
      images,
      seoTitle: seoTitle || null,
      seoDescription: seoDescription || null,
    };

    const res = await fetch(
      isEdit ? `/api/admin/products/${initialProduct!.id}` : "/api/admin/products",
      {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong");
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  async function handleDelete() {
    if (!initialProduct) return;
    if (!confirm(`Delete "${initialProduct.name}"? This cannot be undone.`)) return;

    const res = await fetch(`/api/admin/products/${initialProduct.id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      setError("Could not delete product");
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Name</label>
          <input
            required
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Slug</label>
          <input
            required
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>Description</label>
        <textarea
          required
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Price (₹)</label>
          <input
            required
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Original Price (₹)</label>
          <input
            type="number"
            min={0}
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Stock</label>
          <input
            required
            type="number"
            min={0}
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>SKU</label>
          <input value={sku ?? ""} onChange={(e) => setSku(e.target.value)} className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Category</label>
          <select
            required
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className={inputClass}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Rating</label>
          <input
            type="number"
            step="0.1"
            min={0}
            max={5}
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Review Count</label>
          <input
            type="number"
            min={0}
            value={reviewCount}
            onChange={(e) => setReviewCount(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <label className="flex w-fit items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        />
        Active (visible on storefront)
      </label>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>Images</label>
        <ImageUploader images={images} onChange={setImages} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>Features</label>
        {features.map((feature, index) => (
          <div key={index} className="flex gap-2">
            <input
              value={feature}
              onChange={(e) => updateFeature(index, e.target.value)}
              className={`${inputClass} flex-1`}
              placeholder="e.g. 40-hour battery life"
            />
            <button
              type="button"
              onClick={() => removeFeature(index)}
              className="rounded-md border border-border px-3 text-muted hover:text-danger"
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setFeatures((prev) => [...prev, ""])}
          className="w-fit text-sm text-accent hover:underline"
        >
          + Add feature
        </button>
      </div>

      <details className="rounded-md border border-border p-4">
        <summary className="cursor-pointer text-sm font-medium text-foreground">
          Advanced (SEO)
        </summary>
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>SEO Title</label>
            <input
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>SEO Description</label>
            <textarea
              rows={2}
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </details>

      {error && (
        <p className="rounded-md border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}

      <div className="flex items-center justify-between">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-accent px-6 py-3 font-semibold text-accent-foreground transition hover:bg-accent-hover disabled:opacity-50"
        >
          {submitting ? "Saving…" : isEdit ? "Save Changes" : "Create Product"}
        </button>

        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            className="text-sm text-muted hover:text-danger"
          >
            Delete Product
          </button>
        )}
      </div>
    </form>
  );
}
