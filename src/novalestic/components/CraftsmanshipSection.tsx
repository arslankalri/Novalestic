import React from 'react';
import { useShop } from '../context/ShopContext';
import { ArrowRight } from 'lucide-react';

export const CraftsmanshipSection: React.FC = () => {
  const { navigateTo } = useShop();

  return (
    <section className="w-full py-16 lg:py-28 bg-[#fbf9f4]" id="craftsmanship-section">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Side: Atelier Bench Photography */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] sm:aspect-[5/4] lg:aspect-[4/3] overflow-hidden shadow-2xl bg-[#F2EDE3] border border-[#e4e2dd]">
              <img
                alt="Hands of master goldsmith setting a vibrant emerald ring at workbench"
                className="w-full h-full object-cover object-center"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuATbrNDDgUvbtlj5TfbYI5RNSiv41CboO1jaOewtc2R8ArPI1QQ7DzlGivvl3kXNERLcDndb25j86lBGbIhU4m0vbMXgjg8m3C4AcunuB9pqZvDAFkbKI1ujHGXSevOa9D7qZmpObLlPtRP1OqoyZJgqEW70GK5qahQPtMUUKfwnUjX7kAV11gHEuNiI19R8po1TrBB4uSffIKqfpHUmioy_BzQYsCLRuZVBkJxUnhMjaoBtAxI5saL"
                loading="lazy"
              />
            </div>

            {/* Floating Hallmark Inset Card */}
            <div className="mt-4 sm:absolute sm:-bottom-8 sm:-right-6 bg-[#F2EDE3] p-6 max-w-xs shadow-xl border border-[#DFC27F]/40 backdrop-blur-md">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#765a18]" />
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#765a18] font-bold">
                  Gold Purity Hallmark
                </p>
              </div>
              <p className="text-xs text-[#4d4545] leading-relaxed">
                Every creation is stamped with our certified maker hallmark and gold purity stamp, guaranteeing genuine heirloom precious metal standards.
              </p>
            </div>
          </div>

          {/* Right Side: Narrative Copy */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-[1px] bg-[#765a18]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#765a18]">
                HANDCRAFTED HERITAGE
              </span>
            </div>

            <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#1b1c19] font-normal mb-6 leading-tight">
              Master Goldsmithing &amp; Genuine Gemstones
            </h2>

            <p className="text-base text-[#4d4545] mb-4 leading-relaxed font-light">
              Founded with an uncompromising devotion to singular emeralds and sculptural fine metals, Nova Lestic preserves the fine traditions of master bench jewelers.
            </p>

            <p className="text-sm text-[#4d4545] mb-8 leading-relaxed">
              From hand-drawn initial sketches to hand-carved wax forms, every setting is individually calibrated around the optical brilliance of each natural gemstone crystal. All pieces are inspected thoroughly before dispatch.
            </p>

            {/* Key Stats */}
            <div className="grid grid-cols-3 gap-6 py-6 mb-8 bg-[#f5f3ee] px-6 border border-[#e4e2dd]">
              <div>
                <p className="font-serif-luxury text-3xl sm:text-4xl font-normal text-[#1b1c19] tabular-nums">
                  18K
                </p>
                <p className="text-[10px] uppercase tracking-wider text-[#7f7575] mt-1 font-medium">
                  Solid Gold Alloys
                </p>
              </div>

              <div>
                <p className="font-serif-luxury text-3xl sm:text-4xl font-normal text-[#15803d] tabular-nums">
                  100%
                </p>
                <p className="text-[10px] uppercase tracking-wider text-[#7f7575] mt-1 font-medium">
                  Natural Gemstones
                </p>
              </div>

              <div>
                <p className="font-serif-luxury text-3xl sm:text-4xl font-normal text-[#1b1c19] tabular-nums">
                  PK
                </p>
                <p className="text-[10px] uppercase tracking-wider text-[#7f7575] mt-1 font-medium">
                  Nationwide Insured
                </p>
              </div>
            </div>

            <div>
              <button
                onClick={() => navigateTo('shop')}
                className="inline-flex items-center px-8 py-4 bg-[#1b1c19] text-white hover:bg-[#9E7B32] transition-colors duration-300 text-xs font-semibold tracking-[0.16em] uppercase shadow-md group border border-[#DFC27F]/30"
              >
                <span>VIEW STORE COLLECTION</span>
                <ArrowRight className="w-4 h-4 ml-2.5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
