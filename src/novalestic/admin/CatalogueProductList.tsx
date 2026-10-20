import { ImageIcon, Pencil, Eye, EyeOff, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CATEGORIES, priceLabel, type ProductRow } from "./catalogue";

export function CatalogueProductList({
  products,
  busy,
  edit,
  togglePublish,
}: {
  products: ProductRow[];
  busy: boolean;
  edit: (p: ProductRow) => void;
  togglePublish: (p: ProductRow) => void;
}) {
  return (
    <ul className="divide-y divide-border" aria-label="Products">
      {products.map((p) => (
        <li key={p.id} className="flex flex-wrap items-center gap-4 py-5 first:pt-0 last:pb-0">
          <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
            {p.primary_image_url ? (
              <img src={p.primary_image_url} alt={p.title} className="size-full object-cover" />
            ) : (
              <ImageIcon className="size-6 text-muted-foreground" />
            )}
          </div>
          <div className="min-w-0 flex-1 basis-40">
            <p className="break-words text-sm font-semibold">{p.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {CATEGORIES.find((c) => c.value === p.category)?.label ?? p.category}
              {p.sku && ` · ${p.sku}`}
            </p>
            <p className="mt-1 text-sm">{priceLabel(p)}</p>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <span
                className={`rounded-full px-2.5 py-1 ${p.is_published ? "bg-emerald/10 text-emerald" : "bg-accent text-accent-foreground"}`}
              >
                {p.is_published ? "Published" : "Draft"}
              </span>
              {!p.in_stock && (
                <span className="rounded-full bg-muted px-2.5 py-1 text-muted-foreground">
                  Out of stock
                </span>
              )}
              {p.is_featured && (
                <span className="inline-flex items-center gap-1 text-champagne">
                  <Star className="size-3" /> Featured
                </span>
              )}
            </div>
          </div>
          <div className="flex w-full gap-2 pl-20 sm:w-auto sm:pl-0">
            <Button
              variant="outline"
              size="sm"
              disabled={busy}
              onClick={() => edit(p)}
              aria-label={`Edit ${p.title}`}
            >
              <Pencil />
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={busy}
              onClick={() => togglePublish(p)}
              aria-label={`${p.is_published ? "Unpublish" : "Publish"} ${p.title}`}
            >
              {p.is_published ? <EyeOff /> : <Eye />}
              {p.is_published ? "Unpublish" : "Publish"}
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
