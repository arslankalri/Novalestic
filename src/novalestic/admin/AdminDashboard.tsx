import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type ProductRow = Database['public']['Tables']['products']['Row'];
type ImageRow = Database['public']['Tables']['product_images']['Row'];
type Category = 'rings' | 'earrings' | 'necklaces' | 'bangles-bracelets';

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'rings', label: 'Rings' },
  { value: 'earrings', label: 'Earrings' },
  { value: 'necklaces', label: 'Necklaces' },
  { value: 'bangles-bracelets', label: 'Bangles & Bracelets' },
];

// Long-lived signed links so photos display on the storefront while the storage bucket is private.
const SIGNED_URL_SECONDS = 60 * 60 * 24 * 365 * 10;

interface FormState {
  id: string | null;
  title: string;
  category: Category;
  sku: string;
  pricingMode: 'fixed' | 'enquiry';
  price: string;
  metal: string;
  availableMetals: string;
  carat: string;
  shortDesc: string;
  description: string;
  inStock: boolean;
  featured: boolean;
}

const EMPTY: FormState = {
  id: null, title: '', category: 'rings', sku: '', pricingMode: 'enquiry', price: '',
  metal: '', availableMetals: '', carat: '', shortDesc: '', description: '', inStock: true, featured: false,
};

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const blank = (s: string) => (s.trim() === '' ? null : s.trim());

