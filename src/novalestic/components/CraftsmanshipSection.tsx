import React from 'react';
import { useShop } from '../context/ShopContext';
import { ArrowRight, Info } from 'lucide-react';

export const CraftsmanshipSection: React.FC = () => {
  const { navigateTo } = useShop();

  return (
    <section className="w-full py-16 lg:py-24 bg-[#fbf9f4]" id="design-direction-section">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] overflow-hidden bg-[#F2EDE3] border border-[#e4e2dd]">
              <img
                alt="Jewellery design inspiration featuring an emerald-toned piece"
                className="w-full h-full object-cover object-center"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuATbrNDDgUvbtlj5TfbYI5RNSiv41CboO1jaOewtc2R8ArPI1QQ7DzlGivvl3kXNERLcDndb25j86lBGbIhU4m0vbMXgjg8m3C4AcunuB9pqZvDAFkbKI1ujHGXSevOa9D7qZmpObLlPtRP1OqoyZJgqEW70GK5qahQPtMUUKfwnUjX7kAV11gHEuNiI19R8po1TrBB4uSffIKqfpHUmioy_BzQYsCLRuZVBkJxUnhMjaoBtAxI5saL"
                loading="lazy"
              />
            </div>
            <div className="mt-4 sm:absolute sm:-bottom-6 sm:-right-4 bg-[#F2EDE3] p-5 max-w-xs border border-[#DFC27F]/40">
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#765a18] font-bold mb-2">A first look</p>
              <p className="text-xs text-[#4d4545] leading-relaxed">A visual direction for the NOVALESTIC collection. Final product materials and specifications will be published after verification.</p>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-[1px] bg-[#765a18]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#765a18]">THE NOVALESTIC AESTHETIC</span>
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#1b1c19] font-normal mb-6 leading-tight">
              Refined Details. A Distinctive Point of View.
            </h2>
            <p className="text-base text-[#4d4545] mb-4 leading-relaxed">
              NOVALESTIC brings together an understated ivory palette, deep emerald accents and warm gold details for a jewellery-shopping experience that feels considered and timeless.
            </p>
            <p className="text-sm text-[#4d4545] mb-7 leading-relaxed">
              The collection shown here is illustrative while the storefront is being prepared. Product descriptions, materials, gemstone details, prices and availability will be confirmed before launch.
            </p>
            <div className="bg-[#F2EDE3]/80 border border-[#DFC27F]/35 p-4 flex items-start gap-3 mb-7">
              <Info className="w-4 h-4 text-[#9E7B32] shrink-0 mt-0.5" />
              <p className="text-xs text-[#5d5750] leading-relaxed">This preview does not yet represent verified claims about gemstone origin, metal purity, certification, manufacturing or delivery.</p>
            </div>
            <div>
              <button type="button" onClick={() => navigateTo('shop')} className="inline-flex items-center px-8 py-4 bg-[#1b1c19] text-white hover:bg-[#9E7B32] transition-colors duration-300 text-xs font-semibold tracking-[0.16em] uppercase group border border-[#DFC27F]/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9E7B32]">
                <span>Explore the preview</span>
                <ArrowRight className="w-4 h-4 ml-2.5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
