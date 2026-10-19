import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { ArrowLeft } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { CollectionEmpty, CollectionError, CollectionLoading } from './CollectionState';

interface CatalogViewProps {
  category: 'all' | 'rings' | 'earrings' | 'necklaces' | 'bangles-bracelets';
}

const selectClass =
  'appearance-none rounded-full border border-border bg-card pl-4 pr-9 py-2 text-sm text-foreground bg-[length:12px] bg-no-repeat bg-[right_0.9rem_center] cursor-pointer';
const chevron =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' fill='none' stroke='%23777' stroke-width='1.5'%3E%3Cpath d='M3 4.5l3 3 3-3'/%3E%3C/svg%3E\")";

export const CatalogView: React.FC<CatalogViewProps> = ({ category }) => {
  const { products, productsStatus, navigateTo } = useShop();

  const [selectedMetal, setSelectedMetal] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  const categoryTitles: Record<string, { title: string; subtitle: string; description: string }> = {
    all: {
      title: 'All Jewellery',
      subtitle: 'The Novalestic Collection',
      description: 'Explore the collection and discover pieces that suit your personal style.',
    },
    rings: {
      title: 'Rings',
      subtitle: 'The Ring Collection',
      description: 'Explore rings for everyday wear, meaningful gifts and special occasions.',
    },
    earrings: {
      title: 'Earrings',
      subtitle: 'The Earring Collection',
      description: 'Explore earrings in a range of silhouettes, from subtle to statement-making.',
    },
    necklaces: {
      title: 'Necklaces & Pendants',
      subtitle: 'The Necklace Collection',
      description: 'Explore necklaces and pendants to complement your own style.',
    },
    'bangles-bracelets': {
      title: 'Bangles & Bracelets',
      subtitle: 'The Bracelet Collection',
      description: 'Discover bracelets and bangles for layering or wearing on their own.',
    },
  };

  const currentInfo = categoryTitles[category] ?? categoryTitles['all']!;

  const categoryProducts = useMemo(
    () => (category === 'all' ? products : products.filter((p) => p.category === category)),
    [category, products],
  );

  const filteredProducts = useMemo(() => {
    let items = categoryProducts;

    if (selectedMetal !== 'all') {
      items = items.filter((p) =>
        [p.metal, ...(p.availableMetals ?? [])].some((metal) =>
          metal.toLowerCase().includes(selectedMetal.toLowerCase())
        )
      );
    }

    if (sortBy === 'price-asc') {
      return [...items].sort((a, b) => a.pricePKR - b.pricePKR);
    }
    if (sortBy === 'price-desc') {
      return [...items].sort((a, b) => b.pricePKR - a.pricePKR);
    }
    return items;
  }, [categoryProducts, selectedMetal, sortBy]);

  const ready = productsStatus === 'ready';

  return (
    <div className="w-full bg-background min-h-screen pt-32 pb-24">
      <div className="shell">
        <nav aria-label="Breadcrumb" className="mb-10 flex items-center gap-2 text-xs text-muted-foreground">
          <button onClick={() => navigateTo('home')} className="hover:text-foreground flex items-center gap-1 transition-colors rounded-sm">
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Home</span>
          </button>
          <span aria-hidden="true">/</span>
          <span className="text-foreground font-medium" aria-current="page">{currentInfo.title}</span>
        </nav>

        <header className="max-w-3xl mb-14">
          <p className="eyebrow mb-4">{currentInfo.subtitle}</p>
          <h1 className="font-serif-luxury text-5xl sm:text-7xl text-foreground tracking-tight leading-[1.02]">
            {currentInfo.title}
          </h1>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
            {currentInfo.description}
          </p>
          <p className="mt-6 text-xs tracking-[0.14em] uppercase text-champagne">
            Prices and specifications available on enquiry
          </p>
        </header>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 mb-10 border-y border-border">
          <div className="flex items-center gap-3">
            <label htmlFor="catalog-metal-filter" className="text-xs text-muted-foreground">Metal</label>
            <select
              id="catalog-metal-filter"
              aria-label="Filter jewellery by metal"
              value={selectedMetal}
              onChange={(e) => setSelectedMetal(e.target.value)}
              className={selectClass}
              style={{ backgroundImage: chevron }}
            >
              <option value="all">All Metals</option>
              <option value="yellow">Yellow Gold</option>
              <option value="white">White Gold</option>
              <option value="rose">Rose Gold</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <label htmlFor="catalog-sort" className="text-xs text-muted-foreground">Sort</label>
            <select
              id="catalog-sort"
              aria-label="Sort jewellery listings"
              value={sortBy}
              onChange={(e) => {
                const value = e.target.value;
                if (value === 'featured' || value === 'price-asc' || value === 'price-desc') {
                  setSortBy(value);
                }
              }}
              className={selectClass}
              style={{ backgroundImage: chevron }}
            >
              <option value="featured">Featured</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="price-asc">Price: Low to High</option>
            </select>
            <span aria-live="polite" className="text-xs text-muted-foreground tabular-nums">
              {ready ? `${filteredProducts.length} ${filteredProducts.length === 1 ? 'item' : 'items'}` : ''}
            </span>
          </div>
        </div>

        {productsStatus === 'loading' && <CollectionLoading count={8} />}
        {productsStatus === 'error' && <CollectionError />}

        {ready && categoryProducts.length === 0 && (
          <CollectionEmpty
            title={category === 'all' ? 'The collection is being prepared' : `${currentInfo.title} are coming soon`}
            message="Pieces will appear here as soon as they are published. Our team is happy to help with enquiries in the meantime."
          />
        )}

        {ready && categoryProducts.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
              {filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
            {filteredProducts.length === 0 && (
              <div role="status" className="rounded-[1.5rem] border border-border bg-card px-6 py-16 text-center">
                <h2 className="font-serif-luxury text-2xl text-foreground mb-2">Nothing here just yet</h2>
                <p className="text-sm text-muted-foreground mb-6">Try another category or clear your metal filter.</p>
                <button onClick={() => setSelectedMetal('all')} className="rounded-full border border-foreground/15 px-6 py-3 text-sm font-medium hover:bg-secondary transition-colors">
                  Clear filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
