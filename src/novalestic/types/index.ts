export type CategorySlug = 'all' | 'rings' | 'earrings' | 'necklaces' | 'bangles-bracelets';

export interface Product {
  id: string;
  title: string;
  category: 'rings' | 'earrings' | 'necklaces' | 'bangles-bracelets';
  pricePKR: number;
  hallmarkBadge?: string;
  metal: string;
  availableMetals: string[];
  carat: string;
  origin: string;
  cut: string;
  clarity: string;
  dimensions: string;
  tag: string;
  shortDesc: string;
  description: string;
  image: string;
  inStock: boolean;
  featured: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedMetal: string;
  ringSize?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  totalPKR: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  city: string;
  address: string;
  paymentMethod: 'cod' | 'bank_transfer' | 'card';
  createdAt: string;
  status: 'Confirmed' | 'Processing' | 'Dispatched' | 'Delivered';
  deliveredToWhatsApp?: boolean;
  deliveredToEmail?: boolean;
  notes?: string;
}

export interface StoreSettings {
  ownerEmail: string;
  ownerWhatsApp: string;
  businessName: string;
  autoWhatsAppPrompt: boolean;
}
