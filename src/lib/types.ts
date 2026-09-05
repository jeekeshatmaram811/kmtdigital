export type CartProduct = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
};

export type StoreProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number | null;
  rating: number;
  reviewCount: number;
  features: string[];
  stock: number;
  category: { name: string; slug: string };
  images: { url: string; altText: string | null }[];
};
