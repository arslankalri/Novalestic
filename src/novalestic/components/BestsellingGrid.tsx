import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ShoppingBag, Eye } from 'lucide-react';

export const BestsellingGrid: React.FC = () => {
  const { products, formatPrice, addToCart, navigateTo } = useShop();
  const [activeTab, setActiveTab] = useState<'all' | 'rings' | 'earrings' | 'necklaces'>('all');

  const filterTabs = [
    { id: 'all', label: 'ALL PIECES' },
    { id: 'rings', label: 'RINGS' },
    { id: 'earrings', label: 'EARRINGS' },
    { id: 'necklaces', label: 'NECKLACES' },
  ] as const;

  const filteredProducts = products.filter((item) => {
    if (activeTab === 'all') return true;
    return item.category === activeTab;
  });

  return (
    <section className="w-full py-16 lg:py-24 bg-[#F2EDE3]" id="bestselling-section">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#765a18] block mb-2">
              A FIRST LOOK AT NOVALESTIC
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#1b1c19] font-normal">
              Explore the Collection
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#fbf9f4] shadow-sm border border-[#e4e2dd]">
            {filterTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-xs font-semibold tracking-[0.12em] uppercase transition-all duration-200 ${
                    isActive
                      ? 'bg-[#1b1c19] text-white shadow-sm'
                      : 'text-[#4d4545] hover:text-[#1b1c19]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4-Column Luxury Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group flex flex-col bg-[#fbf9f4] shadow-sm hover:shadow-xl transition-all duration-300 border border-[#e4e2dd]/60"
            >
              {/* Product Image */}
              <div className="relative w-full aspect-[4/5] bg-[#eae8e3] overflow-hidden">
                <button
                  onClick={() => navigateTo('product-detail', product.id)}
                  className="w-full h-full block focus:outline-none"
                  aria-label={`View details of ${product.title}`}
                >
                  <img
                    alt={product.title}
                    src={product.image}
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                </button>

                <span className="absolute top-3 left-3 bg-[#fbf9f4]/95 border border-[#C6A45B]/40 text-[#765a18] px-2.5 py-1.5 text-[9px] uppercase tracking-[0.14em] font-semibold pointer-events-none">
                  Sample
                </span>

                {/* Quick Add Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-3 bg-[#fbf9f4]/95 backdrop-blur-md translate-y-0 sm:translate-y-full sm:group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-between gap-2 shadow-lg">
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

              {/* Card Details */}
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

                {/* Price in PKR */}
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
    </section>
  );
};
