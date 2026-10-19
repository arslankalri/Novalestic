import React from "react";
import { MessageCircle, ArrowUpRight } from "lucide-react";
import { useShop } from "../context/ShopContext";
import type { Product } from "../types";

/** Shared storefront card used by the home collection grid and the catalogue. */
export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { navigateTo } = useShop();
  const open = () => navigateTo("product-detail", product.id);

  return (
    <article className="group flex flex-col">
      <div className="relative w-full aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-secondary">
        <button
          type="button"
          onClick={open}
          className="block w-full h-full rounded-[1.25rem]"
          aria-label={`View details of ${product.title}`}
        >
          {product.image ? (
            <img
              alt={product.title}
              src={product.image}
              className="w-full h-full object-cover object-center transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
              loading="lazy"
            />
          ) : (
            <span
              className="flex w-full h-full items-center justify-center font-serif-luxury text-4xl text-champagne/60"
              aria-hidden="true"
            >
              N
            </span>
          )}
        </button>

        <span className="pointer-events-none absolute top-3 left-3 rounded-full bg-card/90 backdrop-blur px-3 py-1 text-[10px] font-medium tracking-[0.12em] uppercase text-muted-foreground">
          Price on enquiry
        </span>

        <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 transition-all duration-300 sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 sm:group-focus-within:translate-y-0 sm:group-focus-within:opacity-100">
          <a
            href={`https://wa.me/923019653550?text=${encodeURIComponent(`Hello NOVALESTIC JEWELLERS, I would like to enquire about ${product.title}. Please share the current price and availability.`)}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-emerald hover:bg-emerald-hover text-emerald-foreground py-2.5 text-xs font-semibold tracking-wide transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" /> Enquire
          </a>
          <button
            type="button"
            onClick={open}
            aria-label={`View details of ${product.title}`}
            className="w-10 h-10 shrink-0 rounded-full bg-card/95 backdrop-blur text-foreground hover:bg-card flex items-center justify-center transition-colors"
          >
            <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="pt-5 px-1 flex flex-col flex-grow">
        {product.metal && <span className="eyebrow text-[10px] mb-1.5">{product.metal}</span>}
        <button type="button" onClick={open} className="text-left rounded-sm">
          <h3 className="font-serif-luxury text-lg text-foreground leading-snug line-clamp-1 transition-colors group-hover:text-champagne">
            {product.title}
          </h3>
        </button>
        {product.shortDesc && (
          <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {product.shortDesc}
          </p>
        )}
        <p className="mt-3 text-sm font-medium text-emerald">Contact for price</p>
      </div>
    </article>
  );
};
