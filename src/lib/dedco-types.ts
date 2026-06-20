// ============================================================
// DEDCO — Types
// ============================================================

export type Product = {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  artisanId: number;
  material: string;
  colors: string[];
  rating: number;
  reviews: number;
  stock: number;
  badge?: string;
  images: string[];
  desc: string;
  tags: string[];
  dimensions?: string;
};

export type Artisan = {
  id: number;
  name: string;
  specialty: string;
  city: string;
  avatar: string;
  rating: number;
  reviews: number;
  level: "N1" | "N2" | "N3" | "N4";
  verified: boolean;
  experience: string;
  bio: string;
  portfolio: string[];
  trust: number;
};

export type Designer = {
  id: number;
  name: string;
  specialty: string;
  city: string;
  avatar: string;
  rating: number;
  reviews: number;
  hourlyRate: number;
  projects: number;
  bio: string;
  style: string;
  cover: string;
};

export type Scene = {
  id: number;
  slug: string;
  title: string;
  style: string;
  room: string;
  image: string;
  hotspots: { x: number; y: number; productId: number }[];
  tags: string[];
  saves: number;
  designerId: number;
};

export type Category = {
  slug: string;
  name: string;
  count: number;
  icon: string;
};

export type Magazine = {
  id: number;
  title: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  featured: boolean;
  excerpt: string;
};

export type Route =
  | { name: "home" }
  | { name: "inspirations" }
  | { name: "marketplace" }
  | { name: "designers" }
  | { name: "magazine" }
  | { name: "product"; id: number }
  | { name: "scene"; slug: string }
  | { name: "artisan"; id: number }
  | { name: "designer"; id: number }
  | { name: "favorites" };

export type CartItem = Product & { qty: number; selectedColor?: string };
