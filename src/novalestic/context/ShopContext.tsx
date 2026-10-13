import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, StoreSettings } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';

interface ShopContextType {
  products: Product[];
  currentView: string;
  selectedProductId: string | null;
  navigateTo: (view: string, productId?: string) => void;
  formatPrice: (pricePKR: number) => string;
  // Owner / Admin Portal mode vs Published Customer mode
  isOwnerMode: boolean;
  setIsOwnerMode: (mode: boolean) => void;
  updateOrderStatus: (orderId: string, status: 'Confirmed' | 'Processing' | 'Dispatched' | 'Delivered') => void;
  // Store management
  addProduct: (product: Omit<Product, 'id'>) => void;
  deleteProduct: (id: string) => void;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  resetDefaultProducts: () => void;
  // Shopping Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedMetal?: string, ringSize?: string) => void;
  removeFromCart: (productId: string, selectedMetal: string) => void;
  updateCartQuantity: (productId: string, selectedMetal: string, delta: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  // Orders & Delivery to Owner WhatsApp & Email
  orders: Order[];
  placeOrder: (details: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    city: string;
    address: string;
    paymentMethod: 'cod' | 'bank_transfer' | 'card';
  }) => Order;
  ownerSettings: StoreSettings;
  updateOwnerSettings: (newSettings: Partial<StoreSettings>) => void;
  generateOrderMessage: (order: Order) => string;
  getOrderWhatsAppUrl: (order: Order) => string;
  getOrderEmailUrl: (order: Order) => string;
  getOrderGmailUrl: (order: Order) => string;
  markOrderDelivered: (orderId: string, channel: 'whatsapp' | 'email') => void;
  deleteOrder: (orderId: string) => void;
  clearAllOrders: () => void;
  exportOrdersJSON: () => void;
  // Toast notifications
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const STORAGE_KEY_PRODUCTS = 'nova_lestic_products_pkr_v1';
const STORAGE_KEY_CART = 'nova_lestic_cart_pkr_v1';
const STORAGE_KEY_ORDERS = 'nova_lestic_orders_pkr_v1';
const STORAGE_KEY_SETTINGS = 'nova_lestic_settings_v1';

const DEFAULT_SETTINGS: StoreSettings = {
  ownerEmail: 'arslankalri@gmail.com',
  ownerWhatsApp: '+923001234567',
  businessName: 'Novalestic Jewellers',
  autoWhatsAppPrompt: true,
};

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Products list from local storage or defaults
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PRODUCTS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return INITIAL_PRODUCTS;
  });

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CART);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return [];
  });

  // Stored orders state
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ORDERS);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return [];
  });

  // Owner store delivery settings (Email & WhatsApp)
  const [ownerSettings, setOwnerSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_SETTINGS;
  });

  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [isOwnerMode, setIsOwnerMode] = useState<boolean>(() => {
    try {
      if (typeof window !== 'undefined' && window.location.hash) {
        const hash = window.location.hash.toLowerCase();
        if (hash === '#admin' || hash === '#manage' || hash === '#owner') return true;
        if (hash === '#store' || hash === '#customer' || hash === '#shop') return false;
      }
      const saved = localStorage.getItem('nova_lestic_is_owner_mode');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  // Listen to hash changes for deep linking
  useEffect(() => {
    const handleHashChange = () => {
      if (typeof window === 'undefined') return;
      const hash = window.location.hash.toLowerCase();
      if (hash === '#admin' || hash === '#manage' || hash === '#owner') {
        setIsOwnerMode(true);
        setCurrentView('manage-store');
      } else if (hash === '#customer' || hash === '#home') {
        setIsOwnerMode(false);
        setCurrentView('home');
      } else if (hash === '#shop' || hash === '#rings' || hash === '#earrings' || hash === '#necklaces') {
        setIsOwnerMode(false);
        setCurrentView(hash.replace('#', ''));
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const toggleOwnerMode = (mode: boolean) => {
    setIsOwnerMode(mode);
    try {
      localStorage.setItem('nova_lestic_is_owner_mode', String(mode));
    } catch {
      // Ignore
    }
    if (mode) {
      if (typeof window !== 'undefined') {
        window.location.hash = 'admin';
      }
      showToast('Switched to Owner Management Portal');
    } else {
      if (typeof window !== 'undefined' && window.location.hash === '#admin') {
        window.location.hash = '';
      }
      showToast('Viewing Published Customer Storefront');
      if (currentView === 'manage-store') {
        setCurrentView('home');
      }
    }
  };

  const updateOrderStatus = (orderId: string, status: 'Confirmed' | 'Processing' | 'Dispatched' | 'Delivered') => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
    );
    showToast(`Order #${orderId} status updated to ${status}`);
  };

  const updateOwnerSettings = (newSettings: Partial<StoreSettings>) => {
    setOwnerSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
    showToast('Store delivery channels updated.');
  };

  // Sync products to storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
    } catch {
      // Ignore
    }
  }, [products]);

  // Sync cart to storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cart));
    } catch {
      // Ignore
    }
  }, [cart]);

  // Sync orders to storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
    } catch {
      // Ignore
    }
  }, [orders]);

  const navigateTo = (view: string, productId?: string) => {
    setCurrentView(view);
    if (productId) {
      setSelectedProductId(productId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Format Pakistani Rupees with standard comma grouping
  const formatPrice = (pricePKR: number): string => {
    return `Rs. ${pricePKR.toLocaleString('en-PK')}`;
  };

  // Add product to store inventory
  const addProduct = (newProduct: Omit<Product, 'id'>) => {
    const id = `item-${Date.now()}`;
    const product: Product = {
      ...newProduct,
      id,
    };
    setProducts((prev) => [product, ...prev]);
    showToast(`Added “${product.title}” to your store collection.`);
  };

  // Update existing product
  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
    );
    showToast('Jewellery piece updated successfully.');
  };

  // Delete product
  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Jewellery piece removed from store.');
  };

  // Reset to default sample catalogue
  const resetDefaultProducts = () => {
    setProducts(INITIAL_PRODUCTS);
    showToast('Restored default catalogue.');
  };

  // Cart operations
  const addToCart = (
    product: Product,
    quantity = 1,
    selectedMetal = product.metal,
    ringSize?: string
  ) => {
    const size = ringSize || (product.category === 'rings' ? 'Size 14 (Standard)' : undefined);

    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedMetal === selectedMetal && item.ringSize === size
      );
      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].quantity += quantity;
        return next;
      }
      return [
        ...prev,
        {
          product,
          quantity,
          selectedMetal,
          ringSize: size,
        },
      ];
    });

    showToast(`“${product.title}” added to cart.`);
  };

  const removeFromCart = (productId: string, selectedMetal: string) => {
    setCart((prev) => prev.filter((i) => !(i.product.id === productId && i.selectedMetal === selectedMetal)));
    showToast('Item removed from cart.');
  };

  const updateCartQuantity = (productId: string, selectedMetal: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId && item.selectedMetal === selectedMetal) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product.pricePKR * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Generate standardized order message for WhatsApp and Email delivery
  const generateOrderMessage = (order: Order): string => {
    const paymentLabel =
      order.paymentMethod === 'cod'
        ? 'Cash on Delivery (COD)'
        : order.paymentMethod === 'bank_transfer'
        ? 'Direct Bank Wire Transfer'
        : 'Credit / Debit Card';

    const itemsText = order.items
      .map(
        (item, idx) =>
          `${idx + 1}. ${item.product.title}\n   • Metal: ${item.selectedMetal}${
            item.ringSize ? ` | Size: ${item.ringSize}` : ''
          }\n   • Qty: ${item.quantity} × Rs. ${item.product.pricePKR.toLocaleString('en-PK')}\n   • Subtotal: Rs. ${(
            item.product.pricePKR * item.quantity
          ).toLocaleString('en-PK')}`
      )
      .join('\n\n');

    return `💎 *NEW ORDER NOTIFICATION - NOVALESTIC JEWELLERS* 💎\n\n` +
      `📋 *Order ID:* #${order.id}\n` +
      `📅 *Date:* ${order.createdAt}\n\n` +
      `👤 *CUSTOMER DETAILS:*\n` +
      `• Name: ${order.customerName}\n` +
      `• Phone / WhatsApp: ${order.customerPhone}\n` +
      `• Email: ${order.customerEmail}\n` +
      `• Delivery City: ${order.city}\n` +
      `• Street Address: ${order.address}\n` +
      `• Payment Mode: ${paymentLabel}\n\n` +
      `📦 *ORDERED JEWELLERY PIECES (${order.items.length}):*\n` +
      `${itemsText}\n\n` +
      `💰 *TOTAL PAYABLE VALUE:* Rs. ${order.totalPKR.toLocaleString('en-PK')}\n\n` +
      `🚚 *Status:* Insured Courier Delivery Across Pakistan\n` +
      `✨ *Action:* Please confirm order dispatch with customer at ${order.customerPhone}.`;
  };

  // Generate WhatsApp direct delivery URL targeting OWNER's phone
  const getOrderWhatsAppUrl = (order: Order): string => {
    const cleanPhone = ownerSettings.ownerWhatsApp.replace(/[^0-9]/g, '');
    const waNumber = cleanPhone.startsWith('0') ? `92${cleanPhone.slice(1)}` : cleanPhone;
    const msg = generateOrderMessage(order);
    return `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;
  };

  // Generate Email direct delivery URL targeting OWNER's email
  const getOrderEmailUrl = (order: Order): string => {
    const subject = `[NEW JEWELLERY ORDER] #${order.id} - ${order.customerName} (Rs. ${order.totalPKR.toLocaleString('en-PK')})`;
    const body = generateOrderMessage(order);
    return `mailto:${ownerSettings.ownerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  // Direct Gmail web compose link for owner email
  const getOrderGmailUrl = (order: Order): string => {
    const subject = `[NEW JEWELLERY ORDER] #${order.id} - ${order.customerName} (Rs. ${order.totalPKR.toLocaleString('en-PK')})`;
    const body = generateOrderMessage(order);
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(ownerSettings.ownerEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const markOrderDelivered = (orderId: string, channel: 'whatsapp' | 'email') => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            ...(channel === 'whatsapp' ? { deliveredToWhatsApp: true } : { deliveredToEmail: true }),
          };
        }
        return ord;
      })
    );
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    showToast(`Order #${orderId} deleted from store records.`);
  };

  const clearAllOrders = () => {
    setOrders([]);
    showToast('Order history cleared.');
  };

  const exportOrdersJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(orders, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `novalestic_orders_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Exported orders backup file.');
  };

  // Place order (stores permanently in orders list and returns order object)
  const placeOrder = (details: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    city: string;
    address: string;
    paymentMethod: 'cod' | 'bank_transfer' | 'card';
  }): Order => {
    const newOrder: Order = {
      id: `NL-PK-${Math.floor(100000 + Math.random() * 900000)}`,
      items: [...cart],
      totalPKR: cartTotal,
      customerName: details.customerName,
      customerPhone: details.customerPhone,
      customerEmail: details.customerEmail,
      city: details.city,
      address: details.address,
      paymentMethod: details.paymentMethod,
      createdAt: new Date().toLocaleDateString('en-PK', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      status: 'Confirmed',
      deliveredToWhatsApp: false,
      deliveredToEmail: false,
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    showToast(`Order #${newOrder.id} successfully recorded!`);
    return newOrder;
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        currentView,
        selectedProductId,
        navigateTo,
        formatPrice,
        isOwnerMode,
        setIsOwnerMode: toggleOwnerMode,
        updateOrderStatus,
        addProduct,
        deleteProduct,
        updateProduct,
        resetDefaultProducts,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartCount,
        orders,
        placeOrder,
        ownerSettings,
        updateOwnerSettings,
        generateOrderMessage,
        getOrderWhatsAppUrl,
        getOrderEmailUrl,
        getOrderGmailUrl,
        markOrderDelivered,
        deleteOrder,
        clearAllOrders,
        exportOrdersJSON,
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
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
