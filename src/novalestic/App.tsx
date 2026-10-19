/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from "react";
import { ShopProvider, useShop } from "./context/ShopContext";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { HeroSection } from "./components/HeroSection";
import { CuratedCategories } from "./components/CuratedCategories";
import { BestsellingGrid } from "./components/BestsellingGrid";
import { CraftsmanshipSection } from "./components/CraftsmanshipSection";
import { CatalogView } from "./components/CatalogView";
import { ProductDetailView } from "./components/ProductDetailView";
import { CartView } from "./components/CartView";
import { ContactView } from "./components/ContactView";
import { NotificationToast } from "./components/NotificationToast";

const AppContent: React.FC = () => {
  const { currentView, selectedProductId, products } = useShop();

  useEffect(() => {
    const product = products.find((item) => item.id === selectedProductId);
    const titles: Record<string, string> = {
      home: "Fine Gemstone Jewellery",
      shop: "All Jewellery",
      rings: "Rings",
      earrings: "Earrings",
      necklaces: "Necklaces & Pendants",
      "bangles-bracelets": "Bangles & Bracelets",
      cart: "Shopping Bag",
      contact: "Contact Us",
    };
    const pageTitle =
      currentView === "product-detail"
        ? product?.title ?? "Jewellery Piece"
        : titles[currentView] ?? "Fine Gemstone Jewellery";
    document.title =
      currentView === "home" || currentView === "product-detail" && !product
        ? "Novalestic Jewellers — Fine Gemstone Jewellery"
        : `${pageTitle} | Novalestic Jewellers`;
  }, [currentView, selectedProductId, products]);

  const renderCurrentView = () => {
    switch (currentView) {
      case "shop":
        return <CatalogView category="all" />;
      case "rings":
        return <CatalogView category="rings" />;
      case "earrings":
        return <CatalogView category="earrings" />;
      case "necklaces":
        return <CatalogView category="necklaces" />;
      case "bangles-bracelets":
        return <CatalogView category="bangles-bracelets" />;

      case "product-detail":
        return <ProductDetailView productId={selectedProductId ?? ""} />;

      case "cart":
        return <CartView />;
      case "contact":
        return <ContactView />;

      case "home":
      default:
        return (
          <main className="w-full bg-background">
            {/* 1. Hero Campaign Section */}
            <HeroSection />

            {/* 2. Curated Categories Vitrine */}
            <CuratedCategories />

            {/* 3. Bestselling High Jewellery Icons */}
            <BestsellingGrid />

            {/* 4. Four Decades of Gemstone Mastery */}
            <CraftsmanshipSection />
          </main>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Top Header */}
      <Header />

      {/* Main Dynamic View Content */}
      <div className="flex-grow">{renderCurrentView()}</div>

      {/* Footer */}
      <Footer />

      {/* Toast Notification */}
      <NotificationToast />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}
