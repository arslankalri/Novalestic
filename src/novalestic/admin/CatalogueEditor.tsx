import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Check, ImagePlus, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIES, type FormState, type ImageRow } from "./catalogue";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="grid gap-2 text-sm font-medium">{label}{children}</label>;
}

export function CatalogueEditor({ form, set, files, setFiles, images, busy, save, removeImage, cancel }: {
  form: FormState;
  set: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  files: File[]; setFiles: (files: File[]) => void; images: ImageRow[]; busy: boolean;
  save: (event: FormEvent) => void; removeImage: (image: ImageRow) => void; cancel: () => void;
}) {
  const [previews, setPreviews] = useState<string[]>([]);
  useEffect(() => {
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach(url => URL.revokeObjectURL(url));
  }, [files]);
  const area = "scroll-mt-8 border-b border-border py-7 first:pt-0 last:border-0";
  return <form onSubmit={save} className="min-w-0">
    <fieldset disabled={busy} className="min-w-0">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div><h2 className="text-2xl">{form.id ? "Edit product" : "Add product"}</h2><p className="mt-1 text-sm text-muted-foreground">{form.id ? form.title : "A new addition to the collection"}</p></div>
        <Button type="button" variant="ghost" onClick={cancel}><X />Cancel</Button>
      </div>
      <nav aria-label="Editor areas" className="mb-7 flex flex-wrap gap-x-5 gap-y-3 border-b border-border pb-5 text-xs text-muted-foreground">
        {["Product details", "Pricing", "Description", "Photos & availability"].map((label, index) => <a key={label} href={`#editor-${index}`} className="inline-flex items-center gap-2 hover:text-foreground"><span className="flex size-5 items-center justify-center rounded-full bg-accent text-champagne">{index + 1}</span>{label}</a>)}
      </nav>
      <section id="editor-0" className={area} aria-labelledby="details-heading">
        <h3 id="details-heading" className="mb-5 text-lg">Product details</h3>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2"><Field label="Product title *"><Input required value={form.title} onChange={e => set("title", e.target.value)} placeholder="Product name" /></Field></div>
          <Field label="Category *"><select className="h-10 w-full rounded-md border border-input bg-card px-3 text-sm" value={form.category} onChange={e => set("category", e.target.value)}>{CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}</select></Field>
          <Field label="SKU"><Input value={form.sku} onChange={e => set("sku", e.target.value)} /></Field>
          <Field label="Metal"><Input placeholder="e.g. 18k yellow gold" value={form.metal} onChange={e => set("metal", e.target.value)} /></Field>
          <Field label="Carat / purity"><Input value={form.carat} onChange={e => set("carat", e.target.value)} /></Field>
          <div className="sm:col-span-2"><Field label="Available metals (comma separated)"><Input value={form.availableMetals} onChange={e => set("availableMetals", e.target.value)} /></Field></div>
        </div>
      </section>
      <section id="editor-1" className={area} aria-labelledby="pricing-heading">
        <h3 id="pricing-heading" className="mb-5 text-lg">Pricing</h3>
        <fieldset className="flex flex-wrap gap-4"><legend className="sr-only">Pricing mode</legend>
          <label className="flex items-center gap-2 rounded-md border border-border px-4 py-3 text-sm"><input type="radio" name="pricingMode" checked={form.pricingMode === "enquiry"} onChange={() => set("pricingMode", "enquiry")} className="accent-emerald" />Price on enquiry</label>
          <label className="flex items-center gap-2 rounded-md border border-border px-4 py-3 text-sm"><input type="radio" name="pricingMode" checked={form.pricingMode === "fixed"} onChange={() => set("pricingMode", "fixed")} className="accent-emerald" />Fixed price (PKR)</label>
        </fieldset>
        {form.pricingMode === "fixed" && <div className="mt-5 max-w-sm"><Field label="Price (PKR) *"><Input required type="number" min="0" step="1" value={form.price} onChange={e => set("price", e.target.value)} placeholder="e.g. 250000" /></Field></div>}
      </section>
      <section id="editor-2" className={area} aria-labelledby="description-heading">
        <h3 id="description-heading" className="mb-5 text-lg">Description</h3>
        <div className="grid gap-5"><Field label="Short description"><Input value={form.shortDesc} onChange={e => set("shortDesc", e.target.value)} /></Field>
          <Field label="Full description"><Textarea rows={5} value={form.description} onChange={e => set("description", e.target.value)} /></Field></div>
      </section>
      <section id="editor-3" className={area} aria-labelledby="photos-heading">
        <h3 id="photos-heading" className="mb-5 text-lg">Photos & availability</h3>
        <div className="mb-5 flex flex-wrap gap-3">
          {images.map((image, index) => <div key={image.id} className="relative w-24">
            <img src={image.image_url} alt={image.alt_text ?? form.title} className="size-24 rounded-md border border-border object-cover" />
            <Button type="button" size="icon" variant="outline" onClick={() => removeImage(image)} aria-label={`Remove photo ${index + 1}`} className="absolute right-1 top-1 size-7 bg-card"><X /></Button>
            {index === 0 && <p className="mt-1 text-xs text-muted-foreground">Cover photo</p>}
          </div>)}
          {files.map((file, index) => <div key={`${file.name}-${index}`} className="relative w-24">
            {previews[index] && <img src={previews[index]} alt={file.name} className="size-24 rounded-md border border-border object-cover" />}
            <Button type="button" size="icon" variant="outline" onClick={() => setFiles(files.filter((_, i) => i !== index))} aria-label={`Remove selected photo ${index + 1}`} className="absolute right-1 top-1 size-7 bg-card"><X /></Button>
            <p className="mt-1 truncate text-xs text-muted-foreground">{file.name}</p>
          </div>)}
        </div>
        <label className="grid cursor-pointer gap-3 rounded-md border border-dashed border-input p-5">
          <span className="flex items-center gap-2 text-sm font-medium"><ImagePlus className="size-5 text-champagne" />Product photos *</span>
          <span className="text-xs text-muted-foreground">JPEG, PNG or WebP · up to 10 MB each</span>
          <input type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={e => { setFiles([...files, ...Array.from(e.target.files ?? [])]); e.target.value = ""; }} className="max-w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-2 file:text-secondary-foreground" />
        </label>
        <label className="mt-6 flex items-center gap-3 text-sm"><input type="checkbox" checked={form.featured} onChange={e => set("featured", e.target.checked)} className="size-4 accent-emerald" />Featured product</label>
        <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground"><Check className="size-4 shrink-0" />Availability is managed through the existing inventory ledger.</p>
      </section>
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
        <p className="text-xs text-muted-foreground">Saving publishes this product immediately.</p>
        <Button type="submit" className="h-11 bg-emerald px-6 text-emerald-foreground hover:bg-emerald-hover"><Save />{busy ? "Saving…" : "Save & publish"}</Button>
      </div>
    </fieldset>
  </form>;
}