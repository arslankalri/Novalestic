import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ArrowLeft, ShoppingBag, Info } from 'lucide-react';

interface ProductDetailViewProps {
  productId: string;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({ productId }) => {
  const { products, formatPrice, addToCart, navigateTo } = useShop();

  const product = products.find((p) => p.id === productId) || products[0];

  const [selectedMetal, setSelectedMetal] = useState(product?.availableMetals?.[0] || product?.metal || '18k Yellow Gold');
  const [selectedRingSize, setSelectedRingSize] = useState('Size 14 (Standard)');
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="pt-32 pb-20 text-center">
        <p>Product not found.</p>
        <button onClick={() => navigateTo('shop')} className="mt-4 underline">
          Back to Shop
        </button>
      </div>
    );
  }



  const ringSizes = [
    'Size 12 (Small)',
    'Size 14 (Standard)',
    'Size 16 (Medium)',
    'Size 18 (Large)',
    'Custom Size / Resizing on Request',
  ];

  const handleAddToCart = () => {
    addToCart(
      product,
      quantity,
      selectedMetal,
      product.category === 'rings' ? selectedRingSize : undefined
    );
  };

  const handleBuyNow = () => {
    addToCart(
      product,
      quantity,
      selectedMetal,
      product.category === 'rings' ? selectedRingSize : undefined
    );
    navigateTo('cart');
  };

  return (
    <div className="w-full bg-[#fbf9f4] min-h-screen pt-36 pb-24">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs text-[#7f7575] uppercase tracking-wider">
          <button
            onClick={() => navigateTo('home')}
            className="hover:text-[#1b1c19] flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
          <span>/</span>
          <button
            onClick={() => navigateTo('shop')}
            className="hover:text-[#1b1c19] transition-colors"
          >
            Jewellery
          </button>
          <span>/</span>
          <span className="text-[#1b1c19] font-semibold truncate max-w-xs">{product.title}</span>
        </div>

        {/* 2-Column Split: Image Left, Purchase Module Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Image */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="relative aspect-[4/5] bg-[#F2EDE3] overflow-hidden shadow-lg border border-[#e4e2dd]">
              <img
                alt={product.title}
                src={product.image}
                className="w-full h-full object-cover object-center"
              />

              <span className="absolute top-4 left-4 bg-[#fbf9f4]/95 border border-[#C6A45B]/40 text-[#765a18] px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] font-semibold">Sample listing</span>
            </div>
          </div>

          {/* Right Column: Purchase Module */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            <div className="border-b border-[#e4e2dd] pb-6 mb-6">
              <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#765a18] block mb-2">
                SAMPLE LISTING · {product.category.replace('-', ' ')}
              </span>

              <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#1b1c19] font-normal mb-3">
                {product.title}
              </h1>

              <div className="flex items-baseline justify-between mt-4">
                <span className="text-xs uppercase tracking-widest text-[#7f7575] font-medium">
                  Price (PKR)
                </span>
                <span className="font-serif-luxury text-3xl font-bold text-[#1b1c19] tabular-nums">
                  {formatPrice(product.pricePKR)}
                </span>
              </div>
            </div>

            <p className="text-sm text-[#4d4545] leading-relaxed mb-6 font-light">
              {product.description}
            </p>

            {/* Metal Selection */}
            {product.availableMetals && product.availableMetals.length > 0 && (
              <div className="mb-6">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1b1c19] mb-2">
                  Select Option: <span className="font-normal text-[#765a18]">{selectedMetal}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.availableMetals.map((metal) => (
                    <button
                      key={metal}
                      onClick={() => setSelectedMetal(metal)}
                      className={`px-3.5 py-2 text-xs border transition-all ${
                        selectedMetal === metal
                          ? 'border-[#9E7B32] bg-[#F2EDE3] font-semibold text-[#1b1c19]'
                          : 'border-[#e4e2dd] bg-[#f5f3ee] text-[#4d4545] hover:bg-[#eae8e3]'
                      }`}
                    >
                      {metal}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Ring Sizing (If Ring) */}
            {product.category === 'rings' && (
              <div className="mb-6">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1b1c19] mb-2">
                  Select Ring Size
                </label>
                <select
                  value={selectedRingSize}
                  onChange={(e) => setSelectedRingSize(e.target.value)}
                  className="w-full bg-[#f5f3ee] border border-[#e4e2dd] px-3.5 py-2.5 text-xs text-[#1b1c19] focus:outline-none focus:border-[#9E7B32]"
                >
                  {ringSizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-[#7f7575] mt-1 block">
                  Sample sizing options for design preview.
                </span>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6 flex items-center gap-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#1b1c19]">
                Quantity:
              </label>
              <div className="flex items-center border border-[#e4e2dd] bg-[#f5f3ee]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-sm hover:bg-[#eae8e3]"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-xs font-bold font-mono">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 text-sm hover:bg-[#eae8e3]"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 mb-8">
              <button
                onClick={handleAddToCart}
                className="w-full py-4 bg-[#1b1c19] hover:bg-[#9E7B32] text-white text-xs font-semibold uppercase tracking-[0.18em] transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>ADD TO CART</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="w-full py-3.5 bg-[#9E7B32] hover:bg-[#765a18] text-white text-xs font-semibold uppercase tracking-[0.16em] transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>VIEW CART</span>
              </button>

              <button
                onClick={() => navigateTo('cart')}
                className="w-full py-3 bg-transparent hover:bg-[#F2EDE3] text-[#1b1c19] border border-[#C6A45B]/50 text-xs font-semibold uppercase tracking-[0.14em] transition-colors flex items-center justify-center gap-2"
              >
                <span>VIEW CART</span>
              </button>>
            </div>

            {/* Preview notice */}
            <div className="bg-[#F2EDE3]/70 p-4 border border-[#C6A45B]/35 flex items-start gap-3 text-xs text-[#5d5750] mb-6">
              <Info className="w-4 h-4 text-[#9E7B32] shrink-0 mt-0.5" />
              <p className="leading-relaxed">This is a sample product page for design preview. Product details, availability, shipping and payment options will be confirmed before the store opens.</p>
            </div>

            {/* Specifications */}
            <div className="border-t border-[#e4e2dd] pt-6">
              <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1b1c19] mb-4">
                Jewellery Specifications
              </h4>

              <div className="space-y-2.5 text-xs text-[#4d4545]">
                <div className="flex justify-between py-1 border-b border-[#e4e2dd]/60">
                  <span className="text-[#7f7575]">Gold Metal:</span>
                  <span className="font-medium text-[#1b1c19]">{product.metal}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#e4e2dd]/60">
                  <span className="text-[#7f7575]">Gemstone:</span>
                  <span className="font-medium text-[#1b1c19]">{product.carat}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#e4e2dd]/60">
                  <span className="text-[#7f7575]">Stone Origin:</span>
                  <span className="font-medium text-[#1b1c19]">{product.origin}</span>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
