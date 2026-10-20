import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { adminDb as supabase } from "./adminDatabase";
import type { Database } from "./adminDatabase";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];
type AdminProductRow = Pick<
  ProductRow,
  | "id"
  | "title"
  | "category"
  | "pricing_mode"
  | "price_pkr"
  | "metal"
  | "available_metals"
  | "carat"
  | "short_desc"
  | "description"
  | "primary_image_url"
  | "in_stock"
  | "is_featured"
  | "is_published"
  | "created_at"
>;
type ImageRow = Database["public"]["Tables"]["product_images"]["Row"];
type AdminImageRow = Pick<
  ImageRow,
  "id" | "product_id" | "image_url" | "storage_path" | "alt_text" | "sort_order"
>;
type Category = "rings" | "earrings" | "necklaces" | "bangles-bracelets";
type AdminSection = "overview" | "products" | "editor";
type ProductFilter = "all" | "published" | "drafts" | "out-of-stock";

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

const inputClass =
  "mt-1 w-full rounded-md border border-[#d9d0c3] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#9e7b32] focus:ring-2 focus:ring-[#9e7b32]/15";
const cardClass = "rounded-xl border border-[#e8e0d4] bg-white p-5 shadow-sm";

export function AdminDashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<AdminProductRow[]>([]);
  const [images, setImages] = useState<AdminImageRow[]>([]);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [productSearch, setProductSearch] = useState("");
  const [section, setSection] = useState<AdminSection>("overview");
  const [productFilter, setProductFilter] = useState<ProductFilter>("all");

  const load = async () => {
    const [{ data: p, error: productsError }, { data: i, error: imagesError }] = await Promise.all([
      supabase
        .from("products")
        .select(
          "id,title,category,pricing_mode,price_pkr,metal,available_metals,carat,short_desc,description,primary_image_url,in_stock,is_featured,is_published,created_at",
        )
        .order("created_at", { ascending: false }),
      supabase
        .from("product_images")
        .select("id,product_id,image_url,storage_path,alt_text,sort_order")
        .order("sort_order"),
    ]);

    if (productsError) {
      setLoadError("Could not load products: " + productsError.message);
      return;
    }

    setLoadError(null);
    setProducts(p ?? []);
    setImages(i ?? []);

    if (imagesError) {
      setMessage("Product photos could not be loaded: " + imagesError.message);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const startNewProduct = () => {
    setForm(EMPTY);
    setFiles([]);
    setMessage(null);
    setSection("editor");
  };

  const edit = (p: AdminProductRow) => {
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
    setSection("editor");
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
      const path = "products/" + productId + "/" + crypto.randomUUID() + "." + ext;
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
        const slug = (slugify(form.title) || "product") + "-" + crypto.randomUUID().slice(0, 6);
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
      setSection("products");
      await load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setBusy(false);
    }
  };

  const togglePublish = async (p: AdminProductRow) => {
    setMessage(null);
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

  const removeImage = async (img: AdminImageRow) => {
    if (img.storage_path) await supabase.storage.from("product-images").remove([img.storage_path]);
    const { error } = await supabase.from("product_images").delete().eq("id", img.id);
    if (error) {
      setMessage("Could not remove photo: " + error.message);
      return;
    }
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
  const productCounts = {
    all: products.length,
    published: products.filter((p) => p.is_published).length,
    drafts: products.filter((p) => !p.is_published).length,
    "out-of-stock": products.filter((p) => !p.in_stock).length,
  };
  const filters: { value: ProductFilter; label: string; count: number }[] = [
    { value: "all", label: "All products", count: productCounts.all },
    { value: "published", label: "Published", count: productCounts.published },
    { value: "drafts", label: "Drafts", count: productCounts.drafts },
    { value: "out-of-stock", label: "Out of stock", count: productCounts["out-of-stock"] },
  ];
  const visibleProducts = products.filter((product) => {
    const matchesSearch = (product.title + " " + product.category)
      .toLowerCase()
      .includes(productSearch.trim().toLowerCase());
    const matchesFilter =
      productFilter === "all" ||
      (productFilter === "published" && product.is_published) ||
      (productFilter === "drafts" && !product.is_published) ||
      (productFilter === "out-of-stock" && !product.in_stock);
    return matchesSearch && matchesFilter;
  });

  return (
    <main className="min-h-screen bg-[#fbf9f4] text-[#1b1c19]">
      <header className="sticky top-0 z-20 border-b border-[#e8e0d4] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#002118] font-serif text-xl text-[#dfc27f]">
              N
            </div>
            <div className="min-w-0">
              <p className="serif-luxury truncate text-lg leading-tight sm:text-xl">Novalestic</p>
              <p className="text-xs text-[#7f7575]">Catalogue management</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3 text-sm">
            <a
              href="/"
              className="hidden text-[#806225] underline-offset-4 hover:underline sm:inline"
            >
              View storefront
            </a>
            <button onClick={signOut} className="text-[#4d4544] underline-offset-4 hover:underline">
              Sign out
            </button>
          </div>
        </div>
        <nav
          aria-label="Admin sections"
          className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 sm:px-6"
        >
          <button
            type="button"
            onClick={() => {
              setSection("overview");
              setMessage(null);
            }}
            aria-current={section === "overview" ? "page" : undefined}
            className={
              section === "overview"
                ? "border-b-2 border-[#9e7b32] px-4 py-3 text-sm font-semibold text-[#1b1c19]"
                : "border-b-2 border-transparent px-4 py-3 text-sm text-[#7f7575] hover:text-[#1b1c19]"
            }
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => {
              setSection("products");
              setMessage(null);
            }}
            aria-current={section === "products" ? "page" : undefined}
            className={
              section === "products"
                ? "border-b-2 border-[#9e7b32] px-4 py-3 text-sm font-semibold text-[#1b1c19]"
                : "border-b-2 border-transparent px-4 py-3 text-sm text-[#7f7575] hover:text-[#1b1c19]"
            }
          >
            Products
            <span className="ml-2 rounded-full bg-[#f2ede3] px-2 py-0.5 text-xs">
              {products.length}
            </span>
          </button>
          <button
            type="button"
            onClick={startNewProduct}
            aria-current={section === "editor" && !form.id ? "page" : undefined}
            className={
              section === "editor"
                ? "border-b-2 border-[#9e7b32] px-4 py-3 text-sm font-semibold text-[#1b1c19]"
                : "border-b-2 border-transparent px-4 py-3 text-sm text-[#7f7575] hover:text-[#1b1c19]"
            }
          >
            Add product
          </button>
        </nav>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:py-9">
        {section === "overview" && (
          <section className="space-y-7">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9e7b32]">
                  Store management
                </p>
                <h1 className="serif-luxury mt-2 text-3xl sm:text-4xl">Overview</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#7f7575]">
                  Your catalogue at a glance. Add jewellery, review drafts and control what appears
                  in the storefront.
                </p>
              </div>
              <button
                type="button"
                onClick={startNewProduct}
                className="inline-flex items-center justify-center rounded-md bg-[#002118] px-5 py-3 text-sm font-medium text-[#dfc27f] transition hover:bg-[#103b2e]"
              >
                + Add product
              </button>
            </div>

            {loadError && (
              <p
                role="alert"
                className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800"
              >
                {loadError}
              </p>
            )}
            {message && (
              <p
                role="status"
                className="rounded-md border border-[#e8d9b4] bg-[#fff9e9] p-3 text-sm text-[#735721]"
              >
                {message}
              </p>
            )}

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <div className={cardClass}>
                <p className="text-sm text-[#7f7575]">Total products</p>
                <p className="mt-2 text-3xl font-semibold tabular-nums">{productCounts.all}</p>
                <p className="mt-1 text-xs text-[#7f7575]">Across all categories</p>
              </div>
              <div className={cardClass}>
                <p className="text-sm text-[#7f7575]">Published</p>
                <p className="mt-2 text-3xl font-semibold tabular-nums">
                  {productCounts.published}
                </p>
                <p className="mt-1 text-xs text-[#267253]">Visible in the storefront</p>
              </div>
              <div className={cardClass}>
                <p className="text-sm text-[#7f7575]">Drafts</p>
                <p className="mt-2 text-3xl font-semibold tabular-nums">{productCounts.drafts}</p>
                <p className="mt-1 text-xs text-[#7f7575]">Not publicly listed</p>
              </div>
              <div className={cardClass}>
                <p className="text-sm text-[#7f7575]">Out of stock</p>
                <p className="mt-2 text-3xl font-semibold tabular-nums">
                  {productCounts["out-of-stock"]}
                </p>
                <p className="mt-1 text-xs text-[#7f7575]">Marked unavailable</p>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
              <div className={cardClass}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="serif-luxury text-xl">Recent products</h2>
                    <p className="mt-1 text-sm text-[#7f7575]">
                      The latest items added to your catalogue.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSection("products")}
                    className="shrink-0 text-sm text-[#806225] underline underline-offset-4"
                  >
                    View all
                  </button>
                </div>
                {products.length === 0 ? (
                  <div className="mt-6 rounded-lg border border-dashed border-[#d9d0c3] px-4 py-8 text-center">
                    <p className="serif-luxury text-lg">Your catalogue starts here</p>
                    <p className="mt-2 text-sm text-[#7f7575]">
                      Add a product photo and details to create your first draft.
                    </p>
                    <button
                      type="button"
                      onClick={startNewProduct}
                      className="mt-4 text-sm font-semibold text-[#806225] underline underline-offset-4"
                    >
                      Add your first product
                    </button>
                  </div>
                ) : (
                  <ul className="mt-5 divide-y divide-[#eee7dd]">
                    {products.slice(0, 5).map((p) => (
                      <li key={p.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                        {p.primary_image_url ? (
                          <img
                            src={p.primary_image_url}
                            alt=""
                            className="h-14 w-14 shrink-0 rounded-md border border-[#eee7dd] object-cover"
                          />
                        ) : (
                          <div className="h-14 w-14 shrink-0 rounded-md bg-[#f2ede3]" />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold">{p.title}</p>
                          <p className="mt-1 text-xs text-[#7f7575]">
                            {CATEGORIES.find((c) => c.value === p.category)?.label ?? p.category} ·{" "}
                            {p.pricing_mode === "fixed" && p.price_pkr !== null
                              ? "Rs. " + Number(p.price_pkr).toLocaleString("en-PK")
                              : "Price on enquiry"}
                          </p>
                        </div>
                        <span
                          className={
                            p.is_published
                              ? "shrink-0 rounded-full bg-[#e8f4f0] px-2.5 py-1 text-xs text-[#24664f]"
                              : "shrink-0 rounded-full bg-[#f2ede3] px-2.5 py-1 text-xs text-[#6e6254]"
                          }
                        >
                          {p.is_published ? "Published" : "Draft"}
                        </span>
                        <button
                          type="button"
                          onClick={() => edit(p)}
                          className="text-sm text-[#806225] underline underline-offset-4"
                        >
                          Edit
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className={cardClass}>
                <h2 className="serif-luxury text-xl">Quick actions</h2>
                <p className="mt-1 text-sm text-[#7f7575]">
                  Common catalogue tasks, all in one place.
                </p>
                <div className="mt-5 grid gap-3">
                  <button
                    type="button"
                    onClick={startNewProduct}
                    className="flex items-center justify-between rounded-lg border border-[#e8e0d4] p-4 text-left transition hover:border-[#c8ae72] hover:bg-[#fbf9f4]"
                  >
                    <span>
                      <strong className="block text-sm">Add a product</strong>
                      <span className="mt-1 block text-xs text-[#7f7575]">
                        Create a new draft with photos.
                      </span>
                    </span>
                    <span aria-hidden="true" className="text-xl text-[#9e7b32]">
                      +
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProductFilter("drafts");
                      setSection("products");
                      setMessage(null);
                    }}
                    className="flex items-center justify-between rounded-lg border border-[#e8e0d4] p-4 text-left transition hover:border-[#c8ae72] hover:bg-[#fbf9f4]"
                  >
                    <span>
                      <strong className="block text-sm">Review drafts</strong>
                      <span className="mt-1 block text-xs text-[#7f7575]">
                        {productCounts.drafts} product(s) awaiting publication.
                      </span>
                    </span>
                    <span aria-hidden="true" className="text-xl text-[#9e7b32]">
                      ›
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProductFilter("out-of-stock");
                      setSection("products");
                      setMessage(null);
                    }}
                    className="flex items-center justify-between rounded-lg border border-[#e8e0d4] p-4 text-left transition hover:border-[#c8ae72] hover:bg-[#fbf9f4]"
                  >
                    <span>
                      <strong className="block text-sm">Check availability</strong>
                      <span className="mt-1 block text-xs text-[#7f7575]">
                        Review items marked out of stock.
                      </span>
                    </span>
                    <span aria-hidden="true" className="text-xl text-[#9e7b32]">
                      ›
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {section === "products" && (
          <section className="space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9e7b32]">
                  Catalogue
                </p>
                <h1 className="serif-luxury mt-2 text-3xl sm:text-4xl">Products</h1>
                <p className="mt-2 text-sm text-[#7f7575]">
                  Search, edit, publish or unpublish items in your storefront.
                </p>
              </div>
              <button
                type="button"
                onClick={startNewProduct}
                className="inline-flex items-center justify-center rounded-md bg-[#002118] px-5 py-3 text-sm font-medium text-[#dfc27f] transition hover:bg-[#103b2e]"
              >
                + Add product
              </button>
            </div>

            {loadError && (
              <p
                role="alert"
                className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800"
              >
                {loadError}
              </p>
            )}
            {message && (
              <p
                role="status"
                className="rounded-md border border-[#e8d9b4] bg-[#fff9e9] p-3 text-sm text-[#735721]"
              >
                {message}
              </p>
            )}

            <div className="flex flex-wrap gap-2" aria-label="Filter products">
              {filters.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setProductFilter(f.value)}
                  aria-pressed={productFilter === f.value}
                  className={
                    productFilter === f.value
                      ? "rounded-full border border-[#002118] bg-[#002118] px-4 py-2 text-sm font-medium text-white"
                      : "rounded-full border border-[#d9d0c3] bg-white px-4 py-2 text-sm text-[#625b52] transition hover:border-[#9e7b32]"
                  }
                >
                  {f.label}{" "}
                  <span
                    className={
                      productFilter === f.value ? "ml-1 text-[#dfc27f]" : "ml-1 text-[#8c8172]"
                    }
                  >
                    {f.count}
                  </span>
                </button>
              ))}
            </div>

            <div className={cardClass}>
              <label className="block max-w-xl text-sm font-medium">
                Search catalogue
                <input
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search by product name or category…"
                  className={inputClass}
                />
              </label>

              {visibleProducts.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="serif-luxury text-xl">
                    {products.length === 0 ? "No products yet" : "No matching products"}
                  </p>
                  <p className="mt-2 text-sm text-[#7f7575]">
                    {products.length === 0
                      ? "Add your first item to get the catalogue started."
                      : "Try a different search or filter."}
                  </p>
                  {products.length === 0 && (
                    <button
                      type="button"
                      onClick={startNewProduct}
                      className="mt-4 text-sm font-semibold text-[#806225] underline underline-offset-4"
                    >
                      Add product
                    </button>
                  )}
                </div>
              ) : (
                <ul className="mt-5 divide-y divide-[#eee7dd]">
                  {visibleProducts.map((p) => (
                    <li
                      key={p.id}
                      className="flex flex-col gap-3 py-4 first:pt-0 sm:flex-row sm:items-center"
                    >
                      {p.primary_image_url ? (
                        <img
                          src={p.primary_image_url}
                          alt=""
                          className="h-20 w-20 shrink-0 rounded-lg border border-[#eee7dd] object-cover"
                        />
                      ) : (
                        <div className="h-20 w-20 shrink-0 rounded-lg bg-[#f2ede3]" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold">{p.title}</p>
                        <p className="mt-1 text-sm text-[#7f7575]">
                          {CATEGORIES.find((c) => c.value === p.category)?.label ?? p.category} ·{" "}
                          {p.pricing_mode === "fixed" && p.price_pkr !== null
                            ? "Rs. " + Number(p.price_pkr).toLocaleString("en-PK")
                            : "Price on enquiry"}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2 text-xs">
                          <span
                            className={
                              p.is_published
                                ? "rounded-full bg-[#e8f4f0] px-2.5 py-1 text-[#24664f]"
                                : "rounded-full bg-[#f2ede3] px-2.5 py-1 text-[#6e6254]"
                            }
                          >
                            {p.is_published ? "Published" : "Draft"}
                          </span>
                          <span
                            className={
                              p.in_stock
                                ? "rounded-full bg-[#f6f2e8] px-2.5 py-1 text-[#76613b]"
                                : "rounded-full bg-[#fcebea] px-2.5 py-1 text-[#9b3d34]"
                            }
                          >
                            {p.in_stock ? "In stock" : "Out of stock"}
                          </span>
                          {p.is_featured && (
                            <span className="rounded-full bg-[#f2ede3] px-2.5 py-1 text-[#6e6254]">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-3 sm:justify-end">
                        <button
                          type="button"
                          onClick={() => edit(p)}
                          className="text-sm font-medium text-[#806225] underline underline-offset-4"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => void togglePublish(p)}
                          className="text-sm font-medium text-[#4d4544] underline underline-offset-4"
                        >
                          {p.is_published ? "Unpublish" : "Publish"}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}

        {section === "editor" && (
          <section className="mx-auto max-w-4xl space-y-6">
            <div>
              <button
                type="button"
                onClick={() => {
                  setSection("products");
                  setMessage(null);
                }}
                className="text-sm text-[#806225] underline underline-offset-4"
              >
                ← Back to products
              </button>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#9e7b32]">
                Catalogue editor
              </p>
              <h1 className="serif-luxury mt-2 text-3xl sm:text-4xl">
                {form.id ? "Edit product" : "Add product"}
              </h1>
              <p className="mt-2 text-sm leading-6 text-[#7f7575]">
                Complete the product details and add at least one photo. New products stay as drafts
                until you publish them.
              </p>
            </div>

            <form onSubmit={save} className={cardClass + " space-y-6"}>
              <section className="space-y-4">
                <div className="border-b border-[#eee7dd] pb-3">
                  <h2 className="serif-luxury text-xl">Product details</h2>
                  <p className="mt-1 text-xs text-[#7f7575]">
                    The core information shown to customers.
                  </p>
                </div>
                <label className="block text-sm font-medium">
                  Product name *
                  <input
                    required
                    value={form.title}
                    onChange={(e) => set("title", e.target.value)}
                    className={inputClass}
                    placeholder="e.g. Emerald Gold Pendant"
                  />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-medium">
                    Category *
                    <select
                      value={form.category}
                      onChange={(e) => set("category", e.target.value as Category)}
                      className={inputClass}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block text-sm font-medium">
                    Main metal
                    <input
                      placeholder="e.g. 18k yellow gold"
                      value={form.metal}
                      onChange={(e) => set("metal", e.target.value)}
                      className={inputClass}
                    />
                  </label>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-medium">
                    Available metals
                    <input
                      placeholder="Gold, Silver, Rose gold"
                      value={form.availableMetals}
                      onChange={(e) => set("availableMetals", e.target.value)}
                      className={inputClass}
                    />
                    <span className="mt-1 block text-xs font-normal text-[#7f7575]">
                      Separate options with commas.
                    </span>
                  </label>
                  <label className="block text-sm font-medium">
                    Carat / purity
                    <input
                      placeholder="e.g. 18K"
                      value={form.carat}
                      onChange={(e) => set("carat", e.target.value)}
                      className={inputClass}
                    />
                  </label>
                </div>
              </section>

              <section className="space-y-4">
                <div className="border-b border-[#eee7dd] pb-3">
                  <h2 className="serif-luxury text-xl">Pricing</h2>
                  <p className="mt-1 text-xs text-[#7f7575]">
                    Choose whether to show a price or invite customers to enquire.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label
                    className={
                      form.pricingMode === "enquiry"
                        ? "flex cursor-pointer items-start gap-3 rounded-lg border border-[#9e7b32] bg-[#fbf6e8] p-4"
                        : "flex cursor-pointer items-start gap-3 rounded-lg border border-[#e8e0d4] p-4"
                    }
                  >
                    <input
                      type="radio"
                      name="pricing-mode"
                      checked={form.pricingMode === "enquiry"}
                      onChange={() => set("pricingMode", "enquiry")}
                      className="mt-1 accent-[#806225]"
                    />
                    <span>
                      <strong className="block text-sm">Price on enquiry</strong>
                      <span className="mt-1 block text-xs font-normal text-[#7f7575]">
                        Customers contact you for a quote.
                      </span>
                    </span>
                  </label>
                  <label
                    className={
                      form.pricingMode === "fixed"
                        ? "flex cursor-pointer items-start gap-3 rounded-lg border border-[#9e7b32] bg-[#fbf6e8] p-4"
                        : "flex cursor-pointer items-start gap-3 rounded-lg border border-[#e8e0d4] p-4"
                    }
                  >
                    <input
                      type="radio"
                      name="pricing-mode"
                      checked={form.pricingMode === "fixed"}
                      onChange={() => set("pricingMode", "fixed")}
                      className="mt-1 accent-[#806225]"
                    />
                    <span>
                      <strong className="block text-sm">Fixed price</strong>
                      <span className="mt-1 block text-xs font-normal text-[#7f7575]">
                        Show the price in Pakistani rupees.
                      </span>
                    </span>
                  </label>
                </div>
                {form.pricingMode === "fixed" && (
                  <label className="block max-w-sm text-sm font-medium">
                    Price (PKR) *
                    <input
                      type="number"
                      min="0"
                      step="1"
                      required
                      placeholder="e.g. 250000"
                      value={form.price}
                      onChange={(e) => set("price", e.target.value)}
                      className={inputClass}
                    />
                  </label>
                )}
              </section>

              <section className="space-y-4">
                <div className="border-b border-[#eee7dd] pb-3">
                  <h2 className="serif-luxury text-xl">Description</h2>
                  <p className="mt-1 text-xs text-[#7f7575]">
                    Help customers understand the design and materials.
                  </p>
                </div>
                <label className="block text-sm font-medium">
                  Short description
                  <input
                    value={form.shortDesc}
                    onChange={(e) => set("shortDesc", e.target.value)}
                    className={inputClass}
                    placeholder="One sentence about this piece"
                  />
                </label>
                <label className="block text-sm font-medium">
                  Full description
                  <textarea
                    rows={5}
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                    className={inputClass + " resize-y"}
                    placeholder="Describe the style, materials, and details…"
                  />
                </label>
              </section>

              <section className="space-y-4">
                <div className="border-b border-[#eee7dd] pb-3">
                  <h2 className="serif-luxury text-xl">Photos and availability</h2>
                  <p className="mt-1 text-xs text-[#7f7575]">
                    Use clear, well-lit photos. JPEG, PNG or WebP up to 10 MB each.
                  </p>
                </div>
                {formImages.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {formImages.map((img) => (
                      <div key={img.id} className="relative">
                        <img
                          src={img.image_url}
                          alt={img.alt_text ?? ""}
                          className="h-24 w-24 rounded-lg border border-[#e8e0d4] object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => void removeImage(img)}
                          aria-label="Remove photo"
                          className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-[#e8e0d4] bg-white text-sm shadow-sm hover:bg-red-50"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <label className="block text-sm font-medium">
                  {formImages.length > 0 ? "Add more photos" : "Upload product photos *"}
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
                    className="mt-2 block w-full rounded-md border border-dashed border-[#d9d0c3] bg-[#fbf9f4] p-3 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-[#002118] file:px-3 file:py-2 file:text-xs file:font-semibold file:text-[#dfc27f]"
                  />
                  <span className="mt-2 block text-xs font-normal text-[#7f7575]">
                    {files.length > 0
                      ? files.length + " new photo(s) selected."
                      : "At least one photo is required before a product can be saved."}
                  </span>
                </label>
                <div className="flex flex-wrap gap-4 rounded-lg bg-[#fbf9f4] p-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form.inStock}
                      onChange={(e) => set("inStock", e.target.checked)}
                      className="accent-[#806225]"
                    />
                    In stock
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => set("featured", e.target.checked)}
                      className="accent-[#806225]"
                    />
                    Mark as featured
                  </label>
                </div>
              </section>

              {message && (
                <p
                  role="alert"
                  className="rounded-md border border-[#e8d9b4] bg-[#fff9e9] p-3 text-sm text-[#735721]"
                >
                  {message}
                </p>
              )}

              <div className="flex flex-col-reverse justify-between gap-3 border-t border-[#eee7dd] pt-5 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={() => {
                    setForm(EMPTY);
                    setFiles([]);
                    setMessage(null);
                    setSection("products");
                  }}
                  className="rounded-md border border-[#d9d0c3] px-5 py-3 text-sm font-medium transition hover:bg-[#fbf9f4]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  className="rounded-md bg-[#002118] px-6 py-3 text-sm font-semibold text-[#dfc27f] transition hover:bg-[#103b2e] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {busy ? "Saving product…" : form.id ? "Save changes" : "Save as draft"}
                </button>
              </div>
              <p className="text-xs leading-5 text-[#7f7575]">
                Saving does not publish the product. Use the Publish action on the Products page
                when the item is ready for customers.
              </p>
            </form>
          </section>
        )}
      </div>
    </main>
  );
}
