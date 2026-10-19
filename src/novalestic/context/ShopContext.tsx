import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Product, CartItem } from "../types";
import { fetchPublishedProducts } from "../data/publishedProducts";

export type ProductsStatus = "loading" | "ready" | "error";

interface ShopContextType {
  products: Product[];
  productsStatus: ProductsStatus;
  productsError: string | null;
  reloadProducts: () => void;
  currentView: string;
  selectedProductId: string | null;
  navigateTo: (view: string, productId?: string) => void;
  formatPrice: (pricePKR: number) => string;
  cart: CartItem[];
  addToCart: (
    product: Product,
    quantity?: number,
    selectedMetal?: string,
    ringSize?: string,
  ) => void;
  removeFromCart: (productId: string, selectedMetal: string, ringSize?: string) => void;
  updateCartQuantity: (
    productId: string,
    selectedMetal: string,
    delta: number,
    ringSize?: string,
  ) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);
const STORAGE_KEY_CART = "nova_lestic_cart_pkr_v1";

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // The storefront shows only published catalogue items from the database.
  // No sample fixtures are shown as a fallback, so loading, empty and error stay distinct.
  const [products, setProducts] = useState<Product[]>([]);
  const [productsStatus, setProductsStatus] = useState<ProductsStatus>("loading");
  const [productsError, setProductsError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const reloadProducts = useCallback(() => setReloadKey((k) => k + 1), []);

  useEffect(() => {
    let active = true;
    setProductsStatus("loading");
    setProductsError(null);
    fetchPublishedProducts()
      .then((live) => {
        if (!active) return;
        setProducts(live);
        setProductsStatus("ready");
      })
      .catch((err: unknown) => {
        if (!active) return;
        setProductsError(err instanceof Error ? err.message : "Unable to load the collection.");
        setProductsStatus("error");
      });
    return () => {
      active = false;
    };
  }, [reloadKey]);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      if (typeof window === "undefined") return [];
      const saved = localStorage.getItem(STORAGE_KEY_CART);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Discard only legacy demo items; keep real saved cart items intact.
          return (parsed as CartItem[]).filter(
            (item) =>
              typeof item?.product?.id === "string" && !item.product.id.startsWith("sample-"),
          );
        }
      }
    } catch {
      // Start with an empty cart if browser storage is unavailable or invalid.
    }
    return [];
  });

  const [currentView, setCurrentView] = useState<string>("home");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleLocationChange = () => {
      if (typeof window === "undefined") return;
      const rawHash = window.location.hash.replace(/^#/, "");
      const [rawView = "", encodedProductId] = rawHash.split("/", 2);
      const view = rawView.toLowerCase();

      if (view === "product-detail") {
        setCurrentView(view);
        try {
          setSelectedProductId(encodedProductId ? decodeURIComponent(encodedProductId) : null);
        } catch {
          setSelectedProductId(null);
          setCurrentView("shop");
        }
        return;
      }

      const publicViews = [
        "home",
        "shop",
        "rings",
        "earrings",
        "necklaces",
        "bangles-bracelets",
        "cart",
        "contact",
        "privacy",
        "shipping",
        "returns",
        "terms",
      ];
      if (publicViews.includes(view)) {
        setCurrentView(view);
        setSelectedProductId(null);
      }
    };

    handleLocationChange();
    window.addEventListener("hashchange", handleLocationChange);
    window.addEventListener("popstate", handleLocationChange);
    return () => {
      window.removeEventListener("hashchange", handleLocationChange);
      window.removeEventListener("popstate", handleLocationChange);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cart));
    } catch {
      // Cart remains usable for the current session if storage is unavailable.
    }
  }, [cart]);

  const navigateTo = (view: string, productId?: string) => {
    const publicViews = [
      "home",
      "shop",
      "rings",
      "earrings",
      "necklaces",
      "bangles-bracelets",
      "product-detail",
      "cart",
      "contact",
      "privacy",
      "shipping",
      "returns",
      "terms",
    ];
    if (!publicViews.includes(view)) {
      setCurrentView("home");
      setSelectedProductId(null);
      return;
    }
    setCurrentView(view);
    setSelectedProductId(view === "product-detail" ? (productId ?? null) : null);
    if (typeof window !== "undefined") {
      const hash =
        view === "home"
          ? ""
          : view === "product-detail"
            ? `#product-detail/${encodeURIComponent(productId ?? "")}`
            : `#${view}`;
      if (window.location.hash !== hash) {
        window.history.pushState(
          null,
          "",
          `${window.location.pathname}${window.location.search}${hash}`,
        );
      }
      const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    }
  };

  const showToast = (msg: string) => setToastMessage(msg);

  useEffect(() => {
    if (!toastMessage) return undefined;
    const timer = window.setTimeout(() => setToastMessage(null), 3500);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const formatPrice = (pricePKR: number): string =>
    pricePKR > 0 ? `Rs. ${pricePKR.toLocaleString("en-PK")}` : "Price on enquiry";

  const addToCart = (
    product: Product,
    quantity = 1,
    selectedMetal = product.metal,
    ringSize?: string,
  ) => {
    const size = ringSize || (product.category === "rings" ? "Size 14 (Standard)" : undefined);
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedMetal === selectedMetal &&
          item.ringSize === size,
      );
      if (existingIdx > -1) {
        return prev.map((item, index) =>
          index === existingIdx
            ? { ...item, quantity: Math.min(99, item.quantity + Math.max(1, quantity)) }
            : item,
        );
      }
      return [
        ...prev,
        { product, quantity: Math.min(99, Math.max(1, quantity)), selectedMetal, ringSize: size },
      ];
    });
    showToast(`“${product.title}” added to cart.`);
  };

  const removeFromCart = (productId: string, selectedMetal: string, ringSize?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedMetal === selectedMetal &&
            (ringSize === undefined || item.ringSize === ringSize)
          ),
      ),
    );
    showToast("Item removed from cart.");
  };

  const updateCartQuantity = (
    productId: string,
    selectedMetal: string,
    delta: number,
    ringSize?: string,
  ) => {
    setCart((prev) =>
      prev
        .map((item) => {
          const matches =
            item.product.id === productId &&
            item.selectedMetal === selectedMetal &&
            (ringSize === undefined || item.ringSize === ringSize);
          if (!matches) return item;
          const quantity = Math.min(99, item.quantity + delta);
          return quantity > 0 ? { ...item, quantity } : null;
        })
        .filter((item): item is CartItem => item !== null),
    );
  };

  const clearCart = () => setCart([]);
  const cartTotal = cart.reduce((sum, item) => sum + item.product.pricePKR * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <ShopContext.Provider
      value={{
        products,
        productsStatus,
        productsError,
        reloadProducts,
        currentView,
        selectedProductId,
        navigateTo,
        formatPrice,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartCount,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error("useShop must be used within a ShopProvider");
  return context;
};
