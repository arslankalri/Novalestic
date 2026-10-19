import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { ArrowLeft, MessageCircle, Info, ShoppingBag } from 'lucide-react';
import { CollectionError } from './CollectionState';

const WHATSAPP_NUMBER = '923019653550';

interface ProductDetailViewProps {
  productId: string;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({ productId }) => {
  const { products, productsStatus, navigateTo, addToCart, formatPrice } = useShop();

  const product = productId ? products.find((p) => p.id === productId) : undefined;

  const [selectedMetal, setSelectedMetal] = useState(product?.availableMetals?.[0] || product?.metal || '18k Yellow Gold');
  const [selectedRingSize, setSelectedRingSize] = useState('Size 14 (Standard)');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setSelectedMetal(product?.availableMetals?.[0] || product?.metal || '18k Yellow Gold');
    setSelectedRingSize('Size 14 (Standard)');
    setQuantity(1);
  }, [productId, product?.availableMetals, product?.metal]);

  if (!product) {
    const loading = productsStatus === 'loading' && !!productId;
    return (
      <main className="w-full bg-background min-h-screen pt-40 pb-24">
        <div className="shell max-w-2xl">
          {loading ? (
            <div role="status" aria-busy="true" className="text-center py-20">
              <span className="sr-only">Loading this piece…</span>
              <div className="mx-auto aspect-[4/5] max-w-xs rounded-[1.5rem] bg-secondary animate-pulse" aria-hidden="true" />
            </div>
          ) : productsStatus === 'error' ? (
            <CollectionError />
          ) : (
            <div role="status" className="rounded-[1.5rem] border border-border bg-card px-6 py-16 text-center">
              <p className="eyebrow mb-3">Unavailable</p>
              <h1 className="font-serif-luxury text-3xl text-foreground">This piece is not available</h1>
              <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">
                It may have been removed from the collection. Browse the current collection or contact our team for help.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <button onClick={() => navigateTo('shop')} className="rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:opacity-90 transition-opacity">
                  Back to Shop
                </button>
                <button onClick={() => navigateTo('contact')} className="rounded-full border border-foreground/15 px-6 py-3 text-sm font-medium hover:bg-secondary transition-colors">
                  Contact us
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    );
  }

  const ringSizes = [
    'Size 12 (Small)',
    'Size 14 (Standard)',
    'Size 16 (Medium)',
    'Size 18 (Large)',
    'Custom Size / Resizing on Request',
  ];

  const optionBtn = (active: boolean) =>
    `rounded-full px-4 py-2 text-sm border transition-colors ${
      active ? 'border-foreground bg-foreground text-background' : 'border-border bg-card text-foreground hover:border-foreground/40'
    }`;

  return (
    <div className="w-full bg-background min-h-screen pt-32 pb-24">
      <div className="shell">
        <nav aria-label="Breadcrumb" className="mb-10 flex items-center gap-2 text-xs text-muted-foreground">
          <button onClick={() => navigateTo('home')} className="hover:text-foreground flex items-center gap-1 transition-colors rounded-sm">
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Home</span>
          </button>
          <span aria-hidden="true">/</span>
          <button onClick={() => navigateTo('shop')} className="hover:text-foreground transition-colors rounded-sm">Jewellery</button>
          <span aria-hidden="true">/</span>
          <span className="text-foreground font-medium truncate max-w-xs" aria-current="page">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-secondary">
              {product.image ? (
                <img alt={product.title} src={product.image} className="w-full h-full object-cover object-center" />
              ) : (
                <span className="flex w-full h-full items-center justify-center font-serif-luxury text-6xl text-champagne/60" aria-hidden="true">N</span>
              )}
              {product.hallmarkBadge && (
                <span className="absolute top-4 left-4 rounded-full bg-card/90 backdrop-blur px-3.5 py-1.5 text-[11px] tracking-wide text-foreground">
                  {product.hallmarkBadge}
                </span>
              )}
            </div>
          </div>

          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <p className="eyebrow mb-4">Novalestic Collection · {product.category.replace('-', ' ')}</p>
            <h1 className="font-serif-luxury text-4xl sm:text-5xl text-foreground tracking-tight leading-[1.08]">
              {product.title}
            </h1>

            <div className="mt-6 pb-8 border-b border-border">
              <p className="font-serif-luxury text-2xl text-emerald">Contact for price</p>
              <p className="text-sm text-muted-foreground mt-1">Price and availability confirmed directly with our team.</p>
            </div>

            {product.description && (
              <p className="mt-8 text-base text-muted-foreground leading-relaxed">{product.description}</p>
            )}

            {product.availableMetals && product.availableMetals.length > 0 && (
              <fieldset className="mt-8">
                <legend className="text-sm font-medium text-foreground mb-3">
                  Option: <span className="font-normal text-muted-foreground">{selectedMetal}</span>
                </legend>
                <div className="flex flex-wrap gap-2">
                  {product.availableMetals.map((metal) => (
                    <button key={metal} type="button" onClick={() => setSelectedMetal(metal)} aria-pressed={selectedMetal === metal} className={optionBtn(selectedMetal === metal)}>
                      {metal}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            {product.category === 'rings' && (
              <div className="mt-8">
                <label htmlFor="ring-size" className="block text-sm font-medium text-foreground mb-3">Ring size</label>
                <select
                  id="ring-size"
                  value={selectedRingSize}
                  onChange={(e) => setSelectedRingSize(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground"
                >
                  {ringSizes.map((size) => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
                <span className="text-xs text-muted-foreground mt-2 block">Exact sizing is confirmed with our team before an order is finalised.</span>
              </div>
            )}

            <div className="mt-8 flex items-center gap-4">
              <span id="qty-label" className="text-sm font-medium text-foreground">Quantity</span>
              <div role="group" aria-labelledby="qty-label" className="flex items-center rounded-full border border-border bg-card">
                <button type="button" onClick={() => setQuantity((c) => Math.max(1, c - 1))} aria-label="Decrease quantity" disabled={quantity <= 1} className="w-10 h-10 rounded-full text-lg hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed">−</button>
                <span aria-live="polite" className="min-w-8 text-center text-sm font-medium tabular-nums">{quantity}</span>
                <button type="button" onClick={() => setQuantity((c) => Math.min(99, c + 1))} aria-label="Increase quantity" disabled={quantity >= 99} className="w-10 h-10 rounded-full text-lg hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed">+</button>
              </div>
            </div>

            <div className="mt-10 space-y-3">
              <button
                type="button"
                onClick={() => addToCart(product, quantity, selectedMetal, product.category === 'rings' ? selectedRingSize : undefined)}
                disabled={!product.inStock}
                className="w-full rounded-full bg-primary text-primary-foreground py-4 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-45 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" aria-hidden="true" /> {product.inStock ? 'Add to Bag' : 'Currently Unavailable'}
              </button>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent([
                  'Hello NOVALESTIC JEWELLERS, I would like to enquire about:',
                  `Piece: ${product.title}`,
                  `Option: ${selectedMetal}`,
                  ...(product.category === 'rings' ? [`Ring size: ${selectedRingSize}`] : []),
                  `Quantity: ${quantity}`,
                  `Listed price: ${formatPrice(product.pricePKR)}`,
                  'Please confirm current price, availability, materials and specifications.'
                ].join('\\n'))}`}
                target="_blank"
                rel="noreferrer"
                className="w-full rounded-full bg-emerald hover:bg-emerald-hover text-emerald-foreground py-4 text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" /> Enquire on WhatsApp
              </a>
              <button type="button" onClick={() => navigateTo('contact')} className="w-full rounded-full border border-foreground/15 py-3.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors">
                Other Contact Options
              </button>
            </div>

            <div className="mt-8 flex items-start gap-3 text-sm text-muted-foreground">
              <Info className="w-4 h-4 text-champagne shrink-0 mt-0.5" aria-hidden="true" />
              <p className="leading-relaxed">Product details, availability, materials and final pricing are confirmed directly before an order is finalised.</p>
            </div>

            <div className="mt-10 pt-8 border-t border-border">
              <h2 className="eyebrow font-sans text-muted-foreground mb-4">Jewellery Specifications</h2>
              <dl className="text-sm divide-y divide-border">
                <div className="flex justify-between py-3"><dt className="text-muted-foreground">Gold Metal</dt><dd className="text-foreground">{selectedMetal}</dd></div>
                <div className="flex justify-between py-3"><dt className="text-muted-foreground">Gemstone</dt><dd className="text-foreground">{product.carat || 'To be confirmed'}</dd></div>
                <div className="flex justify-between py-3"><dt className="text-muted-foreground">Stone Origin</dt><dd className="text-foreground">{product.origin || 'To be confirmed'}</dd></div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
