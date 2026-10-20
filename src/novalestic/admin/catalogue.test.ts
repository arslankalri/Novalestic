import { describe, expect, it } from "vitest";
import {
  EMPTY,
  canPublish,
  catalogueCounts,
  filterProducts,
  validateProduct,
  type ProductRow,
} from "./catalogue";

const product = (id: string, published: boolean, inStock: boolean): ProductRow => ({
  id,
  title: `Ring ${id}`,
  category: "rings",
  slug: id,
  sku: null,
  pricing_mode: "fixed",
  price_pkr: 250000,
  primary_image_url: "https://example.test/ring.jpg",
  is_published: published,
  in_stock: inStock,
  available_metals: [],
  carat: null,
  clarity: null,
  created_at: "2026-10-20",
  cut: null,
  description: null,
  dimensions: null,
  hallmark_badge: null,
  is_featured: false,
  metal: null,
  origin: null,
  published_at: null,
  short_desc: null,
  stock_quantity: 0,
  tag: null,
  updated_at: "2026-10-20",
});
describe("Catalogue rules", () => {
  const products = [
    product("one", true, true),
    product("two", false, false),
    product("three", true, false),
  ];
  it("counts total, published, drafts and out of stock independently", () => {
    expect(catalogueCounts(products)).toEqual({ all: 3, published: 2, drafts: 1, outOfStock: 2 });
  });
  it("filters drafts and searches without losing the selected filter", () => {
    expect(filterProducts(products, "drafts", "ring").map((p) => p.id)).toEqual(["two"]);
    expect(filterProducts(products, "outOfStock", "three").map((p) => p.id)).toEqual(["three"]);
  });
  it("requires an image before publishing", () => {
    expect(validateProduct({ ...EMPTY, title: "Ring" }, false)).toBe(
      "Add at least one product photo before publishing.",
    );
  });
  it("requires a finite non-negative fixed PKR price", () => {
    for (const price of ["", " ", "-1", "Infinity", "abc"]) {
      expect(validateProduct({ ...EMPTY, title: "Ring", pricingMode: "fixed", price }, true)).toBe(
        "Enter a valid PKR price, or choose enquiry-only pricing.",
      );
    }
    expect(
      validateProduct({ ...EMPTY, title: "Ring", pricingMode: "fixed", price: "250000" }, true),
    ).toBeNull();
  });
  it("allows enquiry-only pricing without a fixed price", () => {
    expect(
      validateProduct({ ...EMPTY, title: "Ring", pricingMode: "enquiry", price: "" }, true),
    ).toBeNull();
  });
  it("blocks publishing an incomplete draft", () => {
    const draft = product("draft", false, true);
    expect(canPublish({ ...draft, primary_image_url: null }, [])).toBe(false);
    expect(canPublish(draft, [])).toBe(true);
  });
});
