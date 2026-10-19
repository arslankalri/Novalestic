import React from "react";
import { useShop } from "../context/ShopContext";
import { ArrowRight } from "lucide-react";

export const CraftsmanshipSection: React.FC = () => {
  const { navigateTo } = useShop();

  return (
    <section
      className="w-full py-20 lg:py-32 bg-background"
      id="design-direction-section"
      aria-labelledby="aesthetic-heading"
    >
      <div className="shell grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
        <div className="lg:col-span-6">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-secondary">
            <img
              alt="Jewellery design inspiration featuring an emerald-toned piece"
              className="w-full h-full object-cover object-center"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuATbrNDDgUvbtlj5TfbYI5RNSiv41CboO1jaOewtc2R8ArPI1QQ7DzlGivvl3kXNERLcDndb25j86lBGbIhU4m0vbMXgjg8m3C4AcunuB9pqZvDAFkbKI1ujHGXSevOa9D7qZmpObLlPtRP1OqoyZJgqEW70GK5qahQPtMUUKfwnUjX7kAV11gHEuNiI19R8po1TrBB4uSffIKqfpHUmioy_BzQYsCLRuZVBkJxUnhMjaoBtAxI5saL"
              loading="lazy"
            />
          </div>
        </div>

        <div className="lg:col-span-6">
          <p className="eyebrow mb-4">The Novalestic Aesthetic</p>
          <h2
            id="aesthetic-heading"
            className="font-serif-luxury text-3xl sm:text-5xl text-foreground tracking-tight leading-[1.1]"
          >
            Refined Details. A Distinctive Point of View.
          </h2>
          <p className="mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed">
            NOVALESTIC brings together an understated ivory palette, deep emerald accents and warm
            gold details for a jewellery-shopping experience that feels considered and timeless.
          </p>
          <div className="mt-8 border-l border-champagne-soft pl-5">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Product descriptions, materials, gemstone details, prices and availability are
              confirmed individually with our team. Nothing shown here is a verified claim about
              gemstone origin, metal purity, certification, manufacturing or delivery.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigateTo("shop")}
            className="group mt-10 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-7 py-3.5 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Explore the collection
            <ArrowRight
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </section>
  );
};
