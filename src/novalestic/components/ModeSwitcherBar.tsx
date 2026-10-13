import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Eye, Settings, Share2, Copy, Check, ExternalLink, ShieldCheck, X, Sparkles, Smartphone, ChevronDown, ChevronUp } from 'lucide-react';

export const ModeSwitcherBar: React.FC = () => {
  const { isOwnerMode, setIsOwnerMode, navigateTo, currentView, orders, products } = useShop();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Determine current public URL
  const publicStoreUrl = typeof window !== 'undefined'
    ? window.location.href.split('#')[0] ?? ''
    : 'https://novalestic.pk';

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(publicStoreUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // If owner minimized the switcher to inspect 100% clean customer storefront
  if (isMinimized) {
    return (
      <div className="fixed bottom-5 right-5 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-[#1b1c19] text-[#DFC27F] hover:text-white px-3.5 py-2 rounded-full shadow-2xl border border-[#DFC27F]/40 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider transition-all hover:scale-105"
          title="Restore Store End Switcher"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>{isOwnerMode ? 'Owner End' : 'Customer End'}</span>
          <ChevronUp className="w-3.5 h-3.5 ml-0.5" />
        </button>
      </div>
    );
  }

  return (
    <>
      <aside
        aria-label="Store Environment & View Switcher"
        className="w-full bg-[#161715] text-[#e4e2dd] px-4 py-2 border-b border-[#DFC27F]/30 text-xs shrink-0 select-none"
      >
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
          {/* Status info */}
          <div className="flex items-center gap-2.5 text-center md:text-left flex-wrap justify-center md:justify-start">
            <span
              className={`w-2 h-2 rounded-full shrink-0 animate-pulse ${
                isOwnerMode ? 'bg-[#DFC27F]' : 'bg-[#22c55e]'
              }`}
            />

            {isOwnerMode ? (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-white uppercase tracking-wider text-[11px] bg-[#9E7B32]/30 px-2 py-0.5 border border-[#DFC27F]/30">
                  Store Management End (Owner Portal)
                </span>
                <span className="text-[#a8a49c] hidden lg:inline text-[11px]">
                  Add pieces, adjust PKR prices &amp; process incoming orders.
                </span>
                <span className="text-[#DFC27F] font-mono text-[11px]">
                  ({products.length} products • {orders.length} orders)
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-white uppercase tracking-wider text-[11px] bg-[#15803d]/30 px-2 py-0.5 border border-[#22c55e]/30">
                  Published Customer Store (Live End)
                </span>
                <span className="text-[#a8a49c] text-[11px]">
                  This is the exact storefront your clients in Pakistan see when they visit your link.
                </span>
              </div>
            )}
          </div>

          {/* Action buttons & mode toggle */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap justify-center">
            {/* Share / Publish Info Modal Trigger */}
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="px-2.5 py-1 text-[11px] font-semibold tracking-wider transition-all bg-white/10 hover:bg-white/20 text-[#eae8e3] flex items-center gap-1.5"
              title="View Customer Link and Publishing Details"
            >
              <Share2 className="w-3 h-3 text-[#DFC27F]" />
              <span className="hidden sm:inline">Publish / Customer Link</span>
              <span className="sm:hidden">Share</span>
            </button>

            {/* Toggle: Customer End */}
            <button
              onClick={() => {
                setIsOwnerMode(false);
                if (currentView === 'manage-store') {
                  navigateTo('home');
                }
              }}
              className={`px-3 py-1 text-[11px] font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                !isOwnerMode
                  ? 'bg-[#15803d] text-white shadow-xs font-bold ring-1 ring-[#22c55e]/50'
                  : 'bg-white/5 text-[#a8a49c] hover:bg-white/15 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Customer End</span>
            </button>

            {/* Toggle: Owner End */}
            <button
              onClick={() => {
                setIsOwnerMode(true);
                navigateTo('manage-store');
              }}
              className={`px-3 py-1 text-[11px] font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                isOwnerMode
                  ? 'bg-[#9E7B32] text-white shadow-xs font-bold ring-1 ring-[#DFC27F]/50'
                  : 'bg-white/5 text-[#a8a49c] hover:bg-white/15 hover:text-white'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Owner End</span>
              {orders.length > 0 && (
                <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                  {orders.length}
                </span>
              )}
            </button>

            {/* Minimize bar to inspect pure site */}
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1 text-[#7f7575] hover:text-white transition-colors ml-1"
              title="Minimize banner to preview clean customer storefront"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* SHARE / PUBLISHED STORE EXPLANATION MODAL */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#fbf9f4] border-2 border-[#9E7B32] max-w-xl w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 text-[#1b1c19]">
            <button
              onClick={() => setIsShareModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-[#7f7575] hover:text-[#1b1c19] transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#15803d]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#765a18]">
                PUBLISHING &amp; CUSTOMER ACCESS GUIDE
              </span>
            </div>

            <h3 className="font-serif-luxury text-2xl text-[#1b1c19] font-normal mb-3">
              How Your Published Customer Store Works
            </h3>

            <p className="text-xs text-[#4d4545] leading-relaxed mb-5">
              When your website is published or shared, anyone opening the link will visit the <strong className="text-[#1b1c19]">Customer End</strong>. They will see your luxury jewellery catalog with Pakistani Rupee (PKR) pricing, can add items to cart, choose ring sizes, and order via Cash on Delivery or Bank Transfer.
            </p>

            {/* Customer URL Copy Box */}
            <div className="bg-[#F2EDE3] border border-[#DFC27F]/50 p-4 mb-5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#765a18] block mb-1.5">
                Live Customer Storefront URL
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={publicStoreUrl}
                  className="w-full bg-white px-3 py-2 text-xs font-mono border border-[#e4e2dd] text-[#1b1c19] select-all focus:outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 bg-[#1b1c19] hover:bg-[#9E7B32] text-white text-xs font-semibold uppercase tracking-wider transition-colors shrink-0 flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#22c55e]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>

            {/* Comparison Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 text-xs">
              <div className="p-3 bg-white border border-[#22c55e]/30">
                <div className="flex items-center gap-1.5 font-bold text-[#15803d] uppercase tracking-wider text-[11px] mb-1">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Customer End (Public)</span>
                </div>
                <ul className="text-[#4d4545] space-y-1 list-disc list-inside text-[11px]">
                  <li>Editorial homepage &amp; brand story</li>
                  <li>Rings, Earrings, Necklaces catalog</li>
                  <li>Prices shown in PKR (₨)</li>
                  <li>Cart &amp; Cash on Delivery checkout</li>
                  <li>WhatsApp order inquiry button</li>
                </ul>
              </div>

              <div className="p-3 bg-white border border-[#DFC27F]/40">
                <div className="flex items-center gap-1.5 font-bold text-[#765a18] uppercase tracking-wider text-[11px] mb-1">
                  <Settings className="w-3.5 h-3.5" />
                  <span>Owner End (Private)</span>
                </div>
                <ul className="text-[#4d4545] space-y-1 list-disc list-inside text-[11px]">
                  <li>Add, edit &amp; delete jewellery pieces</li>
                  <li>Manage PKR prices &amp; inventory</li>
                  <li>View customer delivery addresses &amp; phones</li>
                  <li>Update order dispatch statuses</li>
                  <li>Accessible via Owner login or #admin</li>
                </ul>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#e4e2dd]">
              <span className="text-[11px] text-[#7f7575]">
                Buyers never see owner forms or admin controls.
              </span>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    setIsShareModalOpen(false);
                    setIsOwnerMode(false);
                    navigateTo('home');
                  }}
                  className="flex-1 sm:flex-none px-4 py-2 bg-[#15803d] hover:bg-[#166534] text-white text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Customer Store Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
