import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';

interface ShopContextType {
  products: Product[];
  currentView: string;
  selectedProductId: string | null;
  navigateTo: (view: string, productId?: string) => void;
  formatPrice: (pricePKR: number) => string;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedMetal?: string, ringSize?: string) => void;
  removeFromCart: (productId: string, selectedMetal: string, ringSize?: string) => void;
  updateCartQuantity: (productId: string, selectedMetal: string, delta: number, ringSize?: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);
const STORAGE_KEY_CART = 'nova_lestic_cart_pkr_v1';

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Public storefront catalogue is intentionally read-only. A separate, authenticated
  // admin portal can be added later without exposing management controls in this app.
  const products = INITIAL_PRODUCTS;

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      if (typeof window === 'undefined') return [];
      const saved = localStorage.getItem(STORAGE_KEY_CART);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const publicProductIds = new Set(INITIAL_PRODUCTS.map((product) => product.id));
          return (parsed as CartItem[]).filter((item) => publicProductIds.has(item?.product?.id));
        }
      }
    } catch {
      // Start with an empty cart if browser storage is unavailable or invalid.
    }
    return [];
  });

  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Remove legacy browser-only admin/order records from previous prototype versions.
  // This public app no longer reads or writes those stores.
  useEffect(() => {
    try {
      localStorage.removeItem('nova_lestic_products_pkr_v1');
      localStorage.removeItem('nova_lestic_orders_pkr_v1');
      localStorage.removeItem('nova_lestic_settings_v1');
      localStorage.removeItem('nova_lestic_is_owner_mode');
    } catch {
      // The storefront remains usable if browser storage is unavailable.
    }
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      if (typeof window === 'undefined') return;
      const hash = window.location.hash.toLowerCase().replace(/^#/, '');
      const publicViews = ['home', 'shop', 'rings', 'earrings', 'necklaces', 'bangles-bracelets', 'cart', 'contact'];
      if (publicViews.includes(hash)) setCurrentView(hash);
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cart));
    } catch {
      // Cart remains usable for the current session if storage is unavailable.
    }
  }, [cart]);

  const navigateTo = (view: string, productId?: string) => {
    const publicViews = ['home', 'shop', 'rings', 'earrings', 'necklaces', 'bangles-bracelets', 'product-detail', 'cart', 'contact'];
    if (!publicViews.includes(view)) {
      setCurrentView('home');
      setSelectedProductId(null);
      return;
    }
    setCurrentView(view);
    setSelectedProductId(view === 'product-detail' ? (productId ?? null) : null);
    if (typeof window !== 'undefined') {
      const hash = view === 'home' ? '' : `#${view}`;
      if (window.location.hash !== hash) window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${hash}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const showToast = (msg: string) => setToastMessage(msg);

  useEffect(() => {
    if (!toastMessage) return undefined;
    const timer = window.setTimeout(() => setToastMessage(null), 3500);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const formatPrice = (pricePKR: number): string => `Rs. ${pricePKR.toLocaleString('en-PK')}`;

  const addToCart = (product: Product, quantity = 1, selectedMetal = product.metal, ringSize?: string) => {
    const size = ringSize || (product.category === 'rings' ? 'Size 14 (Standard)' : undefined);
    setCart((prev) => {
      const existingIdx = prev.findIndex((item) =>
        item.product.id === product.id && item.selectedMetal === selectedMetal && item.ringSize === size
      );
      if (existingIdx > -1) {
        return prev.map((item, index) => index === existingIdx
          ? { ...item, quantity: Math.min(99, item.quantity + Math.max(1, quantity)) }
          : item);
      }
      return [...prev, { product, quantity: Math.min(99, Math.max(1, quantity)), selectedMetal, ringSize: size }];
    });
    showToast(`“${product.title}” added to cart.`);
  };

  const removeFromCart = (productId: string, selectedMetal: string, ringSize?: string) => {
    setCart((prev) => prev.filter((item) => !(
      item.product.id === productId &&
      item.selectedMetal === selectedMetal &&
      (ringSize === undefined || item.ringSize === ringSize)
    )));
    showToast('Item removed from cart.');
  };

  const updateCartQuantity = (productId: string, selectedMetal: string, delta: number, ringSize?: string) => {
    setCart((prev) => prev
      .map((item) => {
        const matches = item.product.id === productId &&
          item.selectedMetal === selectedMetal &&
          (ringSize === undefined || item.ringSize === ringSize);
        if (!matches) return item;
        const quantity = Math.min(99, item.quantity + delta);
        return quantity > 0 ? { ...item, quantity } : null;
      })
      .filter((item): item is CartItem => item !== null));
  };

  const clearCart = () => setCart([]);
  const cartTotal = cart.reduce((sum, item) => sum + item.product.pricePKR * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <ShopContext.Provider value={{
      products, currentView, selectedProductId, navigateTo, formatPrice,
      cart, addToCart, removeFromCart, updateCartQuantity, clearCart,
      cartTotal, cartCount, toastMessage, showToast,
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used within a ShopProvider');
  return context;
};
