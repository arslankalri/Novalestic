import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { ShoppingBag, Eye, ShieldCheck, ArrowLeft, SlidersHorizontal } from 'lucide-react';

interface CatalogViewProps {
  category: 'all' | 'rings' | 'earrings' | 'necklaces' | 'bangles-bracelets';
}

export const CatalogView: React.FC<CatalogViewProps> = ({ category }) => {
  const { products, formatPrice, addToCart, navigateTo } = useShop();

  const [selectedMetal, setSelectedMetal] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  const categoryTitles: Record<string, { title: string; subtitle: string; description: string }> = {
    all: {
      title: 'Complete Fine Jewellery Collection',
      subtitle: 'HANDCRAFTED IN 18K GOLD & NATURAL EMERALDS',
      description: 'Explore our full catalogue of authentic rings, drop earrings, and necklaces in Pakistani Rupees.',
    },
    rings: {
      title: 'Fine Jewellery Rings',
      subtitle: 'COUTURE SOLITAIRES & ETERNITY BANDS',
      description: 'Meticulously crafted cocktail rings, emerald solitaires, and eternity bands embracing natural gemstones.',
    },
    earrings: {
      title: 'Solitaire & Drop Earrings',
      subtitle: 'DROPS, CHANDELIERS & TOPS',
      description: 'Hand-matched pairs displaying incandescent green vibrancy set in hallmarked 18k gold.',
    },
    necklaces: {
      title: 'Emerald Necklaces & Pendants',
      subtitle: 'PENDANTS, COLLIERS & STRANDS',
      description: 'Centerpiece necklaces and pendants suspended on solid 18k gold link chains.',
    },
    'bangles-bracelets': {
      title: 'Bangles & Bracelets',
      subtitle: 'GOLD BANGLES & TENNIS BRACELETS',
      description: 'Articulated gold bracelets and emerald bangles designed for everyday elegance.',
    },
  };

  const currentInfo = categoryTitles[category] ?? categoryTitles.all!;

  const filteredProducts = useMemo(() => {
    let items = category === 'all'
      ? products
      : products.filter((p) => p.category === category);

    if (selectedMetal !== 'all') {
      items = items.filter((p) => p.metal.toLowerCase().includes(selectedMetal.toLowerCase()));
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
        </div>

        {/* Filter & Sort Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-[#f5f3ee] border border-[#e4e2dd] mb-8">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <SlidersHorizontal className="w-4 h-4 text-[#765a18] shrink-0" />
            <span className="text-xs uppercase tracking-wider font-semibold text-[#1b1c19]">
              Filter Metal:
            </span>
            <select
              value={selectedMetal}
              onChange={(e) => setSelectedMetal(e.target.value)}
              className="bg-[#fbf9f4] border border-[#e4e2dd] text-xs px-3 py-1.5 text-[#1b1c19] focus:outline-none"
            >
              <option value="all">All Metals</option>
              <option value="champagne">Champagne Gold</option>
              <option value="yellow">Yellow Gold</option>
              <option value="white">White Gold</option>
            </select>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#1b1c19]">
              Sort By:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#fbf9f4] border border-[#e4e2dd] text-xs px-3 py-1.5 text-[#1b1c19] focus:outline-none"
            >
              <option value="featured">Featured</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="price-asc">Price: Low to High</option>
            </select>
            <span className="text-xs text-[#7f7575] pl-2 tabular-nums">
              ({filteredProducts.length} Items)
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

                {product.hallmarkBadge && (
                  <div className="absolute top-3 left-3 bg-[#E8F4F0]/90 backdrop-blur-sm text-[#15803d] px-2.5 py-1 text-[10px] uppercase tracking-wider flex items-center gap-1 font-bold shadow-xs">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{product.hallmarkBadge}</span>
                  </div>
                )}

                <div className="absolute inset-x-0 bottom-0 p-3 bg-[#fbf9f4]/95 backdrop-blur-md translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-between gap-2 shadow-lg">
                  <button
                    onClick={() => addToCart(product)}
                    className="flex-1 py-2.5 bg-[#1b1c19] hover:bg-[#9E7B32] text-white text-[11px] font-semibold tracking-[0.14em] uppercase transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>ADD TO CART</span>
                  </button>
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
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#DFC27F]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#dbdad5]" />
                    </div>
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
                  <span className="font-serif-luxury text-base font-bold text-[#1b1c19] tabular-nums">
                    {formatPrice(product.pricePKR)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
