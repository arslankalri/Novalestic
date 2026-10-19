import React from "react";
import { ShopProvider, useShop } from "./context/ShopContext";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { CatalogView } from "./components/CatalogView";
import { ProductDetailView } from "./components/ProductDetailView";
import { CartView } from "./components/CartView";
import { ContactView } from "./components/ContactView";
import { PolicyView } from "./components/PolicyView";
import { NotificationToast } from "./components/NotificationToast";

const AppContent: React.FC = () => {
  const { currentView, selectedProductId } = useShop();

  const renderCurrentView = () => {
    switch (currentView) {
      case "shop":
      case "home":
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
      case "privacy":
        return <PolicyView kind="privacy" />;
      case "shipping":
        return <PolicyView kind="shipping" />;
      case "returns":
        return <PolicyView kind="returns" />;
      case "terms":
        return <PolicyView kind="terms" />;
      default:
        return <CatalogView category="all" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <div className="flex-grow">{renderCurrentView()}</div>
      <Footer />
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
