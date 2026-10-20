import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { adminDb as supabase } from "./adminDatabase";
import type { Database } from "./adminDatabase";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];
type ImageRow = Database["public"]["Tables"]["product_images"]["Row"];
type Category = "rings" | "earrings" | "necklaces" | "bangles-bracelets";

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "rings", label: "Rings" },
  { value: "earrings", label: "Earrings" },
  { value: "necklaces", label: "Necklaces" },
  { value: "bangles-bracelets", label: "Bangles & Bracelets" },
];

interface FormState {
  id: string | null;
  title: string;
  category: Category;
  pricingMode: "fixed" | "enquiry";
  price: string;
  metal: string;
  availableMetals: string;
  carat: string;
  shortDesc: string;
  description: string;
  featured: boolean;
  inStock: boolean;
}

const EMPTY: FormState = {
  id: null,
  title: "",
  category: "rings",
  pricingMode: "enquiry",
  price: "",
  metal: "",
  availableMetals: "",
  carat: "",
  shortDesc: "",
  description: "",
  featured: false,
  inStock: true,
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
const blank = (s: string) => (s.trim() === "" ? null : s.trim());

export function AdminDashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [images, setImages] = useState<ImageRow[]>([]);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [productSearch, setProductSearch] = useState("");

  const load = async () => {
    const [
      { data: p, error: productsError },
      { data: i, error: imagesError },
    ] = await Promise.all([
      supabase.from("products").select("*").order("created_at", { ascending: false }),
      supabase.from("product_images").select("*").order("sort_order"),
    ]);

    if (productsError) {
      setLoadError(`Could not load products: ${productsError.message}`);
      return;
    }

    setLoadError(null);
    setProducts(p ?? []);
    setImages(i ?? []);

    if (imagesError) {
      setMessage(`Product photos could not be loaded: ${imagesError.message}`);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const edit = (p: ProductRow) => {
    setFiles([]);
    setMessage(null);
    setForm({
      id: p.id,
      title: p.title,
      category: p.category as Category,
      pricingMode: p.pricing_mode as "fixed" | "enquiry",
      price: p.price_pkr?.toString() ?? "",
      metal: p.metal ?? "",
      availableMetals: (p.available_metals ?? []).join(", "),
      carat: p.carat ?? "",
      shortDesc: p.short_desc ?? "",
      description: p.description ?? "",
      featured: p.is_featured,
      inStock: p.in_stock,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const uploadImages = async (productId: string, startOrder: number) => {
    const uploaded: string[] = [];
    for (const [idx, file] of files.entries()) {
      const extensionByType: Record<string, string> = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
      };
      const ext = extensionByType[file.type];
      if (!ext) throw new Error("Product photos must be JPEG, PNG or WebP images.");
      const path = `products/${productId}/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("product-images")
        .upload(path, file, { contentType: file.type });
      if (upErr) throw upErr;
      const { data: publicImage } = supabase.storage.from("product-images").getPublicUrl(path);
      const imageUrl = publicImage.publicUrl;
      if (!imageUrl) throw new Error("Could not create product image URL");
      const { error: rowErr } = await supabase.from("product_images").insert({
        product_id: productId,
        image_url: imageUrl,
        storage_path: path,
        sort_order: startOrder + idx,
        alt_text: form.title,
      });
      if (rowErr) throw rowErr;
      uploaded.push(imageUrl);
    }
    return uploaded;
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (
      form.pricingMode === "fixed" &&
      (form.price === "" || !Number.isFinite(Number(form.price)) || Number(form.price) < 0)
    ) {
      setMessage("Enter a valid PKR price, or choose enquiry-only pricing.");
      return;
    }
    const invalidPhoto = files.find(
      (file) =>
        !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
        file.size > 10 * 1024 * 1024,
    );
    if (invalidPhoto) {
      setMessage("Each product photo must be JPEG, PNG or WebP and 10 MB or smaller.");
      return;
    }

    const existingImages = images.filter((i) => i.product_id === form.id);
    if (existingImages.length === 0 && files.length === 0) {
      setMessage("Add at least one product photo before saving.");
      return;
    }
    setBusy(true);
    try {
      const base = {
        title: form.title.trim(),
        category: form.category,
        pricing_mode: form.pricingMode,
        price_pkr: form.pricingMode === "fixed" ? Number(form.price) : null,
        metal: blank(form.metal),
        available_metals: form.availableMetals
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        carat: blank(form.carat),
        short_desc: blank(form.shortDesc),
        description: blank(form.description),
        is_featured: form.featured,
        in_stock: form.inStock,
      };

      let id = form.id;
      if (!id) {
        const slug = `${slugify(form.title) || "product"}-${crypto.randomUUID().slice(0, 6)}`;
        const { data, error } = await supabase
          .from("products")
          .insert({ ...base, slug, is_published: false })
          .select("id")
          .single();
        if (error) throw error;
        id = data.id;
      } else {
        const { error } = await supabase.from("products").update(base).eq("id", id);
        if (error) throw error;
      }

      const nextOrder = existingImages.reduce((m, i) => Math.max(m, i.sort_order + 1), 0);
      const uploaded = await uploadImages(id, nextOrder);
      const primary = existingImages[0]?.image_url ?? uploaded[0];

      const { error: imageError } = await supabase
        .from("products")
        .update({ primary_image_url: primary ?? null })
        .eq("id", id);
      if (imageError) throw imageError;

      const wasPublished = products.some((product) => product.id === id && product.is_published);
      setForm(EMPTY);
      setFiles([]);
      setMessage(
        wasPublished
          ? "Product saved."
          : "Product saved as a draft. Publish it from the product list when ready.",
      );
      await load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setBusy(false);
    }
  };

  const togglePublish = async (p: ProductRow) => {
    if (!p.is_published && !p.primary_image_url) {
      setMessage("Add a product photo before publishing this item.");
      return;
    }
    const { error } = await supabase
      .from("products")
      .update({ is_published: !p.is_published })
      .eq("id", p.id);
    setMessage(
      error ? error.message : p.is_published ? "Product moved to drafts." : "Product published.",
    );
    await load();
  };

  const removeImage = async (img: ImageRow) => {
    if (img.storage_path) await supabase.storage.from("product-images").remove([img.storage_path]);
    await supabase.from("product_images").delete().eq("id", img.id);
    const remaining = images.filter((i) => i.product_id === img.product_id && i.id !== img.id);
    const product = products.find((p) => p.id === img.product_id);
    if (product?.primary_image_url === img.image_url) {
      const next = remaining[0]?.image_url ?? null;
      await supabase
        .from("products")
        .update(
          next ? { primary_image_url: next } : { primary_image_url: null, is_published: false },
        )
        .eq("id", img.product_id);
    }
    await load();
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login", replace: true });
  };

  const formImages = images.filter((i) => i.product_id === form.id);
  const visibleProducts = products.filter((product) =>
    `${product.title} ${product.category}`
      .toLowerCase()
      .includes(productSearch.trim().toLowerCase()),
  );
  const input = "mt-1 w-full border border-[#d0c4c3] px-3 py-2 bg-white text-sm";

  return (
    <main className="min-h-screen bg-[#fbf9f4] text-[#1b1c19]">
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#e4e2dd] bg-white">
        <h1 className="serif-luxury text-xl">Novalestic Catalogue Admin</h1>
        <div className="flex gap-4 text-sm">
          <a href="/" className="text-[#9E7B32] underline">
            View storefront
          </a>
          <button onClick={signOut} className="text-[#4d4544] underline">
            Sign out
          </button>
        </div>
      </header>
      <div className="border-b border-[#e4e2dd] bg-white px-6 py-3 text-sm text-[#7f7575]">
        Add a product, upload its photo, set the price and publish it when it is ready.
      </div>
      <div className="max-w-6xl mx-auto px-6 pt-6 grid grid-cols-3 gap-3">
        <div className="border border-[#e4e2dd] bg-white p-4">
          <p className="text-xs text-[#7f7575]">Total products</p>
          <p className="text-2xl font-semibold">{products.length}</p>
        </div>
        <div className="border border-[#e4e2dd] bg-white p-4">
          <p className="text-xs text-[#7f7575]">Published</p>
          <p className="text-2xl font-semibold">{products.filter((p) => p.is_published).length}</p>
        </div>
        <div className="border border-[#e4e2dd] bg-white p-4">
          <p className="text-xs text-[#7f7575]">Drafts</p>
          <p className="text-2xl font-semibold">{products.filter((p) => !p.is_published).length}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 grid gap-8 lg:grid-cols-[420px_1fr]">
        <form onSubmit={save} className="bg-white border border-[#e4e2dd] p-6 space-y-4 self-start">
          <div className="flex items-center justify-between">
            <h2 className="serif-luxury text-lg">{form.id ? "Edit product" : "Add product"}</h2>
            {form.id && (
              <button
                type="button"
                onClick={() => {
                  setForm(EMPTY);
                  setFiles([]);
                }}
                className="text-xs underline"
              >
                New instead
              </button>
            )}
          </div>
          <label className="block text-sm">
            Title *
            <input
              required
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              className={input}
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm">
              Category *
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value as Category)}
                className={input}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <fieldset className="text-sm space-y-2">
            <legend>Pricing *</legend>
            <label className="mr-4">
              <input
                type="radio"
                checked={form.pricingMode === "enquiry"}
                onChange={() => set("pricingMode", "enquiry")}
              />{" "}
              Price on enquiry
            </label>
            <label>
              <input
                type="radio"
                checked={form.pricingMode === "fixed"}
                onChange={() => set("pricingMode", "fixed")}
              />{" "}
              Fixed price (PKR)
            </label>
            {form.pricingMode === "fixed" && (
              <input
                type="number"
                min="0"
                step="1"
                placeholder="e.g. 250000"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                className={input}
              />
            )}
          </fieldset>
          <label className="block text-sm">
            Metal
            <input
              placeholder="e.g. 18k yellow gold"
              value={form.metal}
              onChange={(e) => set("metal", e.target.value)}
              className={input}
            />
          </label>
          <label className="block text-sm">
            Available metals (comma separated)
            <input
              value={form.availableMetals}
              onChange={(e) => set("availableMetals", e.target.value)}
              className={input}
            />
          </label>
          <label className="block text-sm">
            Carat / purity
            <input
              value={form.carat}
              onChange={(e) => set("carat", e.target.value)}
              className={input}
            />
          </label>
          <label className="block text-sm">
            Short description
            <input
              value={form.shortDesc}
              onChange={(e) => set("shortDesc", e.target.value)}
              className={input}
            />
          </label>
          <label className="block text-sm">
            Full description
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className={input}
            />
          </label>
          <div className="flex flex-wrap items-center gap-5 text-sm">
            <label>
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => set("featured", e.target.checked)}
              />{" "}
              Feature this item
            </label>
            <label>
              <input
                type="checkbox"
                checked={form.inStock}
                onChange={(e) => set("inStock", e.target.checked)}
              />{" "}
              In stock
            </label>
          </div>
          {formImages.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formImages.map((img) => (
                <div key={img.id} className="relative">
                  <img
                    src={img.image_url}
                    alt={img.alt_text ?? ""}
                    className="w-16 h-16 object-cover border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(img)}
                    aria-label="Remove photo"
                    className="absolute -top-2 -right-2 bg-white border rounded-full w-5 h-5 text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          <label className="block text-sm">
            Photos (JPEG, PNG or WebP, up to 10 MB each)
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
              className="mt-1 block text-sm"
            />
          </label>
          <p className="text-xs text-[#7f7575]">
            New products are saved as drafts. Publish them from the product list when ready.
          </p>
          {message && (
            <p role="status" className="text-sm text-[#9E7B32]">
              {message}
            </p>
          )}
          <button
            type="submit"
            disabled={busy}
            className="w-full bg-[#002118] text-[#DFC27F] py-2.5 text-sm tracking-widest uppercase disabled:opacity-60"
          >
            {busy ? "Saving…" : "Save product"}
          </button>
        </form>

        <section>
          <div className="flex items-center justify-between gap-3 mb-3">
            <h2 className="serif-luxury text-lg">Products ({products.length})</h2>
            <button
              type="button"
              onClick={() => {
                setForm(EMPTY);
                setFiles([]);
                setMessage(null);
              }}
              className="text-sm underline"
            >
              Add new
            </button>
          </div>
          <label className="block text-sm mb-4">
            <span className="sr-only">Search products</span>
            <input
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              placeholder="Search products…"
              className={input}
            />
          </label>
          {loadError ? (
            <p className="text-sm text-red-700" role="alert">
              {loadError}
            </p>
          ) : products.length === 0 ? (
            <p className="text-sm text-[#7f7575]">
              No products yet. Add your first piece using the form.
            </p>
          ) : visibleProducts.length === 0 ? (
            <p className="text-sm text-[#7f7575]">No matching products.</p>
          ) : (
            <ul className="space-y-3">
              {visibleProducts.map((p) => (
                <li
                  key={p.id}
                  className="bg-white border border-[#e4e2dd] p-3 flex items-center gap-3"
                >
                  {p.primary_image_url ? (
                    <img src={p.primary_image_url} alt="" className="w-14 h-14 object-cover" />
                  ) : (
                    <div className="w-14 h-14 bg-[#f0eee9]" />
                  )}
                  <div className="flex-1 min-w-0 text-sm">
                    <p className="font-semibold truncate">{p.title}</p>
                    <p className="text-[#7f7575]">
                      {CATEGORIES.find((c) => c.value === p.category)?.label} ·{" "}
                      {p.pricing_mode === "fixed" && p.price_pkr !== null
                        ? `Rs. ${Number(p.price_pkr).toLocaleString("en-PK")}`
                        : "Price on enquiry"}
                    </p>
                    <p className="text-xs">
                      <span className={p.is_published ? "text-emerald-700" : "text-[#7f7575]"}>
                        {p.is_published ? "Published" : "Unpublished"}
                      </span>
                      {p.is_featured && " · Featured"}
                      {!p.in_stock && " · Out of stock"}
                    </p>
                  </div>
                  <button onClick={() => edit(p)} className="text-sm underline">
                    Edit
                  </button>
                  <button onClick={() => togglePublish(p)} className="text-sm underline">
                    {p.is_published ? "Unpublish" : "Publish"}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
