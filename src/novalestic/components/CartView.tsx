import React from 'react';
import { useShop } from '../context/ShopContext';
import { ArrowLeft, Info, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';

export const CartView: React.FC = () => {
  const { cart, cartTotal, cartCount, formatPrice, removeFromCart, updateCartQuantity, navigateTo } = useShop();

  return (
    <main className="w-full bg-[#fbf9f4] min-h-screen pt-36 pb-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-12">
        <div className="mb-6 flex items-center gap-2 text-xs text-[#7f7575] uppercase tracking-wider">
          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="hover:text-[#1b1c19] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#9E7B32] flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
          <span aria-hidden="true">/</span>
          <span className="text-[#1b1c19] font-semibold">Shopping Cart</span>
        </div>

        <div className="mb-8">
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#765a18] block mb-2">YOUR SELECTION</span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#1b1c19] font-normal">Shopping Cart</h1>
          <p className="text-sm text-[#5d5750] mt-2">{cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart</p>
        </div>

        {cart.length === 0 ? (
          <section className="bg-[#F2EDE3] p-8 sm:p-14 text-center border border-[#DFC27F]/30 max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#fbf9f4] flex items-center justify-center mx-auto mb-4 text-[#7f7575]">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="font-serif-luxury text-2xl text-[#1b1c19] mb-2 font-normal">Your cart is empty</h2>
            <p className="text-sm text-[#4d4545] max-w-md mx-auto mb-6">Browse the sample collection and add pieces to explore how the shopping experience works.</p>
            <button type="button" onClick={() => navigateTo('shop')} className="px-8 py-3.5 bg-[#1b1c19] text-white hover:bg-[#9E7B32] text-xs font-semibold uppercase tracking-wider transition-colors">
              Browse Jewellery
            </button>
          </section>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <section className="lg:col-span-8 bg-[#fbf9f4] border border-[#e4e2dd] p-4 sm:p-6">
              <div className="hidden sm:grid grid-cols-[minmax(0,1fr)_auto] gap-4 pb-3 border-b border-[#e4e2dd] text-[10px] uppercase tracking-[0.16em] font-semibold text-[#7f7575]">
                <span>Product</span><span>Quantity &amp; subtotal</span>
              </div>
              <div className="divide-y divide-[#e4e2dd]">
                {cart.map((item) => (
                  <article key={item.product.id + '-' + item.selectedMetal + '-' + (item.ringSize || '')} className="py-5 grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto] gap-4 sm:gap-6 items-center">
                    <div className="flex gap-4 min-w-0">
                      <img
                        alt={item.product.title}
                        src={item.product.image}
                        loading="lazy"
                        className="w-20 h-24 sm:w-24 sm:h-28 object-cover bg-[#eae8e3] border border-[#e4e2dd] shrink-0"
                      />
                      <div className="min-w-0">
                        <button type="button" onClick={() => navigateTo('product-detail', item.product.id)} className="text-left font-serif-luxury text-base sm:text-lg font-semibold text-[#1b1c19] hover:text-[#9E7B32] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#9E7B32]">
                          {item.product.title}
                        </button>
                        <p className="text-xs text-[#7f7575] mt-1">{item.selectedMetal}{item.ringSize ? ' · ' + item.ringSize : ''}</p>
                        <p className="text-sm font-semibold text-[#1b1c19] mt-2">{formatPrice(item.product.pricePKR)} <span className="font-normal text-[#7f7575]">each</span></p>
                        <button type="button" onClick={() => removeFromCart(item.product.id, item.selectedMetal, item.ringSize)} className="inline-flex items-center gap-1.5 text-xs text-[#7f7575] hover:text-[#ba1a1a] mt-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#9E7B32]">
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      </div>
                    </div>
                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3">
                      <div className="flex items-center border border-[#e4e2dd] bg-[#f5f3ee]">
                        <button type="button" aria-label={'Decrease quantity of ' + item.product.title} disabled={item.quantity <= 1} onClick={() => updateCartQuantity(item.product.id, item.selectedMetal, -1, item.ringSize)} className="p-2.5 hover:bg-[#eae8e3] disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#9E7B32]">
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span aria-live="polite" className="min-w-9 text-center text-sm font-semibold tabular-nums">{item.quantity}</span>
                        <button type="button" aria-label={'Increase quantity of ' + item.product.title} disabled={item.quantity >= 99} onClick={() => updateCartQuantity(item.product.id, item.selectedMetal, 1, item.ringSize)} className="p-2.5 hover:bg-[#eae8e3] disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#9E7B32]">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-sm font-bold text-[#1b1c19] tabular-nums">{formatPrice(item.product.pricePKR * item.quantity)}</p>
                    </div>
                  </article>
                ))}
              </div>
              <div className="pt-5 border-t border-[#e4e2dd]">
                <button type="button" onClick={() => navigateTo('shop')} className="text-xs uppercase tracking-wider text-[#765a18] hover:text-[#1b1c19] font-semibold">← Continue shopping</button>
              </div>
            </section>

            <aside className="lg:col-span-4 bg-[#F2EDE3] p-5 sm:p-7 border border-[#DFC27F]/40 space-y-5">
              <h2 className="font-serif-luxury text-xl text-[#1b1c19] font-medium border-b border-[#DFC27F]/30 pb-3">Order Summary</h2>
              <div className="flex justify-between gap-4 text-sm text-[#4d4545]">
                <span>Subtotal ({cartCount} {cartCount === 1 ? 'item' : 'items'})</span>
                <span className="font-semibold text-[#1b1c19] tabular-nums">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between gap-4 text-sm text-[#4d4545]">
                <span>Delivery</span><span className="text-[#765a18]">To be confirmed</span>
              </div>
              <div className="flex justify-between gap-4 text-base font-serif-luxury font-bold text-[#1b1c19] pt-4 border-t border-[#DFC27F]/40">
                <span>Subtotal (PKR)</span><span className="tabular-nums">{formatPrice(cartTotal)}</span>
              </div>
              <button type="button" disabled aria-disabled="true" title="Checkout will be enabled after secure order processing is connected." className="w-full py-4 bg-[#d9d5cc] text-[#706b62] text-xs font-semibold uppercase tracking-[0.16em] cursor-not-allowed border border-[#c9c4ba]">
                Checkout coming soon
              </button>
              <div className="p-3 bg-[#fbf9f4] border border-[#C6A45B]/30 text-[#5d5750] text-xs flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 text-[#9E7B32] mt-0.5" />
                <span>Store preview only. Product prices are examples; checkout, payments, shipping and order processing are not connected yet.</span>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
};
