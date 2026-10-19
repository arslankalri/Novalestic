import React from 'react';
import { useShop } from '../context/ShopContext';
import { ArrowRight } from 'lucide-react';
import heroImage from '@/assets/hero-editorial.jpg';

export const HeroSection: React.FC = () => {
  const { navigateTo } = useShop();

  return (
    <section className="w-full bg-background pt-24" aria-labelledby="hero-heading">
      <div className="shell grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center py-12 lg:py-20">
        <div className="lg:col-span-5 order-2 lg:order-1 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <p className="eyebrow mb-5">Novalestic Jewellers</p>
          <h1 id="hero-heading" className="font-serif-luxury text-[2.75rem] sm:text-6xl xl:text-7xl text-foreground tracking-tight leading-[1.04] text-balance">
            Jewellery that makes every moment feel timeless.
          </h1>
          <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-md leading-relaxed">
            Discover your style with Novalestic. Explore our jewellery collection and find a piece that feels uniquely yours.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigateTo('shop')}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-7 py-3.5 text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Explore Jewellery
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
            </button>
            <button
              onClick={() => navigateTo('rings')}
              className="inline-flex items-center justify-center rounded-full border border-foreground/15 px-7 py-3.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
            >
              Discover Rings
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 order-1 lg:order-2">
          <figure className="relative overflow-hidden rounded-[2rem] bg-secondary shadow-lift aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5] xl:aspect-[5/6]">
            <img
              src={heroImage}
              alt="A gold ring with a green stone resting on ivory travertine in soft window light"
              width={1200}
              height={1504}
              className="w-full h-full object-cover object-center"
            />
            <figcaption className="absolute bottom-4 left-4 rounded-full bg-card/85 backdrop-blur px-3.5 py-1.5 text-[10px] tracking-[0.16em] uppercase text-muted-foreground">
              Editorial imagery
            </figcaption>
          </figure>
        </div>
      </div>

      <div className="border-y border-border">
        <ul className="shell flex flex-wrap items-center justify-center gap-x-10 gap-y-3 py-6 text-center">
          {['Thoughtful Design', 'Jewellery for Every Occasion', 'Made to Be Remembered'].map((t) => (
            <li key={t} className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">{t}</li>
          ))}
        </ul>
      </div>
    </section>
  );
};
