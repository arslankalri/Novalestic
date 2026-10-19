export type CategorySlug = "all" | "rings" | "earrings" | "necklaces" | "bangles-bracelets";

export interface Product {
  id: string;
  title: string;
  category: "rings" | "earrings" | "necklaces" | "bangles-bracelets";
  pricePKR: number;
  hallmarkBadge?: string;
  metal: string;
  availableMetals: string[];
  carat: string;
  origin: string;
  cut: string;
  clarity: string;
  dimensions: string;
  tag: string;
  shortDesc: string;
  description: string;
  image: string;
  inStock: boolean;
  featured: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedMetal: string;
  ringSize?: string | undefined;
}
