import { supabase } from "@/integrations/supabase/client";
import type { Product } from "../types";

/**
 * Loads only published products (the database also enforces this for visitors).
 * Throws on a failed request so callers can tell "could not load" apart from "empty".
 */
export async function fetchPublishedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(
      "id,title,category,pricing_mode,price_pkr,hallmark_badge,metal,available_metals,carat,origin,cut,clarity,dimensions,tag,short_desc,description,primary_image_url,in_stock,is_featured,is_published,created_at",
    )
    .eq("is_published", true)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message || "Unable to load the collection.");
  if (!data) return [];
  return data.map((r) => {
    const availableMetals = r.available_metals ?? [];
    return {
    id: r.id,
    title: r.title,
    category: r.category as Product["category"],
    // 0 means "price on enquiry" in the storefront.
    pricePKR: r.pricing_mode === "fixed" && r.price_pkr !== null ? Number(r.price_pkr) : 0,
    ...(r.hallmark_badge ? { hallmarkBadge: r.hallmark_badge } : {}),
    metal: r.metal ?? "",
    availableMetals: availableMetals.length > 0 ? availableMetals : r.metal ? [r.metal] : [],
    carat: r.carat ?? "",
    origin: r.origin ?? "",
    cut: r.cut ?? "",
    clarity: r.clarity ?? "",
    dimensions: r.dimensions ?? "",
    tag: r.tag ?? "",
    shortDesc: r.short_desc ?? "",
    description: r.description ?? "",
    image: r.primary_image_url ?? "",
    inStock: r.in_stock,
    featured: r.is_featured,
  };
  });
}