export function AdminDashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [images, setImages] = useState<ImageRow[]>([]);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const load = async () => {
    const [{ data: p }, { data: i }] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('product_images').select('*').order('sort_order'),
    ]);
    setProducts(p ?? []);
    setImages(i ?? []);
  };

  useEffect(() => { void load(); }, []);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((f) => ({ ...f, [k]: v }));

  const edit = (p: ProductRow) => {
    setFiles([]);
    setMessage(null);
    setForm({
      id: p.id, title: p.title, category: p.category as Category, sku: p.sku ?? '',
      pricingMode: p.pricing_mode as 'fixed' | 'enquiry', price: p.price_pkr?.toString() ?? '',
      metal: p.metal ?? '', availableMetals: (p.available_metals ?? []).join(', '), carat: p.carat ?? '',
      shortDesc: p.short_desc ?? '', description: p.description ?? '', inStock: p.in_stock, featured: p.is_featured,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const uploadImages = async (productId: string, startOrder: number) => {
    const uploaded: string[] = [];
    for (const [idx, file] of files.entries()) {
      const ext = file.name.split('.').pop() ?? 'jpg';
      const path = `products/${productId}/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage.from('product-images').upload(path, file, { contentType: file.type });
      if (upErr) throw upErr;
      const { data: signed, error: signErr } = await supabase.storage.from('product-images').createSignedUrl(path, SIGNED_URL_SECONDS);
      if (signErr || !signed) throw signErr ?? new Error('Could not create image link');
      const { error: rowErr } = await supabase.from('product_images').insert({
        product_id: productId, image_url: signed.signedUrl, storage_path: path, sort_order: startOrder + idx, alt_text: form.title,
      });
      if (rowErr) throw rowErr;
      uploaded.push(signed.signedUrl);
    }
    return uploaded;
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (form.pricingMode === 'fixed' && (form.price === '' || Number(form.price) < 0 || Number.isNaN(Number(form.price)))) {
      setMessage('Enter a valid PKR price, or choose enquiry-only pricing.');
      return;
    }
    const existingImages = images.filter((i) => i.product_id === form.id);
    if (existingImages.length === 0 && files.length === 0) {
      setMessage('Add at least one product photo before publishing.');
      return;
    }
    setBusy(true);
    try {
      const base = {
        title: form.title.trim(),
        category: form.category,
        sku: blank(form.sku),
        pricing_mode: form.pricingMode,
        price_pkr: form.pricingMode === 'fixed' ? Number(form.price) : null,
        metal: blank(form.metal),
        available_metals: form.availableMetals.split(',').map((s) => s.trim()).filter(Boolean),
        carat: blank(form.carat),
        short_desc: blank(form.shortDesc),
        description: blank(form.description),
        in_stock: form.inStock,
        is_featured: form.featured,
      };

      let id = form.id;
      if (!id) {
        const slug = `${slugify(form.title) || 'product'}-${crypto.randomUUID().slice(0, 6)}`;
        const { data, error } = await supabase.from('products').insert({ ...base, slug, is_published: false }).select('id').single();
        if (error) throw error;
        id = data.id;
      } else {
        const { error } = await supabase.from('products').update(base).eq('id', id);
        if (error) throw error;
      }

      const nextOrder = existingImages.reduce((m, i) => Math.max(m, i.sort_order + 1), 0);
      const uploaded = await uploadImages(id, nextOrder);
      const primary = existingImages[0]?.image_url ?? uploaded[0];

      // Saving publishes immediately.
      const { error: pubErr } = await supabase.from('products')
        .update({ primary_image_url: primary ?? null, is_published: true }).eq('id', id);
      if (pubErr) throw pubErr;

      setForm(EMPTY);
      setFiles([]);
      setMessage('Saved and published.');
      await load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Save failed.');
    } finally {
      setBusy(false);
    }
  };

  const togglePublish = async (p: ProductRow) => {
    const { error } = await supabase.from('products').update({ is_published: !p.is_published }).eq('id', p.id);
    setMessage(error ? error.message : p.is_published ? 'Product unpublished.' : 'Product published.');
    await load();
  };

  const removeImage = async (img: ImageRow) => {
    if (img.storage_path) await supabase.storage.from('product-images').remove([img.storage_path]);
    await supabase.from('product_images').delete().eq('id', img.id);
    const remaining = images.filter((i) => i.product_id === img.product_id && i.id !== img.id);
    const product = products.find((p) => p.id === img.product_id);
    if (product?.primary_image_url === img.image_url) {
      const next = remaining[0]?.image_url ?? null;
      await supabase.from('products').update(next ? { primary_image_url: next } : { primary_image_url: null, is_published: false }).eq('id', img.product_id);
    }
    await load();
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: '/admin/login', replace: true });
  };

  const formImages = images.filter((i) => i.product_id === form.id);
  const input = 'mt-1 w-full border border-[#d0c4c3] px-3 py-2 bg-white text-sm';

  return (
    <main className="min-h-screen bg-[#fbf9f4] text-[#1b1c19]">
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#e4e2dd] bg-white">
        <h1 className="serif-luxury text-xl">Novalestic Catalogue Admin</h1>
        <div className="flex gap-4 text-sm">
          <a href="/" className="text-[#9E7B32] underline">View storefront</a>
          <button onClick={signOut} className="text-[#4d4544] underline">Sign out</button>
        </div>
      </header>
      <nav className="flex gap-2 overflow-x-auto border-b border-[#e4e2dd] bg-white px-6 py-3 text-sm">
        <a href="/admin/overview" className="whitespace-nowrap underline">Business overview</a>
        <a href="/admin/orders" className="whitespace-nowrap underline">Orders</a>
        <a href="/admin/enquiries" className="whitespace-nowrap underline">Enquiries</a>
        <a href="/admin/customers" className="whitespace-nowrap underline">Customers</a>
        <a href="/admin/inventory" className="whitespace-nowrap underline">Inventory</a>
        <a href="/admin/reports" className="whitespace-nowrap underline">Reports</a>
      </nav>

      <div className="max-w-6xl mx-auto p-6 grid gap-8 lg:grid-cols-[420px_1fr]">
        <form onSubmit={save} className="bg-white border border-[#e4e2dd] p-6 space-y-4 self-start">
          <div className="flex items-center justify-between">
            <h2 className="serif-luxury text-lg">{form.id ? 'Edit product' : 'Add product'}</h2>
            {form.id && <button type="button" onClick={() => { setForm(EMPTY); setFiles([]); }} className="text-xs underline">New instead</button>}
          </div>
          <label className="block text-sm">Title *<input required value={form.title} onChange={(e) => set('title', e.target.value)} className={input} /></label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm">Category *
              <select value={form.category} onChange={(e) => set('category', e.target.value as Category)} className={input}>
                {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </label>
            <label className="block text-sm">SKU<input value={form.sku} onChange={(e) => set('sku', e.target.value)} className={input} /></label>
          </div>
          <fieldset className="text-sm space-y-2">
            <legend>Pricing *</legend>
            <label className="mr-4"><input type="radio" checked={form.pricingMode === 'enquiry'} onChange={() => set('pricingMode', 'enquiry')} /> Price on enquiry</label>
            <label><input type="radio" checked={form.pricingMode === 'fixed'} onChange={() => set('pricingMode', 'fixed')} /> Fixed price (PKR)</label>
            {form.pricingMode === 'fixed' && (
              <input type="number" min="0" step="1" placeholder="e.g. 250000" value={form.price} onChange={(e) => set('price', e.target.value)} className={input} />
            )}
          </fieldset>
          <label className="block text-sm">Metal<input placeholder="e.g. 18k yellow gold" value={form.metal} onChange={(e) => set('metal', e.target.value)} className={input} /></label>
          <label className="block text-sm">Available metals (comma separated)<input value={form.availableMetals} onChange={(e) => set('availableMetals', e.target.value)} className={input} /></label>
          <label className="block text-sm">Carat / purity<input value={form.carat} onChange={(e) => set('carat', e.target.value)} className={input} /></label>
          <label className="block text-sm">Short description<input value={form.shortDesc} onChange={(e) => set('shortDesc', e.target.value)} className={input} /></label>
          <label className="block text-sm">Full description<textarea rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} className={input} /></label>
          <div className="flex gap-6 text-sm">
            <label><input type="checkbox" checked={form.inStock} onChange={(e) => set('inStock', e.target.checked)} /> In stock</label>
            <label><input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} /> Featured</label>
          </div>
          {formImages.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formImages.map((img) => (
                <div key={img.id} className="relative">
                  <img src={img.image_url} alt={img.alt_text ?? ''} className="w-16 h-16 object-cover border" />
                  <button type="button" onClick={() => removeImage(img)} aria-label="Remove photo"
                    className="absolute -top-2 -right-2 bg-white border rounded-full w-5 h-5 text-xs">×</button>
                </div>
              ))}
            </div>
          )}
          <label className="block text-sm">Photos (JPEG, PNG or WebP, up to 10 MB each)
            <input type="file" multiple accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setFiles(Array.from(e.target.files ?? []))} className="mt-1 block text-sm" />
          </label>
          {message && <p role="status" className="text-sm text-[#9E7B32]">{message}</p>}
          <button type="submit" disabled={busy} className="w-full bg-[#002118] text-[#DFC27F] py-2.5 text-sm tracking-widest uppercase disabled:opacity-60">
            {busy ? 'Saving…' : 'Save & publish'}
          </button>
        </form>

        <section>
          <h2 className="serif-luxury text-lg mb-3">Products ({products.length})</h2>
          {products.length === 0 ? (
            <p className="text-sm text-[#7f7575]">No products yet. Add your first piece using the form.</p>
          ) : (
            <ul className="space-y-3">
              {products.map((p) => (
                <li key={p.id} className="bg-white border border-[#e4e2dd] p-3 flex items-center gap-3">
                  {p.primary_image_url ? <img src={p.primary_image_url} alt="" className="w-14 h-14 object-cover" /> : <div className="w-14 h-14 bg-[#f0eee9]" />}
                  <div className="flex-1 min-w-0 text-sm">
                    <p className="font-semibold truncate">{p.title}</p>
                    <p className="text-[#7f7575]">
                      {CATEGORIES.find((c) => c.value === p.category)?.label} · {p.sku || 'No SKU'} ·{' '}
                      {p.pricing_mode === 'fixed' && p.price_pkr !== null ? `Rs. ${Number(p.price_pkr).toLocaleString('en-PK')}` : 'Price on enquiry'}
                    </p>
                    <p className="text-xs">
                      <span className={p.is_published ? 'text-emerald-700' : 'text-[#7f7575]'}>{p.is_published ? 'Published' : 'Unpublished'}</span>
                      {p.is_featured && ' · Featured'}{!p.in_stock && ' · Out of stock'}
                    </p>
                  </div>
                  <button onClick={() => edit(p)} className="text-sm underline">Edit</button>
                  <button onClick={() => togglePublish(p)} className="text-sm underline">{p.is_published ? 'Unpublish' : 'Publish'}</button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
