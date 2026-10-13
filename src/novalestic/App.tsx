/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { CuratedCategories } from './components/CuratedCategories';
import { BestsellingGrid } from './components/BestsellingGrid';
import { CraftsmanshipSection } from './components/CraftsmanshipSection';
import { GuaranteesSection } from './components/GuaranteesSection';
import { NewsletterSection } from './components/NewsletterSection';
import { CatalogView } from './components/CatalogView';
import { ProductDetailView } from './components/ProductDetailView';
import { CartView } from './components/CartView';
import { NotificationToast } from './components/NotificationToast';

const AppContent: React.FC = () => {
  const { currentView, selectedProductId } = useShop();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'shop':
        return <CatalogView category="all" />;
      case 'rings':
        return <CatalogView category="rings" />;
      case 'earrings':
        return <CatalogView category="earrings" />;
      case 'necklaces':
        return <CatalogView category="necklaces" />;
      case 'bangles-bracelets':
        return <CatalogView category="bangles-bracelets" />;

      case 'product-detail':
        return <ProductDetailView productId={selectedProductId || 'sample-ring'} />;

      case 'cart':
        return <CartView />;

      case 'home':
      default:
        return (
          <main className="w-full bg-[#fbf9f4]">
            {/* 1. Hero Campaign Section */}
            <HeroSection />

            {/* 2. Curated Categories Vitrine */}
            <CuratedCategories />

            {/* 3. Bestselling High Jewellery Icons */}
            <BestsellingGrid />

            {/* 4. Four Decades of Gemstone Mastery */}
            <CraftsmanshipSection />

            {/* 5. Authentic Quality & Purity Guarantees (No fake reviews) */}
            <GuaranteesSection />

            {/* 6. Store Updates Newsletter */}
            <NewsletterSection />
          </main>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fbf9f4] text-[#1b1c19] selection:bg-[#fed88a] selection:text-[#785d1b]">
      {/* Top Header */}
      <Header />

      {/* Main Dynamic View Content */}
      <div className="flex-grow">
        {renderCurrentView()}
      </div>

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
