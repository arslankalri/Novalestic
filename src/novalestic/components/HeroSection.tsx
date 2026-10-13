import React from 'react';
import { useShop } from '../context/ShopContext';
import { NovalesticLogo } from './NovalesticLogo';
import { ArrowRight, ShoppingBag } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { navigateTo } = useShop();

  return (
    <section className="w-full bg-[#fbf9f4] text-[#1b1c19]">
      <div className="relative min-h-[72vh] lg:min-h-[78vh] flex items-center overflow-hidden">
        {/* Soft ivory canvas with restrained gold detailing */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_78%_45%,rgba(198,164,91,0.12),transparent_42%),linear-gradient(120deg,#fbf9f4_0%,#f5f0e7_100%)]" />
        <div className="absolute right-[-8rem] top-1/2 -translate-y-1/2 w-[30rem] h-[30rem] md:w-[42rem] md:h-[42rem] rounded-full border border-[#C6A45B]/30" />
        <div className="absolute right-[-5rem] top-1/2 -translate-y-1/2 w-[24rem] h-[24rem] md:w-[34rem] md:h-[34rem] rounded-full border border-[#C6A45B]/20" />

        <div className="relative z-10 max-w-[1440px] w-full mx-auto px-6 md:px-12 lg:px-16 py-24 lg:py-28">
          <div className="max-w-2xl flex flex-col items-start">
            <div className="mb-8 flex flex-col items-start">
              <NovalesticLogo variant="crest" size="lg" />
            </div>

            <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.32em] text-[#9E7B32] mb-4">
              NOVALESTIC JEWELLERS
            </p>
            <h1 className="font-serif-luxury text-4xl sm:text-5xl lg:text-7xl text-[#1b1c19] tracking-tight font-normal mb-6 leading-[1.08] text-balance">
              Jewellery that makes every moment feel timeless.
            </h1>
            <p className="text-base sm:text-lg text-[#5d5750] max-w-xl mb-9 leading-relaxed font-light">
              Discover your style with Novalestic. Explore our jewellery collection and find a piece that feels uniquely yours.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => navigateTo('shop')}
                className="group inline-flex items-center justify-center px-8 py-4 bg-[#1b1c19] text-white hover:bg-[#9E7B32] text-xs font-semibold tracking-[0.18em] uppercase transition-all duration-300 border border-[#1b1c19]"
              >
                <ShoppingBag className="w-4 h-4 mr-2 text-[#DFC27F]" />
                <span>Explore Jewellery</span>
                <ArrowRight className="w-4 h-4 ml-2.5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => navigateTo('rings')}
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-[#1b1c19] hover:bg-[#F2EDE3] text-xs font-semibold tracking-[0.18em] uppercase transition-all duration-300 border border-[#C6A45B]/60"
              >
                Discover Rings
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full bg-[#F2EDE3] text-[#1b1c19] py-5 border-y border-[#DFC27F]/30">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-center">
          <span className="text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.2em]">Thoughtful Design</span>
          <span className="hidden sm:block w-1 h-1 rounded-full bg-[#C6A45B]" />
          <span className="text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.2em]">Jewellery for Every Occasion</span>
          <span className="hidden sm:block w-1 h-1 rounded-full bg-[#C6A45B]" />
          <span className="text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.2em]">Made to Be Remembered</span>
        </div>
      </div>
    </section>
  );
};
