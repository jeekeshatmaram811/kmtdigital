export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
};

export const products: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    price: 79.99,
    description: "Over-ear wireless headphones with noise cancellation.",
    image: "https://placehold.co/600x600?text=Headphones",
    category: "Electronics",
  },
  {
    id: "2",
    name: "Minimal Watch",
    price: 129.99,
    description: "Slim, minimalist watch with a leather strap.",
    image: "https://placehold.co/600x600?text=Watch",
    category: "Accessories",
  },
  {
    id: "3",
    name: "Canvas Backpack",
    price: 59.99,
    description: "Durable canvas backpack for everyday use.",
    image: "https://placehold.co/600x600?text=Backpack",
    category: "Bags",
  },
  {
    id: "4",
    name: "Ceramic Mug",
    price: 14.99,
    description: "Hand-glazed ceramic mug, dishwasher safe.",
    image: "https://placehold.co/600x600?text=Mug",
    category: "Home",
  },
  {
    id: "5",
    name: "Running Shoes",
    price: 89.99,
    description: "Lightweight running shoes with breathable mesh.",
    image: "https://placehold.co/600x600?text=Shoes",
    category: "Footwear",
  },
  {
    id: "6",
    name: "Sunglasses",
    price: 39.99,
    description: "UV-protective sunglasses with a matte frame.",
    image: "https://placehold.co/600x600?text=Sunglasses",
    category: "Accessories",
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
