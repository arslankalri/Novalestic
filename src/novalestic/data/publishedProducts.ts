import type { Product } from "../types";

/**
 * The previous Supabase catalogue has been retired while the Laravel backend is prepared.
 * Return an empty collection so the storefront uses its existing empty state without
 * querying database tables that have been removed.
 */
export async function fetchPublishedProducts(): Promise<Product[]> {
  return [];
}
