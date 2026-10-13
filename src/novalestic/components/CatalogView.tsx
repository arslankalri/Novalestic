import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { MessageCircle, Eye, ArrowLeft, SlidersHorizontal } from 'lucide-react';

interface CatalogViewProps {
  category: 'all' | 'rings' | 'earrings' | 'necklaces' | 'bangles-bracelets';
}

export const CatalogView: React.FC<CatalogViewProps> = ({ category }) => {
  const { products, navigateTo } = useShop();

  const [selectedMetal, setSelectedMetal] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  const categoryTitles: Record<string, { title: string; subtitle: string; description: string }> = {
    all: {
      title: 'All Jewellery',
      subtitle: 'THE NOVALESTIC COLLECTION',
      description: 'Explore the collection and discover pieces that suit your personal style.',
    },
    rings: {
      title: 'Rings',
      subtitle: 'RING DESIGN PREVIEWS',
      description: 'Explore rings for everyday wear, meaningful gifts and special occasions.',
    },
    earrings: {
      title: 'Earrings',
      subtitle: 'EARRING DESIGN PREVIEWS',
      description: 'Explore earrings in a range of silhouettes, from subtle to statement-making.',
    },
    necklaces: {
      title: 'Necklaces & Pendants',
      subtitle: 'NECKLACE DESIGN PREVIEWS',
      description: 'Explore necklaces and pendants to complement your own style.',
    },
    'bangles-bracelets': {
      title: 'Bangles & Bracelets',
      subtitle: 'BRACELET DESIGN PREVIEWS',
      description: 'Discover bracelets and bangles for layering or wearing on their own.',
    },
  };

  const currentInfo = categoryTitles[category] ?? categoryTitles['all']!;

  const filteredProducts = useMemo(() => {
    let items = category === 'all'
      ? products
      : products.filter((p) => p.category === category);

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
  }, [category, products, selectedMetal, sortBy]);

  return (
    <div className="w-full bg-[#fbf9f4] min-h-screen pt-36 pb-24">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
        {/* Breadcrumb Navigation */}
        <div className="mb-6 flex items-center gap-2 text-xs text-[#7f7575] uppercase tracking-wider">
          <button
            onClick={() => navigateTo('home')}
            className="hover:text-[#1b1c19] flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
          <span>/</span>
          <span className="text-[#1b1c19] font-semibold">{currentInfo.title}</span>
        </div>

        {/* Category Hero Banner */}
        <div className="bg-[#F2EDE3] p-8 sm:p-12 mb-10 border border-[#DFC27F]/30 text-center max-w-4xl mx-auto">
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#765a18] block mb-2">
            {currentInfo.subtitle}
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-5xl text-[#1b1c19] font-normal mb-3">
            {currentInfo.title}
          </h1>
          <p className="text-sm sm:text-base text-[#4d4545] max-w-2xl mx-auto leading-relaxed font-light">
            {currentInfo.description}
          </p>
          <p className="mt-5 inline-flex items-center border border-[#C6A45B]/40 bg-[#fbf9f4]/70 px-3 py-2 text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-[#765a18]">
            Prices and specifications available on enquiry
          </p>
        </div>

        {/* Filter & Sort Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-[#f5f3ee] border border-[#e4e2dd] mb-8">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <SlidersHorizontal className="w-4 h-4 text-[#765a18] shrink-0" />
            <label htmlFor="catalog-metal-filter" className="text-xs uppercase tracking-wider font-semibold text-[#1b1c19]">
              Filter Metal:
            </label>
            <select
              id="catalog-metal-filter"
              aria-label="Filter jewellery by metal"
              value={selectedMetal}
              onChange={(e) => setSelectedMetal(e.target.value)}
              className="bg-[#fbf9f4] border border-[#e4e2dd] text-xs px-3 py-1.5 text-[#1b1c19] focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#9E7B32]"
            >
              <option value="all">All Metals</option>
              <option value="yellow">Yellow Gold</option>
              <option value="white">White Gold</option>
              <option value="rose">Rose Gold</option>
            </select>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <label htmlFor="catalog-sort" className="text-xs uppercase tracking-wider font-semibold text-[#1b1c19]">
              Sort By:
            </label>
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
              className="bg-[#fbf9f4] border border-[#e4e2dd] text-xs px-3 py-1.5 text-[#1b1c19] focus:outline-none"
            >
              <option value="featured">Featured</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="price-asc">Price: Low to High</option>
            </select>
            <span aria-live="polite" className="text-xs text-[#7f7575] pl-2 tabular-nums">
              ({filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'})
            </span>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group flex flex-col bg-[#fbf9f4] shadow-sm hover:shadow-xl transition-all duration-300 border border-[#e4e2dd]/60"
            >
              <div className="relative w-full aspect-[4/5] bg-[#eae8e3] overflow-hidden">
                <button
                  onClick={() => navigateTo('product-detail', product.id)}
                  className="w-full h-full block focus:outline-none"
                  aria-label={`View ${product.title}`}
                >
                  <img
                    alt={product.title}
                    src={product.image}
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                </button>

                <span className="absolute top-3 left-3 bg-[#fbf9f4]/95 border border-[#C6A45B]/40 text-[#765a18] px-2.5 py-1.5 text-[9px] uppercase tracking-[0.14em] font-semibold pointer-events-none">
                  Price on enquiry
                </span>

                <div className="absolute inset-x-0 bottom-0 p-3 bg-[#fbf9f4]/95 backdrop-blur-md translate-y-0 sm:translate-y-full sm:group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-between gap-2 shadow-lg">
                  <a
                    href={`https://wa.me/923019653550?text=${encodeURIComponent(`Hello NOVALESTIC JEWELLERS, I would like to enquire about ${product.title}. Please share the current price and availability.`)}`}
                    target="_blank" rel="noreferrer"
                    className="flex-1 py-2.5 bg-[#176b43] hover:bg-[#125637] text-white text-[11px] font-semibold tracking-[0.14em] uppercase transition-colors flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> Enquire
                  </a>
                  <button
                    onClick={() => navigateTo('product-detail', product.id)}
                    aria-label="View Details"
                    className="w-10 h-10 bg-[#eae8e3] hover:bg-[#dbdad5] flex items-center justify-center text-[#1b1c19] transition-colors shrink-0"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow justify-between bg-[#fbf9f4]">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-semibold uppercase text-[#765a18] tracking-widest">
                      {product.metal}
                    </span>

                  </div>

                  <button
                    onClick={() => navigateTo('product-detail', product.id)}
                    className="text-left w-full group/title focus:outline-none"
                  >
                    <h3 className="font-serif-luxury text-[17px] text-[#1b1c19] font-medium mb-1 group-hover/title:text-[#9E7B32] transition-colors line-clamp-1">
                      {product.title}
                    </h3>
                  </button>

                  <p className="text-xs text-[#4d4545] mb-4 line-clamp-2 leading-relaxed">
                    {product.shortDesc}
                  </p>
                </div>

                <div className="pt-3 flex items-baseline justify-between bg-[#f5f3ee] px-3.5 py-2.5 border-t border-[#e4e2dd]">
                  <span className="text-[10px] uppercase text-[#7f7575] tracking-wider font-medium">
                    Price
                  </span>
                  <span className="font-serif-luxury text-sm font-bold text-[#176b43]">Contact for price</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filteredProducts.length === 0 && (
          <div className="border border-[#e4e2dd] bg-[#F2EDE3]/60 px-6 py-16 text-center">
            <h2 className="font-serif-luxury text-2xl text-[#1b1c19] mb-2">Nothing here just yet</h2>
            <p className="text-sm text-[#5d5750] mb-6">Try another category or clear your metal filter.</p>
            <button onClick={() => setSelectedMetal('all')} className="border border-[#C6A45B] px-5 py-3 text-xs uppercase tracking-[0.16em] hover:bg-[#F2EDE3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9E7B32]">Clear filters</button>
          </div>
        )}
      </div>
    </div>
  );
};
