import React, { useState } from "react";
import { useShop } from "../context/ShopContext";
import { ProductCard } from "./ProductCard";
import { CollectionEmpty, CollectionError, CollectionLoading } from "./CollectionState";

export const BestsellingGrid: React.FC = () => {
  const { products, productsStatus } = useShop();
  const [activeTab, setActiveTab] = useState<
    "all" | "rings" | "earrings" | "necklaces" | "bangles-bracelets"
  >("all");

  const filterTabs = [
    { id: "all", label: "All Pieces" },
    { id: "rings", label: "Rings" },
    { id: "earrings", label: "Earrings" },
    { id: "necklaces", label: "Necklaces" },
    { id: "bangles-bracelets", label: "Bangles & Bracelets" },
  ] as const;

  const filteredProducts = products.filter((item) => {
    if (activeTab === "all") return true;
    return item.category === activeTab;
  });

  const showTabs = productsStatus === "ready" && products.length > 0;

  return (
    <section
      className="w-full py-20 lg:py-28 bg-secondary/60"
      id="bestselling-section"
      aria-labelledby="collection-heading"
    >
      <div className="shell">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-8">
          <div>
            <p className="eyebrow mb-3">The Collection</p>
            <h2
              id="collection-heading"
              className="font-serif-luxury text-3xl sm:text-5xl text-foreground tracking-tight"
            >
              Explore the Collection
            </h2>
          </div>

          {showTabs && (
            <div
              role="group"
              aria-label="Filter by category"
              className="flex flex-wrap gap-1.5 rounded-full bg-card p-1.5 shadow-soft w-fit"
            >
              {filterTabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    aria-pressed={isActive}
                    className={`rounded-full px-4 py-2 text-xs font-medium tracking-wide transition-colors duration-200 ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {productsStatus === "loading" && <CollectionLoading />}
        {productsStatus === "error" && <CollectionError />}
        {productsStatus === "ready" && products.length === 0 && <CollectionEmpty />}

        {productsStatus === "ready" && products.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {filteredProducts.length === 0 && (
              <p className="mt-4 text-center text-sm text-muted-foreground" role="status">
                No pieces are available in this category yet.
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
};
