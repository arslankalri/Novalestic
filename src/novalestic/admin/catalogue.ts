import type { Database } from "@/integrations/supabase/types";

export type ProductRow = Database["public"]["Tables"]["products"]["Row"];
export type ImageRow = Database["public"]["Tables"]["product_images"]["Row"];
export type ProductFilter = "all" | "published" | "drafts" | "outOfStock";
export const CATEGORIES = [
  { value: "rings", label: "Rings" },
  { value: "earrings", label: "Earrings" },
  { value: "necklaces", label: "Necklaces" },
  { value: "bangles-bracelets", label: "Bangles & Bracelets" },
] as const;
export interface FormState {
  id: string | null;
  title: string;
  category: string;
  sku: string;
  pricingMode: "fixed" | "enquiry";
  price: string;
  metal: string;
  availableMetals: string;
  carat: string;
  shortDesc: string;
  description: string;
  featured: boolean;
}
export const EMPTY: FormState = {
  id: null, title: "", category: "rings", sku: "", pricingMode: "enquiry",
  price: "", metal: "", availableMetals: "", carat: "", shortDesc: "",
  description: "", featured: false,
};
export function matchesFilter(p: ProductRow, filter: ProductFilter) {
  if (filter === "published") return p.is_published;
  if (filter === "drafts") return !p.is_published;
  if (filter === "outOfStock") return !p.in_stock;
  return true;
}
export function catalogueCounts(products: ProductRow[]) {
  return { all: products.length, published: products.filter(p => p.is_published).length,
    drafts: products.filter(p => !p.is_published).length,
    outOfStock: products.filter(p => !p.in_stock).length };
}
export function filterProducts(products: ProductRow[], filter: ProductFilter, search: string) {
  const query = search.trim().toLowerCase();
  return products.filter(p => matchesFilter(p, filter) &&
    `${p.title} ${p.sku ?? ""} ${CATEGORIES.find(c => c.value === p.category)?.label ?? p.category}`.toLowerCase().includes(query));
}
export function validateProduct(form: FormState, hasImage: boolean): string | null {
  if (!form.title.trim()) return "Enter a product title.";
  if (!CATEGORIES.some(c => c.value === form.category)) return "Choose a supported category.";
  if (form.pricingMode === "fixed" &&
    (!form.price.trim() || !Number.isFinite(Number(form.price)) || Number(form.price) < 0))
    return "Enter a valid PKR price, or choose enquiry-only pricing.";
  if (!hasImage) return "Add at least one product photo before publishing.";
  return null;
}
export function canPublish(p: ProductRow, images: ImageRow[]) {
  return validateProduct({ ...EMPTY, title: p.title, category: p.category,
    pricingMode: p.pricing_mode === "fixed" ? "fixed" : "enquiry",
    price: p.price_pkr?.toString() ?? "" }, Boolean(p.primary_image_url || images.some(i => i.product_id === p.id))) === null;
}
export const priceLabel = (p: ProductRow) => p.pricing_mode === "fixed" && p.price_pkr !== null
  ? `Rs. ${Number(p.price_pkr).toLocaleString("en-PK")}` : "Price on enquiry";