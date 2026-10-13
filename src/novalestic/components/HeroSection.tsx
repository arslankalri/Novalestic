import React from 'react';
import { useShop } from '../context/ShopContext';
import { NovalesticLogo } from './NovalesticLogo';
import { ArrowRight, ShoppingBag } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { navigateTo, isOwnerMode } = useShop();

  return (
    <section className="relative w-full overflow-hidden bg-[#1b1c19] text-white">
      {/* Hero Background Image & Scrim */}
      <div className="relative w-full min-h-[82vh] lg:min-h-[88vh] flex items-end pb-16 lg:pb-24">
        <img
          alt="NOVALESTIC Campaign Model wearing emerald and diamond high jewellery"
          className="absolute inset-0 w-full h-full object-cover object-center lg:object-top"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9FiqYgHxW8OiddAhm7FJHvhOgw5nCgSUcIntiRF4XkwLN4Y3i9A-UqLQtPkxHNgSt2aOSZNmjV4CkMknjSkTLUdUUkg8eDrE8JawNu5JJnS6h_KvPm3ioGIgp2WC36dJsiGhWSS2QOfNE-T_AGTnU_oRDTQsEDj1W68M4A-wClvZNHlDYnkiw6jVxANP-nm1-qiGgoAz9m0dmgec3GHS_C9HQUHtetiHE1Ok4-l3rsRryjYTyXDyw"
        />

        {/* Dual Directional Scrim for Luxury Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1b1c19] via-[#1b1c19]/50 to-[#1b1c19]/25 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1b1c19]/85 via-[#1b1c19]/35 to-transparent pointer-events-none" />

        {/* Content Container */}
        <div className="relative z-10 max-w-[1440px] w-full mx-auto px-6 md:px-12 lg:px-16 pt-36 lg:pt-44">
          <div className="max-w-2xl lg:max-w-3xl flex flex-col items-start">
            {/* Logo Crest Accent */}
            <div className="mb-4 flex items-center gap-3">
              <NovalesticLogo variant="icon" size="sm" inverted />
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#DFC27F]">
                  THE NOVALESTIC EMERALD &amp; GOLD COLLECTION
                </span>
                <span className="text-[9px] uppercase tracking-[0.3em] text-[#e4e2dd]/70">
                  HANDCRAFTED FINE JEWELLERY
                </span>
              </div>
            </div>

            <h1 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight font-normal mb-5 leading-[1.1] text-balance">
              Timeless Radiance Handcrafted for Eternity
            </h1>

            <p className="text-base sm:text-lg text-[#eae8e3]/90 max-w-xl mb-8 leading-relaxed font-light">
              Meticulously forged in 18k solid gold with natural emeralds and brilliant diamonds. Delivered safely across Pakistan with insured courier handling.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <button
                onClick={() => navigateTo('shop')}
                className="group relative inline-flex items-center justify-center px-8 py-4 bg-[#1b1c19] text-white hover:bg-[#9E7B32] text-xs font-semibold tracking-[0.18em] uppercase transition-all duration-300 shadow-xl border border-[#DFC27F]/40"
              >
                <ShoppingBag className="w-4 h-4 mr-2 text-[#DFC27F]" />
                <span>EXPLORE ALL JEWELLERY</span>
                <ArrowRight className="w-4 h-4 ml-2.5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              {isOwnerMode ? (
                <button
                  onClick={() => navigateTo('manage-store')}
                  className="inline-flex items-center justify-center px-8 py-4 bg-[#F2EDE3]/15 backdrop-blur-md text-white hover:bg-[#F2EDE3]/30 text-xs font-semibold tracking-[0.18em] uppercase transition-all duration-300 border border-white/20 shadow-md"
                >
                  ADD ITEMS TO STORE
                </button>
              ) : (
                <button
                  onClick={() => navigateTo('rings')}
                  className="inline-flex items-center justify-center px-8 py-4 bg-[#F2EDE3]/15 backdrop-blur-md text-white hover:bg-[#F2EDE3]/30 text-xs font-semibold tracking-[0.18em] uppercase transition-all duration-300 border border-white/20 shadow-md"
                >
                  VIEW RINGS COLLECTION
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Trust Indicators Bar */}
      <div className="w-full bg-[#F2EDE3] text-[#1b1c19] py-4 border-b border-[#DFC27F]/25 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#765a18]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#1b1c19]">
                18K Hallmarked Gold
              </span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#15803d]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#1b1c19]">
                Natural Genuine Emeralds
              </span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#765a18]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#1b1c19]">
                Insured Pakistan Delivery
              </span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#765a18]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#1b1c19]">
                Cash on Delivery &amp; Bank Wire
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
