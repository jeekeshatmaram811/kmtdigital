export type Product = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  description: string;
  features: string[];
  image: string;
  category: string;
};

function img(text: string) {
  return `https://placehold.co/600x600/16213a/f5b400?text=${encodeURIComponent(text)}`;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    price: 4999,
    originalPrice: 6999,
    rating: 4.5,
    reviews: 238,
    description:
      "Over-ear wireless headphones with active noise cancellation and deep bass — built for long listening sessions.",
    features: [
      "40-hour battery life",
      "Active noise cancellation",
      "Bluetooth 5.3",
      "Built-in mic for calls",
    ],
    image: img("Headphones"),
    category: "Electronics",
  },
  {
    id: "2",
    name: "Smart Watch Pro",
    price: 7999,
    originalPrice: 9999,
    rating: 4.6,
    reviews: 412,
    description:
      "A vibrant AMOLED smartwatch with round-the-clock health tracking and a week-long battery.",
    features: [
      "AMOLED display",
      "7-day battery",
      "Heart rate & SpO2 monitor",
      "Water resistant IP68",
    ],
    image: img("Smart+Watch"),
    category: "Electronics",
  },
  {
    id: "3",
    name: "True Wireless Earbuds",
    price: 2499,
    originalPrice: 3499,
    rating: 4.3,
    reviews: 589,
    description:
      "Compact true wireless earbuds with punchy sound, touch controls, and a pocket-friendly charging case.",
    features: [
      "Touch controls",
      "24-hour case battery",
      "IPX5 sweat resistant",
      "Low latency gaming mode",
    ],
    image: img("Earbuds"),
    category: "Electronics",
  },
  {
    id: "4",
    name: "Portable Bluetooth Speaker",
    price: 1999,
    originalPrice: 2799,
    rating: 4.4,
    reviews: 176,
    description:
      "A rugged, waterproof speaker with 360° sound — loud enough for the room, small enough for the bag.",
    features: [
      "360° surround sound",
      "12-hour playtime",
      "Waterproof IPX7",
      "TWS pairing",
    ],
    image: img("Speaker"),
    category: "Electronics",
  },
  {
    id: "5",
    name: "UV Protection Sunglasses",
    price: 1299,
    originalPrice: 1799,
    rating: 4.2,
    reviews: 94,
    description:
      "Polarized sunglasses with full UV400 protection in a light, scratch-resistant frame.",
    features: [
      "Polarized UV400 lenses",
      "Lightweight TR90 frame",
      "Scratch-resistant coating",
      "Includes hard case",
    ],
    image: img("Sunglasses"),
    category: "Electronics",
  },
  {
    id: "6",
    name: "20000mAh Power Bank",
    price: 1799,
    originalPrice: 2399,
    rating: 4.5,
    reviews: 321,
    description:
      "High-capacity power bank with fast charging for phones, earbuds, and everything in between.",
    features: [
      "22.5W fast charging",
      "Dual USB-A + USB-C",
      "LED display",
      "Charges 2 devices at once",
    ],
    image: img("Power+Bank"),
    category: "Electronics",
  },
  {
    id: "7",
    name: "Mechanical Gaming Keyboard",
    price: 3499,
    originalPrice: 4499,
    rating: 4.6,
    reviews: 152,
    description:
      "A hot-swappable mechanical keyboard with per-key RGB and a solid aluminum frame.",
    features: [
      "Hot-swappable switches",
      "RGB backlight",
      "Aluminum frame",
      "Detachable USB-C cable",
    ],
    image: img("Keyboard"),
    category: "Electronics",
  },
  {
    id: "8",
    name: "4K Action Camera",
    price: 8999,
    originalPrice: 11999,
    rating: 4.3,
    reviews: 87,
    description:
      "Shoot smooth 4K footage anywhere — waterproof, stabilized, and app-controlled.",
    features: [
      "4K60fps recording",
      "Waterproof up to 10m",
      "Built-in image stabilization",
      "Wi-Fi & app control",
    ],
    image: img("Action+Camera"),
    category: "Electronics",
  },
  {
    id: "9",
    name: "Smart Fitness Band",
    price: 1999,
    originalPrice: 2699,
    rating: 4.1,
    reviews: 263,
    description:
      "A slim fitness band that tracks heart rate, sleep, and activity around the clock.",
    features: [
      "24/7 heart rate tracking",
      "Sleep monitoring",
      "1.1\" color display",
      "10-day battery life",
    ],
    image: img("Fitness+Band"),
    category: "Electronics",
  },
  {
    id: "10",
    name: "Wireless Gaming Mouse",
    price: 1499,
    originalPrice: 1999,
    rating: 4.4,
    reviews: 198,
    description:
      "An ultra-light wireless mouse tuned for gaming, with a precise sensor and long battery life.",
    features: [
      "16000 DPI sensor",
      "70-hour battery",
      "Ultra-lightweight 79g",
      "RGB lighting",
    ],
    image: img("Gaming+Mouse"),
    category: "Electronics",
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
