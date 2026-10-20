import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowUpRight,
  CircleAlert,
  Eye,
  FileText,
  Gem,
  LayoutDashboard,
  LogOut,
  Package,
  Plus,
  Search,
  RefreshCw,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CatalogueProductList } from "./CatalogueProductList";
import { CatalogueEditor } from "./CatalogueEditor";
import {
  EMPTY,
  canPublish,
  catalogueCounts,
  filterProducts,
  validateProduct,
  type FormState,
  type ImageRow,
  type ProductFilter,
  type ProductRow,
} from "./catalogue";

const SIGNED_URL_SECONDS = 60 * 60 * 24 * 365 * 10;
const PRODUCT_COLUMNS =
  "id,title,slug,sku,category,price_pkr,pricing_mode,hallmark_badge,metal,available_metals,carat,origin,cut,clarity,dimensions,tag,short_desc,description,primary_image_url,stock_quantity,in_stock,is_published,is_featured,created_at,updated_at,published_at";
const FILTERS: { value: ProductFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "published", label: "Published" },
  { value: "drafts", label: "Drafts" },
  { value: "outOfStock", label: "Out of stock" },
];
const blank = (value: string) => value.trim() || null;

export function AdminDashboard() {
  const navigate = useNavigate();
  const [section, setSection] = useState<"overview" | "products" | "editor">("overview");
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [images, setImages] = useState<ImageRow[]>([]);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [filter, setFilter] = useState<ProductFilter>("all");
  const [search, setSearch] = useState("");
  const uploadCompleted = useRef(new Set<File>());
  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [p, i] = await Promise.all([
        supabase.from("products").select(PRODUCT_COLUMNS).order("created_at", { ascending: false }),
        supabase
          .from("product_images")
          .select("id,product_id,image_url,storage_path,alt_text,sort_order,created_at")
          .order("sort_order"),
      ]);
      if (p.error) throw p.error;
      if (i.error) throw i.error;
      setProducts(p.data ?? []);
      setImages(i.data ?? []);
    } catch (error) {
      setLoadError(
        error instanceof Error ? error.message : "Unable to load your catalogue. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void load();
  }, [load]);
  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));
  const notify = (text: string, error = false) => {
    setMessage(text);
    setIsError(error);
  };
  const reset = () => {
    setForm(EMPTY);
    setFiles([]);
    uploadCompleted.current.clear();
  };
  const openNew = () => {
    reset();
    setMessage(null);
    setSection("editor");
  };
  const edit = (p: ProductRow) => {
    reset();
    setMessage(null);
    setForm({
      id: p.id,
      title: p.title,
      category: p.category,
      sku: p.sku ?? "",
      pricingMode: p.pricing_mode === "fixed" ? "fixed" : "enquiry",
      price: p.price_pkr?.toString() ?? "",
      metal: p.metal ?? "",
      availableMetals: p.available_metals.join(", "),
      carat: p.carat ?? "",
      shortDesc: p.short_desc ?? "",
      description: p.description ?? "",
      featured: p.is_featured,
    });
    setSection("editor");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const review = (value: ProductFilter) => {
    setFilter(value);
    setSearch("");
    setSection("products");
  };
  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (busy) return;
    const existingImages = images.filter((i) => i.product_id === form.id);
    const existingProduct = products.find((p) => p.id === form.id);
    const validation = validateProduct(
      form,
      Boolean(existingImages.length || existingProduct?.primary_image_url || files.length),
    );
    if (validation) {
      notify(validation, true);
      return;
    }
    if (
      files.some(
        (file) =>
          !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
          file.size > 10 * 1024 * 1024,
      )
    ) {
      notify("Choose JPEG, PNG or WebP photos no larger than 10 MB each.", true);
      return;
    }
    setBusy(true);
    setMessage(null);
    try {
      const base = {
        title: form.title.trim(),
        category: form.category,
        sku: blank(form.sku),
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
      };
      let id = form.id;
      if (!id) {
        const slug = `${
          form.title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "") || "product"
        }-${crypto.randomUUID().slice(0, 6)}`;
        const { data, error } = await supabase
          .from("products")
          .insert({ ...base, slug, is_published: false })
          .select("id")
          .single();
        if (error) throw error;
        id = data.id;
        setForm((f) => ({ ...f, id }));
      } else {
        const { error } = await supabase.from("products").update(base).eq("id", id);
        if (error) throw error;
      }
      let primary = existingProduct?.primary_image_url ?? existingImages[0]?.image_url ?? null;
      const nextOrder = existingImages.reduce(
        (max, image) => Math.max(max, image.sort_order + 1),
        0,
      );
      for (const [index, file] of files.entries()) {
        if (uploadCompleted.current.has(file)) continue;
        const extension =
          file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
        const path = `products/${id}/${crypto.randomUUID()}.${extension}`;
        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(path, file, { contentType: file.type });
        if (uploadError) throw uploadError;
        const { data: signed, error: signError } = await supabase.storage
          .from("product-images")
          .createSignedUrl(path, SIGNED_URL_SECONDS);
        if (signError || !signed) throw signError ?? new Error("Could not create image link.");
        const { data: image, error: imageError } = await supabase
          .from("product_images")
          .insert({
            product_id: id,
            image_url: signed.signedUrl,
            storage_path: path,
            sort_order: nextOrder + index,
            alt_text: form.title.trim(),
          })
          .select("id,product_id,image_url,storage_path,alt_text,sort_order,created_at")
          .single();
        if (imageError) throw imageError;
        uploadCompleted.current.add(file);
        setFiles((current) => current.filter((selected) => selected !== file));
        setImages((current) => [...current, image]);
        primary ??= signed.signedUrl;
      }
      const { error } = await supabase
        .from("products")
        .update({ primary_image_url: primary, is_published: true })
        .eq("id", id);
      if (error) throw error;
      reset();
      setSection("products");
      setFilter("all");
      setSearch("");
      notify("Saved and published.");
      await load();
    } catch (error) {
      notify(
        error instanceof Error
          ? error.message
          : "Save failed. Your changes remain in the editor; please try again.",
        true,
      );
    } finally {
      setBusy(false);
    }
  };
  const togglePublish = async (product: ProductRow) => {
    if (busy) return;
    if (!product.is_published && !canPublish(product, images)) {
      notify("Add a photo and valid pricing in the editor before publishing.", true);
      edit(product);
      notify("Add a photo and valid pricing before publishing.", true);
      return;
    }
    setBusy(true);
    try {
      const primary =
        product.primary_image_url ??
        images.find((image) => image.product_id === product.id)?.image_url;
      const { error } = await supabase
        .from("products")
        .update({
          is_published: !product.is_published,
          ...(!product.is_published && primary ? { primary_image_url: primary } : {}),
        })
        .eq("id", product.id);
      if (error) throw error;
      notify(product.is_published ? "Product unpublished." : "Product published.");
      await load();
    } catch (error) {
      notify(error instanceof Error ? error.message : "Could not update publishing status.", true);
    } finally {
      setBusy(false);
    }
  };
  const removeImage = async (image: ImageRow) => {
    if (
      busy ||
      !window.confirm(
        "Remove this photo? Removing the final cover photo will unpublish the product.",
      )
    )
      return;
    setBusy(true);
    try {
      const remaining = images.filter(
        (i) => i.product_id === image.product_id && i.id !== image.id,
      );
      const product = products.find((p) => p.id === image.product_id);
      if (product?.primary_image_url === image.image_url || remaining.length === 0) {
        const next = remaining[0]?.image_url;
        const { error } = await supabase
          .from("products")
          .update(
            next ? { primary_image_url: next } : { primary_image_url: null, is_published: false },
          )
          .eq("id", image.product_id);
        if (error) throw error;
      }
      const { error } = await supabase.from("product_images").delete().eq("id", image.id);
      if (error) throw error;
      if (image.storage_path) {
        const { error: storageError } = await supabase.storage
          .from("product-images")
          .remove([image.storage_path]);
        if (storageError) {
          notify(
            "Photo removed from the catalogue, but the stored file could not be removed.",
            true,
          );
          await load();
          return;
        }
      }
      notify("Photo removed.");
      await load();
    } catch (error) {
      notify(error instanceof Error ? error.message : "Could not remove photo.", true);
      await load();
    } finally {
      setBusy(false);
    }
  };
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      notify("Could not sign out. Please try again.", true);
      return;
    }
    void navigate({ to: "/admin/login", replace: true });
  };
  const counts = catalogueCounts(products);
  const filtered = filterProducts(products, filter, search);
  const listProps = {
    busy,
    edit,
    togglePublish: (p: ProductRow) => {
      void togglePublish(p);
    },
  };
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <Gem className="size-8 text-champagne" />
            <div>
              <p className="font-serif text-xl">Novalestic Jewellers</p>
              <p className="mt-1 text-xs text-muted-foreground">Catalogue administration</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="ghost" size="sm">
              <a href="/">
                Storefront
                <ArrowUpRight />
              </a>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={busy}
              onClick={() => {
                void signOut();
              }}
            >
              <LogOut />
              Sign out
            </Button>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-7 px-5 py-6 sm:px-8 sm:py-8 lg:grid-cols-[210px_minmax(0,1fr)]">
        <aside>
          <nav aria-label="Catalogue sections" className="flex gap-2 lg:flex-col">
            {(
              [
                { value: "overview", label: "Overview", icon: LayoutDashboard },
                { value: "products", label: "Products", icon: Package },
                { value: "editor", label: form.id ? "Edit product" : "Add product", icon: Plus },
              ] as const
            ).map((item) => (
              <Button
                key={item.value}
                disabled={busy}
                variant="ghost"
                aria-current={section === item.value ? "page" : undefined}
                className={`h-11 flex-1 px-3 lg:justify-start ${section === item.value ? "bg-emerald text-emerald-foreground hover:bg-emerald-hover hover:text-emerald-foreground" : "text-muted-foreground"}`}
                onClick={() => {
                  setSection(item.value);
                  setMessage(null);
                }}
              >
                <item.icon />
                <span>{item.label}</span>
              </Button>
            ))}
          </nav>
          <div className="mt-7 hidden border-t border-border pt-5 lg:block">
            <p className="mb-3 text-xs font-semibold text-champagne">Store operations</p>
            <nav aria-label="Store operations" className="grid gap-1 text-sm text-muted-foreground">
              {["overview", "orders", "enquiries", "customers", "inventory", "reports"].map(
                (path) => (
                  <a
                    key={path}
                    href={`/admin/${path}`}
                    className="rounded-md px-3 py-2 capitalize hover:bg-accent hover:text-foreground"
                  >
                    {path === "overview" ? "Business overview" : path}
                  </a>
                ),
              )}
            </nav>
          </div>
          <details className="mt-4 lg:hidden">
            <summary className="cursor-pointer text-sm text-muted-foreground">
              Store operations
            </summary>
            <nav className="flex flex-wrap gap-4 pt-3 text-sm" aria-label="Store operations">
              {["overview", "orders", "enquiries", "customers", "inventory", "reports"].map(
                (path) => (
                  <a key={path} href={`/admin/${path}`} className="capitalize underline">
                    {path === "overview" ? "Business overview" : path}
                  </a>
                ),
              )}
            </nav>
          </details>
        </aside>
        <div className="min-w-0">
          {message && (
            <div
              role={isError ? "alert" : "status"}
              className={`mb-5 rounded-md border px-4 py-3 text-sm ${isError ? "border-destructive/30 bg-destructive/5 text-destructive" : "border-emerald/20 bg-emerald/5 text-emerald"}`}
            >
              {message}
            </div>
          )}
          {loading ? (
            <div role="status" className="py-20 text-center text-muted-foreground">
              <RefreshCw className="mx-auto mb-3 size-5 animate-spin motion-reduce:animate-none" />
              Loading catalogue…
            </div>
          ) : loadError ? (
            <div role="alert" className="py-16 text-center">
              <CircleAlert className="mx-auto mb-4 size-8 text-destructive" />
              <h2 className="text-2xl">Catalogue unavailable</h2>
              <p className="mx-auto my-4 max-w-md text-sm text-muted-foreground">{loadError}</p>
              <Button
                variant="outline"
                onClick={() => {
                  void load();
                }}
              >
                <RefreshCw />
                Try again
              </Button>
            </div>
          ) : section === "editor" ? (
            <div className="rounded-lg border border-border bg-card p-5 sm:p-8">
              <CatalogueEditor
                form={form}
                set={set}
                files={files}
                setFiles={setFiles}
                images={images.filter((i) => i.product_id === form.id)}
                busy={busy}
                save={save}
                removeImage={(image) => {
                  void removeImage(image);
                }}
                cancel={() => {
                  reset();
                  setSection("products");
                }}
              />
            </div>
          ) : (
            <>
              <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase text-champagne">
                    Your collection
                  </p>
                  <h1 className="text-3xl">
                    {section === "overview" ? "Catalogue overview" : "Products"}
                  </h1>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {section === "overview"
                      ? "A snapshot of your jewellery collection."
                      : `${products.length} pieces in your catalogue`}
                  </p>
                </div>
                <Button
                  disabled={busy}
                  onClick={openNew}
                  className="h-11 bg-emerald text-emerald-foreground hover:bg-emerald-hover"
                >
                  <Plus />
                  Add product
                </Button>
              </div>
              {section === "overview" ? (
                <>
                  <div className="mb-8 grid grid-cols-2 gap-3 xl:grid-cols-4">
                    {[
                      { label: "Total products", value: "all", icon: Gem },
                      { label: "Published", value: "published", icon: Eye },
                      { label: "Drafts", value: "drafts", icon: FileText },
                      { label: "Out of stock", value: "outOfStock", icon: Package },
                    ].map((item) => (
                      <div key={item.value} className="rounded-lg border border-border bg-card p-5">
                        <item.icon className="mb-4 size-5 text-champagne" />
                        <p className="text-3xl font-medium tabular-nums">
                          {counts[item.value as ProductFilter]}
                        </p>
                        <p className="mt-2 text-xs text-muted-foreground">{item.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mb-8 flex flex-wrap items-center gap-3">
                    <Button variant="outline" disabled={busy} onClick={() => review("drafts")}>
                      <FileText />
                      Review drafts ({counts.drafts})
                    </Button>
                    <Button variant="outline" disabled={busy} onClick={() => review("outOfStock")}>
                      <Package />
                      Review out of stock ({counts.outOfStock})
                    </Button>
                  </div>
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <h2 className="text-xl">Recent products</h2>
                    <Button variant="ghost" disabled={busy} onClick={() => review("all")}>
                      View all
                      <ArrowUpRight />
                    </Button>
                  </div>
                  {products.length ? (
                    <div className="rounded-lg border border-border bg-card p-5 sm:p-6">
                      <CatalogueProductList products={products.slice(0, 5)} {...listProps} />
                    </div>
                  ) : (
                    <div className="border-y border-border py-14 text-center">
                      <Gem className="mx-auto mb-4 size-9 text-champagne" />
                      <h2 className="text-2xl">Your collection starts here</h2>
                      <p className="my-3 text-sm text-muted-foreground">
                        No products in the catalogue yet.
                      </p>
                      <Button variant="outline" onClick={openNew}>
                        <Plus />
                        Add your first product
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="relative mb-5 max-w-lg">
                    <Search className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" />
                    <Input
                      aria-label="Search products"
                      placeholder="Search by name, SKU or category"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="h-10 bg-card pl-10"
                    />
                  </div>
                  <div
                    className="mb-6 flex flex-wrap gap-2"
                    role="group"
                    aria-label="Filter products"
                  >
                    {FILTERS.map((item) => (
                      <Button
                        key={item.value}
                        variant="outline"
                        aria-pressed={filter === item.value}
                        onClick={() => setFilter(item.value)}
                        className={
                          filter === item.value
                            ? "border-champagne bg-accent text-accent-foreground"
                            : "bg-card"
                        }
                      >
                        {item.label}
                        <span className="text-xs tabular-nums text-muted-foreground">
                          {counts[item.value]}
                        </span>
                      </Button>
                    ))}
                  </div>
                  {filtered.length ? (
                    <div className="rounded-lg border border-border bg-card p-5 sm:p-6">
                      <CatalogueProductList products={filtered} {...listProps} />
                    </div>
                  ) : (
                    <div className="border-y border-border py-14 text-center">
                      <Search className="mx-auto mb-4 size-7 text-muted-foreground" />
                      <h2 className="text-xl">
                        {products.length ? "No matching products" : "No products yet"}
                      </h2>
                      <p className="my-3 text-sm text-muted-foreground">
                        {products.length
                          ? "Try another search or filter."
                          : "Add the first piece to your collection."}
                      </p>
                      {products.length ? (
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSearch("");
                            setFilter("all");
                          }}
                        >
                          Clear filters
                        </Button>
                      ) : (
                        <Button variant="outline" onClick={openNew}>
                          <Plus />
                          Add product
                        </Button>
                      )}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
