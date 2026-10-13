import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Product, Order } from '../types';
import {
  PlusCircle,
  Trash2,
  ArrowLeft,
  RotateCcw,
  Check,
  ShoppingBag,
  Eye,
  PackageCheck,
  TrendingUp,
  ShieldCheck,
  MapPin,
  Edit3,
  X,
  Share2,
  Copy,
  ExternalLink,
  Phone,
  MessageCircle,
  Globe,
  Lock,
  Mail,
  Download,
  Send,
  Smartphone,
  Save,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const ManageStoreView: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    resetDefaultProducts,
    formatPrice,
    navigateTo,
    orders,
    updateOrderStatus,
    setIsOwnerMode,
    showToast,
    ownerSettings,
    updateOwnerSettings,
    getOrderWhatsAppUrl,
    getOrderEmailUrl,
    getOrderGmailUrl,
    markOrderDelivered,
    deleteOrder,
    clearAllOrders,
    exportOrdersJSON,
  } = useShop();

  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'delivery-channels' | 'publishing' | 'analytics'>('orders');
  const [isAdding, setIsAdding] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Settings form states
  const [inputEmail, setInputEmail] = useState(ownerSettings.ownerEmail);
  const [inputWhatsApp, setInputWhatsApp] = useState(ownerSettings.ownerWhatsApp);
  const [autoPromptWA, setAutoPromptWA] = useState(ownerSettings.autoWhatsAppPrompt);

  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPricePKR, setEditPricePKR] = useState<number>(0);
  const [editMetal, setEditMetal] = useState('');
  const [editInStock, setEditInStock] = useState(true);
  const [editHallmarkBadge, setEditHallmarkBadge] = useState('');

  // New product form fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'rings' | 'earrings' | 'necklaces' | 'bangles-bracelets'>('rings');
  const [pricePKR, setPricePKR] = useState<number>(350000);
  const [metal, setMetal] = useState('18k Yellow Gold');
  const [carat, setCarat] = useState('2.5ct Natural Emerald');
  const [origin, setOrigin] = useState('Natural Certified Emerald');
  const [shortDesc, setShortDesc] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('https://lh3.googleusercontent.com/aida-public/AB6AXuAKyw8-mnzt9cB285WanV7WNdJogBmtek50VPEy9PvejmgD3uaq9eINzPa4I7KeFWjKwsfPFkHgQRQAH-agbWe3aj4f85ZEvdhKEV75FnHurvLQw7RLhgRkoCRTOc6UkyDy8fpAsBIIV9Ps_ikfBiwGDWSqrb2TKhHntmRQcL6XJnBOjl6UM8z3f27jl0BUlTxXKPBrhoOFbdAHIe-UUw5-pyNbF49jLl30eLzCfNy1U73vlOCDYIkh');
  const [hallmarkBadge, setHallmarkBadge] = useState('New Arrival');

  // Quick image presets for jewellery
  const sampleImages = [
    { label: 'Emerald Solitaire Ring', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKyw8-mnzt9cB285WanV7WNdJogBmtek50VPEy9PvejmgD3uaq9eINzPa4I7KeFWjKwsfPFkHgQRQAH-agbWe3aj4f85ZEvdhKEV75FnHurvLQw7RLhgRkoCRTOc6UkyDy8fpAsBIIV9Ps_ikfBiwGDWSqrb2TKhHntmRQcL6XJnBOjl6UM8z3f27jl0BUlTxXKPBrhoOFbdAHIe-UUw5-pyNbF49jLl30eLzCfNy1U73vlOCDYIkh' },
    { label: 'Emerald Drop Earrings', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRcymyOiMv32lVpJeJps0rTxubHLeLfWY1_Q4G93R4cLBOa2Vz64MVgTdDPNEPmn0gkcz5pwLImyGL5O5wLh5vEruyunMMahDjDq2hdN-iBg_jas15bw4PWqNiSIGfD6bUPeUvA7vsJUI5JVkcPuS1NPR5YZfMHzoT-D680FzUNp4qJPvsA0o-vsMcbJ27zMJev410X8DJx-YXRo-sChlH-X0KW4J7iDZp-XEARjp2wMuUSwjL15DN' },
    { label: 'Imperial Solitaire Pendant', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9FiqYgHxW8OiddAhm7FJHvhOgw5nCgSUcIntiRF4XkwLN4Y3i9A-UqLQtPkxHNgSt2aOSZNmjV4CkMknjSkTLUdUUkg8eDrE8JawNu5JJnS6h_KvPm3ioGIgp2WC36dJsiGhWSS2QOfNE-T_AGTnU_oRDTQsEDj1W68M4A-wClvZNHlDYnkiw6jVxANP-nm1-qiGgoAz9m0dmgec3GHS_C9HQUHtetiHE1Ok4-l3rsRryjYTyXDyw' },
    { label: 'Pavé Emerald & Diamond Band', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5byD9dRwnuowuRDcYjr1VpjQlWsiYzqCVwtZXdYIVI0zR90q4akLtco_3Wf9ZA4hzS0MkNXDoX2nFkuwphK6bvGZQquhW3UlRvBfIbOwvxWAT0q7WzuhV2smA_Umc4DnAUPrAtKSlpp08ahao50aP56ZF2gdTJ1mkPwUnbEt464iDQNhINUSRK8g4KzBXRttKhl7UzaXmqmZjGMhhqyO0oPGEwc8O7UfwE7Mgn5t_6V4lB41nbtW1' },
    { label: 'Master Goldsmith Creation', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATbrNDDgUvbtlj5TfbYI5RNSiv41CboO1jaOewtc2R8ArPI1QQ7DzlGivvl3kXNERLcDndb25j86lBGbIhU4m0vbMXgjg8m3C4AcunuB9pqZvDAFkbKI1ujHGXSevOa9D7qZmpObLlPtRP1OqoyZJgqEW70GK5qahQPtMUUKfwnUjX7kAV11gHEuNiI19R8po1TrBB4uSffIKqfpHUmioy_BzQYsCLRuZVBkJxUnhMjaoBtAxI5saL' },
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || pricePKR <= 0) return;

    addProduct({
      title,
      category,
      pricePKR,
      metal,
      availableMetals: [metal, '18k Champagne Gold', '18k White Gold'],
      carat,
      origin,
      cut: 'Precision Hand-Cut',
      clarity: 'Natural Vivid Green',
      dimensions: 'Custom Handcrafted Size',
      tag: metal,
      shortDesc: shortDesc || `${title} crafted in ${metal} with natural stones.`,
      description: description || `Handcrafted fine jewellery creation set in ${metal} featuring ${carat}. Thoroughly hallmarked and inspected.`,
      image: image || sampleImages[0].url,
      hallmarkBadge: hallmarkBadge || '18K Gold',
      inStock: true,
      featured: true,
    });

    // Reset form
    setTitle('');
    setShortDesc('');
    setDescription('');
    setIsAdding(false);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setEditTitle(product.title);
    setEditPricePKR(product.pricePKR);
    setEditMetal(product.metal);
    setEditInStock(product.inStock !== false);
    setEditHallmarkBadge(product.hallmarkBadge || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    updateProduct(editingProduct.id, {
      title: editTitle,
      pricePKR: editPricePKR,
      metal: editMetal,
      inStock: editInStock,
      hallmarkBadge: editHallmarkBadge,
    });

    setEditingProduct(null);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateOwnerSettings({
      ownerEmail: inputEmail,
      ownerWhatsApp: inputWhatsApp,
      autoWhatsAppPrompt: autoPromptWA,
    });
  };

  const publicStoreUrl = typeof window !== 'undefined'
    ? window.location.href.split('#')[0]
    : 'https://novalestic.pk';

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(publicStoreUrl);
      setCopiedLink(true);
      showToast('Customer Store link copied to clipboard!');
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Create a mock sample order to test dispatch
  const handleSendTestWhatsApp = () => {
    const sampleOrder: Order = {
      id: `TEST-ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      items: [
        {
          product: products[0] || {
            id: 'sample',
            title: 'The Sovereign Radiant Emerald Ring',
            category: 'rings',
            pricePKR: 850000,
            metal: '18k Yellow Gold',
            availableMetals: ['18k Yellow Gold'],
            carat: '3.50ct Natural Muzo Emerald',
            origin: 'Natural Certified',
            cut: 'Radiant',
            clarity: 'Vivid Green',
            dimensions: 'Standard',
            tag: 'Gold',
            shortDesc: 'Sample item',
            description: 'Sample',
            image: '',
            inStock: true,
            featured: true,
          },
          quantity: 1,
          selectedMetal: '18k Yellow Gold',
          ringSize: 'Size 14',
        },
      ],
      totalPKR: 850000,
      customerName: 'Test Customer',
      customerPhone: '0300 1234567',
      customerEmail: 'customer@example.com',
      city: 'Lahore',
      address: 'Gulberg III, Main Boulevard',
      paymentMethod: 'cod',
      createdAt: new Date().toLocaleDateString('en-PK'),
      status: 'Confirmed',
    };

    const url = getOrderWhatsAppUrl(sampleOrder);
    window.open(url, '_blank');
    showToast(`Test dispatch opened for ${ownerSettings.ownerWhatsApp}`);
  };

  const handleSendTestEmail = () => {
    const sampleOrder: Order = {
      id: `TEST-ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      items: [
        {
          product: products[0],
          quantity: 1,
          selectedMetal: '18k Yellow Gold',
          ringSize: 'Size 14',
        },
      ],
      totalPKR: 850000,
      customerName: 'Test Customer',
      customerPhone: '0300 1234567',
      customerEmail: 'customer@example.com',
      city: 'Lahore',
      address: 'Gulberg III, Main Boulevard',
      paymentMethod: 'cod',
      createdAt: new Date().toLocaleDateString('en-PK'),
      status: 'Confirmed',
    };

    const url = getOrderEmailUrl(sampleOrder);
    window.location.href = url;
    showToast(`Test email opened for ${ownerSettings.ownerEmail}`);
  };

  const totalStoreValuePKR = products.reduce((sum, p) => sum + p.pricePKR, 0);
  const totalRevenuePKR = orders.reduce((sum, o) => sum + o.totalPKR, 0);

  return (
    <div className="w-full bg-[#fbf9f4] min-h-screen pt-36 pb-24">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
        {/* Breadcrumb & Navigation Switcher */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#7f7575] uppercase tracking-wider">
            <button
              onClick={() => {
                setIsOwnerMode(false);
                navigateTo('home');
              }}
              className="hover:text-[#1b1c19] flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Customer Store</span>
            </button>
            <span>/</span>
            <span className="text-[#1b1c19] font-semibold">Store Management Portal (Owner End)</span>
          </div>

          <button
            onClick={() => {
              setIsOwnerMode(false);
              navigateTo('home');
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#15803d] text-white font-semibold uppercase tracking-wider text-[11px] hover:bg-[#166534] transition-colors shadow-xs"
          >
            <Eye className="w-4 h-4" />
            <span>View Published Customer Storefront</span>
          </button>
        </div>

        {/* Header Bar */}
        <div className="bg-[#F2EDE3] p-8 sm:p-10 border border-[#DFC27F]/40 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#9E7B32]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#765a18]">
                OWNER MANAGEMENT END
              </span>
            </div>
            <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#1b1c19] font-normal">
              Novalestic Store Administration
            </h1>
            <p className="text-xs text-[#4d4545] mt-1 max-w-2xl">
              All placed orders are stored permanently in your studio system and delivered directly to your own WhatsApp (<strong className="text-[#1b1c19]">{ownerSettings.ownerWhatsApp}</strong>) and Email (<strong className="text-[#1b1c19]">{ownerSettings.ownerEmail}</strong>).
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => {
                setActiveTab('inventory');
                setIsAdding(!isAdding);
              }}
              className="px-5 py-3 bg-[#1b1c19] hover:bg-[#9E7B32] text-white text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isAdding ? 'Close Form' : 'Add New Piece'}</span>
            </button>

            <button
              onClick={resetDefaultProducts}
              className="px-4 py-3 bg-[#f5f3ee] hover:bg-[#eae8e3] text-[#4d4545] text-xs font-semibold uppercase tracking-wider transition-colors border border-[#e4e2dd] flex items-center gap-1.5"
              title="Reset catalogue to default items"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
          </div>
        </div>

        {/* Portal Tabs */}
        <div className="flex border-b border-[#e4e2dd] mb-8 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 shrink-0 ${
              activeTab === 'orders'
                ? 'border-[#9E7B32] text-[#1b1c19] font-bold bg-[#F2EDE3]/50'
                : 'border-transparent text-[#7f7575] hover:text-[#1b1c19]'
            }`}
          >
            <PackageCheck className="w-4 h-4 text-[#15803d]" />
            <span>Stored Orders ({orders.length})</span>
            {orders.length > 0 && (
              <span className="bg-[#15803d] text-white text-[10px] px-2 py-0.5 rounded-full font-mono font-bold">
                {orders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('delivery-channels')}
            className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 shrink-0 ${
              activeTab === 'delivery-channels'
                ? 'border-[#9E7B32] text-[#1b1c19] font-bold bg-[#F2EDE3]/50'
                : 'border-transparent text-[#7f7575] hover:text-[#1b1c19]'
            }`}
          >
            <Send className="w-4 h-4 text-[#765a18]" />
            <span>Own WhatsApp &amp; Email Delivery</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 shrink-0 ${
              activeTab === 'inventory'
                ? 'border-[#9E7B32] text-[#1b1c19] font-bold bg-[#F2EDE3]/50'
                : 'border-transparent text-[#7f7575] hover:text-[#1b1c19]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Inventory ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('publishing')}
            className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 shrink-0 ${
              activeTab === 'publishing'
                ? 'border-[#9E7B32] text-[#1b1c19] font-bold bg-[#F2EDE3]/50'
                : 'border-transparent text-[#7f7575] hover:text-[#1b1c19]'
            }`}
          >
            <Globe className="w-4 h-4 text-[#15803d]" />
            <span>Customer End &amp; Publishing</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 shrink-0 ${
              activeTab === 'analytics'
                ? 'border-[#9E7B32] text-[#1b1c19] font-bold bg-[#F2EDE3]/50'
                : 'border-transparent text-[#7f7575] hover:text-[#1b1c19]'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Performance</span>
          </button>
        </div>

        {/* TAB 1: STORED ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Top Order Bar with Stats & Export */}
            <div className="bg-[#fbf9f4] border border-[#e4e2dd] p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif-luxury text-2xl text-[#1b1c19]">
                  Stored Customer Orders ({orders.length})
                </h3>
                <p className="text-xs text-[#7f7575] mt-0.5">
                  Every order submitted by buyers is stored in your studio database and delivered to your own WhatsApp &amp; Email.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={exportOrdersJSON}
                  disabled={orders.length === 0}
                  className="px-3.5 py-2 bg-[#F2EDE3] hover:bg-[#e4dcce] text-[#1b1c19] border border-[#DFC27F]/40 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 disabled:opacity-50"
                  title="Download all stored orders as a backup JSON file"
                >
                  <Download className="w-3.5 h-3.5 text-[#765a18]" />
                  <span>Export Backup</span>
                </button>

                {orders.length > 0 && (
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to clear stored order records?')) {
                        clearAllOrders();
                      }
                    }}
                    className="px-3.5 py-2 bg-white hover:bg-red-50 text-red-700 border border-red-200 text-xs font-semibold uppercase tracking-wider transition-colors"
                  >
                    Clear Records
                  </button>
                )}
              </div>
            </div>

            {/* Quick Delivery Channels Status Card */}
            <div className="bg-[#F2EDE3] border border-[#DFC27F]/50 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[#765a18] text-[11px]">
                  <Send className="w-3.5 h-3.5" />
                  <span>Active Order Delivery Routing</span>
                </div>
                <p className="text-[#4d4545]">
                  Incoming orders are transmitted directly to: WhatsApp <strong className="text-[#1b1c19]">{ownerSettings.ownerWhatsApp}</strong> • Email <strong className="text-[#1b1c19]">{ownerSettings.ownerEmail}</strong>
                </p>
              </div>

              <button
                onClick={() => setActiveTab('delivery-channels')}
                className="px-4 py-2 bg-[#1b1c19] text-white hover:bg-[#9E7B32] text-xs font-semibold uppercase tracking-wider transition-colors shrink-0 flex items-center gap-1.5 shadow-xs"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Configure My Channels</span>
              </button>
            </div>

            {/* Orders List */}
            {orders.length === 0 ? (
              <div className="text-center py-16 bg-[#f5f3ee] border border-[#e4e2dd]">
                <PackageCheck className="w-12 h-12 text-[#7f7575] mx-auto mb-3" />
                <h4 className="font-serif-luxury text-xl text-[#1b1c19] mb-1">
                  No Customer Orders Stored Yet
                </h4>
                <p className="text-xs text-[#4d4545] max-w-md mx-auto mb-6">
                  When customers purchase pieces on your published storefront, their orders will appear here for processing and dispatch to your WhatsApp and Email.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setIsOwnerMode(false);
                      navigateTo('shop');
                    }}
                    className="px-6 py-2.5 bg-[#1b1c19] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#9E7B32]"
                  >
                    Test Placing an Order as Customer
                  </button>
                  <button
                    onClick={handleSendTestWhatsApp}
                    className="px-6 py-2.5 bg-[#15803d] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#166534]"
                  >
                    Send Sample to My WhatsApp
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => {
                  const cleanPhone = order.customerPhone.replace(/[^0-9]/g, '');
                  const waNumber = cleanPhone.startsWith('0') ? `92${cleanPhone.slice(1)}` : cleanPhone;
                  const customerWhatsAppUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
                    `Assalam o Alaikum ${order.customerName}, this is Novalestic Jewellers regarding your order #${order.id}.`
                  )}`;
                  const ownerWhatsAppUrl = getOrderWhatsAppUrl(order);
                  const ownerEmailUrl = getOrderEmailUrl(order);

                  return (
                    <div key={order.id} className="border border-[#e4e2dd] bg-[#fbf9f4] p-6 shadow-sm">
                      {/* Order Header */}
                      <div className="flex flex-col lg:flex-row justify-between lg:items-center pb-4 border-b border-[#e4e2dd] gap-3 mb-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="font-mono font-bold text-base text-[#1b1c19]">#{order.id}</span>
                            <span className="text-xs text-[#7f7575]">Placed on {order.createdAt}</span>
                            <span className="bg-[#E8F4F0] text-[#15803d] text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                              {order.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-xs">
                            <span className="font-semibold text-[#1b1c19]">{order.customerName}</span>
                            <span className="text-[#DFC27F]">•</span>
                            <span className="text-[#765a18] font-mono">{order.customerPhone}</span>
                            <span className="text-[#DFC27F]">•</span>
                            <span className="text-[#7f7575]">{order.customerEmail}</span>
                          </div>
                        </div>

                        {/* Order Status Dropdown */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#7f7575] uppercase font-semibold">Status:</span>
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                            className="bg-[#F2EDE3] border border-[#DFC27F]/40 text-xs font-bold text-[#1b1c19] px-3 py-1.5 focus:outline-none"
                          >
                            <option value="Confirmed">Confirmed</option>
                            <option value="Processing">Processing / Bench Crafting</option>
                            <option value="Dispatched">Dispatched (Courier Transit)</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="divide-y divide-[#e4e2dd]/60 mb-4">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-3">
                              <img alt="" src={item.product.image} className="w-12 h-14 object-cover bg-[#eae8e3] border border-[#e4e2dd]" />
                              <div>
                                <p className="font-semibold text-[#1b1c19]">{item.product.title}</p>
                                <p className="text-[#7f7575]">{item.selectedMetal} {item.ringSize ? `• ${item.ringSize}` : ''} • Qty: {item.quantity}</p>
                              </div>
                            </div>
                            <span className="font-mono font-medium">{formatPrice(item.product.pricePKR * item.quantity)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Customer Details Footer */}
                      <div className="bg-[#f5f3ee] p-4 text-xs text-[#4d4545] border border-[#e4e2dd] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                        <div>
                          <strong className="text-[#1b1c19]">Destination:</strong> {order.address}, {order.city}
                        </div>
                        <div>
                          <strong className="text-[#1b1c19]">Payment:</strong>{' '}
                          <span className="uppercase font-semibold text-[#765a18]">
                            {order.paymentMethod === 'cod'
                              ? 'Cash on Delivery (COD)'
                              : order.paymentMethod === 'bank_transfer'
                              ? 'Bank Wire Transfer'
                              : 'Online Card'}
                          </span>
                        </div>
                        <div className="sm:text-right">
                          <strong className="block text-[#1b1c19] mb-0.5">Total Amount:</strong>
                          <span className="font-serif-luxury text-base font-bold text-[#1b1c19]">
                            {formatPrice(order.totalPKR)}
                          </span>
                        </div>
                      </div>

                      {/* Direct Delivery Actions Row */}
                      <div className="pt-3 border-t border-[#e4e2dd] flex flex-wrap items-center justify-between gap-3 text-xs">
                        <span className="text-[11px] text-[#7f7575]">
                          Order Channels: <strong className="text-[#15803d]">Owner WhatsApp</strong> &amp; <strong className="text-[#15803d]">Owner Email</strong>
                        </span>

                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Deliver to My WhatsApp */}
                          <a
                            href={ownerWhatsAppUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => markOrderDelivered(order.id, 'whatsapp')}
                            className="px-3 py-1.5 bg-[#15803d] hover:bg-[#166534] text-white text-[11px] font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-xs"
                            title="Deliver order details directly to your WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Forward to My WhatsApp</span>
                          </a>

                          {/* Deliver to My Email */}
                          <a
                            href={ownerEmailUrl}
                            onClick={() => markOrderDelivered(order.id, 'email')}
                            className="px-3 py-1.5 bg-white hover:bg-[#eae8e3] text-[#1b1c19] border border-[#DFC27F]/60 text-[11px] font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-xs"
                            title="Deliver order details directly to your Email"
                          >
                            <Mail className="w-3.5 h-3.5 text-[#765a18]" />
                            <span>Forward to My Email</span>
                          </a>

                          {/* Gmail Web Compose */}
                          <a
                            href={getOrderGmailUrl(order)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => markOrderDelivered(order.id, 'email')}
                            className="px-2.5 py-1.5 bg-[#F2EDE3] hover:bg-[#eae0d0] text-[#765a18] border border-[#DFC27F]/40 text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center gap-1"
                            title="Open direct compose in Gmail Web"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Gmail</span>
                          </a>

                          {/* WhatsApp Customer */}
                          <a
                            href={customerWhatsAppUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-[#f5f3ee] hover:bg-[#eae0d0] text-[#4d4545] border border-[#e4e2dd] text-[11px] font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5"
                            title="Open direct chat with customer"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Contact Customer</span>
                          </a>

                          {/* Delete Order from records */}
                          <button
                            onClick={() => {
                              if (confirm(`Delete order #${order.id} from studio records?`)) {
                                deleteOrder(order.id);
                              }
                            }}
                            className="p-1.5 text-[#7f7575] hover:text-rose-600 transition-colors ml-auto"
                            title="Delete order"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: OWN WHATSAPP & EMAIL DELIVERY CHANNELS */}
        {activeTab === 'delivery-channels' && (
          <div className="space-y-8">
            <div className="bg-[#F2EDE3] p-8 sm:p-10 border border-[#DFC27F]/50 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#15803d]" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#765a18]">
                  OWN NOTIFICATION &amp; DISPATCH CHANNELS
                </span>
              </div>

              <h2 className="font-serif-luxury text-3xl text-[#1b1c19] font-normal mb-3">
                Order Delivery: Only Your Own Email &amp; WhatsApp
              </h2>

              <p className="text-sm text-[#4d4545] leading-relaxed max-w-3xl mb-8">
                Whenever a customer places an order on your published store, the order is stored permanently in your studio records and transmitted directly to your personal WhatsApp and your own Email.
              </p>

              {/* Settings Form */}
              <form onSubmit={handleSaveSettings} className="bg-white p-6 sm:p-8 border border-[#DFC27F]/50 max-w-2xl space-y-6">
                <div>
                  <label className="block text-xs uppercase font-bold text-[#1b1c19] tracking-wider mb-2">
                    Your Receiving Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#765a18] absolute left-3 top-3.5" />
                    <input
                      type="email"
                      required
                      value={inputEmail}
                      onChange={(e) => setInputEmail(e.target.value)}
                      placeholder="arslankalri@gmail.com"
                      className="w-full bg-[#fbf9f4] border border-[#e4e2dd] p-3 pl-10 text-sm font-semibold text-[#1b1c19] focus:border-[#9E7B32] focus:outline-none"
                    />
                  </div>
                  <span className="text-[11px] text-[#7f7575] mt-1 block">
                    Every order notification and customer receipt will be routed to this email address.
                  </span>
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-[#1b1c19] tracking-wider mb-2">
                    Your Receiving WhatsApp Number *
                  </label>
                  <div className="relative">
                    <MessageCircle className="w-4 h-4 text-[#15803d] absolute left-3 top-3.5" />
                    <input
                      type="text"
                      required
                      value={inputWhatsApp}
                      onChange={(e) => setInputWhatsApp(e.target.value)}
                      placeholder="+923001234567"
                      className="w-full bg-[#fbf9f4] border border-[#e4e2dd] p-3 pl-10 text-sm font-semibold font-mono text-[#1b1c19] focus:border-[#9E7B32] focus:outline-none"
                    />
                  </div>
                  <span className="text-[11px] text-[#7f7575] mt-1 block">
                    Use full international format for Pakistan (e.g., +923001234567 or 03001234567).
                  </span>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="autoPrompt"
                    checked={autoPromptWA}
                    onChange={(e) => setAutoPromptWA(e.target.checked)}
                    className="w-4 h-4 accent-[#15803d]"
                  />
                  <label htmlFor="autoPrompt" className="text-xs font-semibold text-[#1b1c19] cursor-pointer">
                    Automatically prompt order transmission to your WhatsApp on checkout completion
                  </label>
                </div>

                <div className="pt-4 border-t border-[#e4e2dd] flex items-center justify-between">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#1b1c19] hover:bg-[#9E7B32] text-white text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-xs"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Delivery Channels</span>
                  </button>
                </div>
              </form>

              {/* Instant Test Buttons */}
              <div className="mt-8 pt-6 border-t border-[#DFC27F]/40 max-w-2xl">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#765a18] block mb-3">
                  Test Your Direct Order Delivery Channels:
                </span>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={handleSendTestWhatsApp}
                    className="px-5 py-3 bg-[#15803d] hover:bg-[#166534] text-white text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send Test Dispatch to My WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSendTestEmail}
                    className="px-5 py-3 bg-white hover:bg-[#eae8e3] text-[#1b1c19] border border-[#DFC27F]/60 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Mail className="w-4 h-4 text-[#765a18]" />
                    <span>Send Test Dispatch to My Email</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: INVENTORY */}
        {activeTab === 'inventory' && (
          <div>
            {/* Add Product Drawer / Panel */}
            {isAdding && (
              <form
                onSubmit={handleCreate}
                className="bg-[#fbf9f4] p-8 border-2 border-[#9E7B32] shadow-xl mb-12 space-y-6 animate-in fade-in duration-200"
              >
                <div className="border-b border-[#DFC27F]/40 pb-3 flex items-center justify-between">
                  <h3 className="font-serif-luxury text-xl text-[#1b1c19] font-medium">
                    Add a New Jewellery Piece to Store
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="text-xs text-[#7f7575] hover:text-[#1b1c19] uppercase tracking-wider font-semibold"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title */}
                  <div>
                    <label className="block text-xs uppercase font-semibold text-[#1b1c19] tracking-wider mb-2">
                      Piece Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. The Imperial Radiant Emerald Ring"
                      className="w-full bg-white border border-[#e4e2dd] p-3 text-sm focus:border-[#9E7B32] focus:outline-none"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-xs uppercase font-semibold text-[#1b1c19] tracking-wider mb-2">
                      Store Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full bg-white border border-[#e4e2dd] p-3 text-sm focus:border-[#9E7B32] focus:outline-none"
                    >
                      <option value="rings">Rings (Solitaires &amp; Bands)</option>
                      <option value="earrings">Earrings (Drops &amp; Chandeliers)</option>
                      <option value="necklaces">Necklaces (Pendants &amp; Colliers)</option>
                      <option value="bangles-bracelets">Bangles &amp; Bracelets</option>
                    </select>
                  </div>

                  {/* Price in PKR */}
                  <div>
                    <label className="block text-xs uppercase font-semibold text-[#1b1c19] tracking-wider mb-2">
                      Price in Pakistani Rupees (PKR ₨) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-sm font-semibold text-[#765a18]">
                        Rs.
                      </span>
                      <input
                        type="number"
                        required
                        min={1000}
                        step={5000}
                        value={pricePKR}
                        onChange={(e) => setPricePKR(Number(e.target.value))}
                        className="w-full bg-white border border-[#e4e2dd] p-3 pl-12 text-sm font-semibold focus:border-[#9E7B32] focus:outline-none"
                      />
                    </div>
                    <span className="text-[11px] text-[#7f7575] mt-1 block">
                      Preview: {formatPrice(pricePKR)}
                    </span>
                  </div>

                  {/* Metal Type */}
                  <div>
                    <label className="block text-xs uppercase font-semibold text-[#1b1c19] tracking-wider mb-2">
                      Metal &amp; Purity
                    </label>
                    <input
                      type="text"
                      value={metal}
                      onChange={(e) => setMetal(e.target.value)}
                      placeholder="e.g. 18k Yellow Gold / 18k White Gold"
                      className="w-full bg-white border border-[#e4e2dd] p-3 text-sm focus:border-[#9E7B32] focus:outline-none"
                    />
                  </div>

                  {/* Gemstone / Carat */}
                  <div>
                    <label className="block text-xs uppercase font-semibold text-[#1b1c19] tracking-wider mb-2">
                      Gemstone &amp; Carat Weight
                    </label>
                    <input
                      type="text"
                      value={carat}
                      onChange={(e) => setCarat(e.target.value)}
                      placeholder="e.g. 3.20ct Natural Vivid Green Emerald"
                      className="w-full bg-white border border-[#e4e2dd] p-3 text-sm focus:border-[#9E7B32] focus:outline-none"
                    />
                  </div>

                  {/* Hallmark Tag */}
                  <div>
                    <label className="block text-xs uppercase font-semibold text-[#1b1c19] tracking-wider mb-2">
                      Badge / Hallmark Label
                    </label>
                    <input
                      type="text"
                      value={hallmarkBadge}
                      onChange={(e) => setHallmarkBadge(e.target.value)}
                      placeholder="e.g. Natural Certified Muzo Emerald / 18k Assay"
                      className="w-full bg-white border border-[#e4e2dd] p-3 text-sm focus:border-[#9E7B32] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Short Description */}
                <div>
                  <label className="block text-xs uppercase font-semibold text-[#1b1c19] tracking-wider mb-2">
                    Short Summary (Catalog display)
                  </label>
                  <input
                    type="text"
                    value={shortDesc}
                    onChange={(e) => setShortDesc(e.target.value)}
                    placeholder="e.g. Master-crafted 18k yellow gold emerald solitaire ring featuring custom double prongs."
                    className="w-full bg-white border border-[#e4e2dd] p-3 text-sm focus:border-[#9E7B32] focus:outline-none"
                  />
                </div>

                {/* Detailed Description */}
                <div>
                  <label className="block text-xs uppercase font-semibold text-[#1b1c19] tracking-wider mb-2">
                    Full Description &amp; Craft Details
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detailed craftsmanship notes, hallmark certificate specifics, and gem clarity notes."
                    className="w-full bg-white border border-[#e4e2dd] p-3 text-sm focus:border-[#9E7B32] focus:outline-none"
                  />
                </div>

                {/* Image Selection */}
                <div>
                  <label className="block text-xs uppercase font-semibold text-[#1b1c19] tracking-wider mb-2">
                    Product Photography URL
                  </label>
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-white border border-[#e4e2dd] p-3 text-sm focus:border-[#9E7B32] focus:outline-none mb-3"
                  />

                  {/* Quick Preset Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] text-[#7f7575] font-semibold uppercase tracking-wider mr-1">
                      Quick Jewellery Presets:
                    </span>
                    {sampleImages.map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setImage(s.url)}
                        className={`text-[11px] px-2.5 py-1 border transition-colors ${
                          image === s.url
                            ? 'bg-[#9E7B32] text-white border-[#9E7B32]'
                            : 'bg-[#F2EDE3] text-[#4d4545] border-[#DFC27F]/40 hover:bg-[#e6dece]'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>

                  {/* Live Thumbnail Preview */}
                  {image && (
                    <div className="mt-4 flex items-center gap-3 p-3 bg-[#F2EDE3] border border-[#DFC27F]/30 max-w-sm">
                      <img alt="Preview" src={image} className="w-16 h-20 object-cover bg-white border border-[#e4e2dd]" />
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#765a18] block">Live Photo Preview</span>
                        <span className="text-xs text-[#1b1c19] font-medium line-clamp-1">{title || 'Your piece'}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Form Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-[#DFC27F]/40">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="px-6 py-3 border border-[#e4e2dd] text-xs font-semibold uppercase tracking-wider text-[#4d4545] hover:bg-[#eae8e3]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-[#1b1c19] text-white hover:bg-[#9E7B32] text-xs font-semibold uppercase tracking-wider transition-colors shadow-md flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Piece to Store</span>
                  </button>
                </div>
              </form>
            )}

            {/* Inventory List */}
            <div className="bg-[#fbf9f4] border border-[#e4e2dd] shadow-sm">
              <div className="p-4 bg-[#F2EDE3] border-b border-[#e4e2dd] flex items-center justify-between">
                <h3 className="font-serif-luxury text-lg text-[#1b1c19] font-medium">
                  Current Store Inventory ({products.length} Items)
                </h3>
                <span className="text-xs text-[#765a18] font-semibold">
                  Live in Online Shop
                </span>
              </div>

              <div className="divide-y divide-[#e4e2dd]">
                {products.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[#f5f3ee] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        alt={item.title}
                        src={item.image}
                        className="w-16 h-20 object-cover bg-[#eae8e3] border border-[#e4e2dd] shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-[#765a18] bg-[#F2EDE3] px-2 py-0.5 border border-[#DFC27F]/30">
                            {item.category}
                          </span>
                          {item.hallmarkBadge && (
                            <span className="text-[10px] text-[#15803d] font-semibold">
                              {item.hallmarkBadge}
                            </span>
                          )}
                          {item.inStock === false && (
                            <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 font-bold uppercase tracking-wider">
                              Sold Out
                            </span>
                          )}
                        </div>
                        <h4 className="font-serif-luxury text-base font-semibold text-[#1b1c19]">
                          {item.title}
                        </h4>
                        <p className="text-xs text-[#7f7575] mt-0.5">
                          {item.metal} • {item.carat}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-[#e4e2dd]">
                      <div className="text-right">
                        <span className="text-[10px] uppercase text-[#7f7575] block font-medium">Price</span>
                        <span className="font-serif-luxury text-base font-bold text-[#1b1c19] tabular-nums">
                          {formatPrice(item.pricePKR)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Edit Button */}
                        <button
                          onClick={() => openEditModal(item)}
                          className="px-3 py-1.5 bg-[#F2EDE3] hover:bg-[#e4dcce] text-xs font-semibold text-[#765a18] border border-[#DFC27F]/50 transition-colors flex items-center gap-1"
                          title="Edit price and details"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsOwnerMode(false);
                            navigateTo('product-detail', item.id);
                          }}
                          className="px-3 py-1.5 bg-[#f5f3ee] hover:bg-[#eae8e3] text-xs text-[#1b1c19] border border-[#e4e2dd] transition-colors"
                          title="View product on customer end"
                        >
                          View in Shop
                        </button>

                        <button
                          onClick={() => deleteProduct(item.id)}
                          className="p-2 text-[#7f7575] hover:text-[#ba1a1a] transition-colors"
                          title="Delete piece from store"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CUSTOMER END & PUBLISHING GUIDE */}
        {activeTab === 'publishing' && (
          <div className="space-y-8">
            <div className="bg-[#F2EDE3] border border-[#DFC27F]/50 p-8 sm:p-10 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#15803d]" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#765a18]">
                  CUSTOMER END VS OWNER END
                </span>
              </div>

              <h2 className="font-serif-luxury text-3xl text-[#1b1c19] font-normal mb-3">
                How Your Published Jewellery Store Works
              </h2>

              <p className="text-sm text-[#4d4545] leading-relaxed max-w-3xl mb-6">
                You have two distinct sides: your <strong className="text-[#1b1c19]">Customer End</strong> (published to buyers across Pakistan), and this <strong className="text-[#1b1c19]">Owner End</strong> (your private order storage and inventory console).
              </p>

              {/* Public Store URL Box */}
              <div className="bg-white p-5 border border-[#DFC27F]/60 max-w-2xl mb-8">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#765a18] mb-2">
                  Published Customer Storefront Link:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={publicStoreUrl}
                    className="w-full bg-[#fbf9f4] px-3 py-2.5 text-xs font-mono border border-[#e4e2dd] text-[#1b1c19] select-all focus:outline-none"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-5 py-2.5 bg-[#1b1c19] hover:bg-[#9E7B32] text-white text-xs font-semibold uppercase tracking-wider transition-colors shrink-0 flex items-center gap-2"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-[#22c55e]" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-[#7f7575] mt-2">
                  Share this link with your customers on WhatsApp, Instagram, or Facebook. When they open it, they land directly on the Customer Storefront.
                </p>
              </div>

              {/* Two End Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 border-2 border-[#15803d]/40 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-[#e4e2dd] mb-4">
                    <div className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-[#15803d]" />
                      <h4 className="font-serif-luxury text-lg font-bold text-[#1b1c19]">
                        1. Customer End (Published)
                      </h4>
                    </div>
                    <span className="text-[10px] bg-[#E8F4F0] text-[#15803d] font-bold px-2 py-0.5 uppercase tracking-wider">
                      Public to Buyers
                    </span>
                  </div>

                  <p className="text-xs text-[#4d4545] leading-relaxed mb-4">
                    This is what visiting buyers in Pakistan experience:
                  </p>

                  <ul className="text-xs text-[#4d4545] space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#15803d] shrink-0 mt-0.5" />
                      <span><strong>Complete Storefront:</strong> Hero campaign, curated collections (Rings, Earrings, Necklaces, Bangles).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#15803d] shrink-0 mt-0.5" />
                      <span><strong>Pakistani Rupee Pricing:</strong> Every item shown in PKR (₨) with hallmarking specifications.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#15803d] shrink-0 mt-0.5" />
                      <span><strong>Product Pages:</strong> High-res images, ring size selection, and WhatsApp inquiry buttons.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#15803d] shrink-0 mt-0.5" />
                      <span><strong>Shopping Bag &amp; Checkout:</strong> Cash on Delivery across Pakistani cities (Lahore, Karachi, Islamabad, etc.) &amp; Bank Transfer.</span>
                    </li>
                  </ul>

                  <button
                    onClick={() => {
                      setIsOwnerMode(false);
                      navigateTo('home');
                    }}
                    className="w-full py-3 bg-[#15803d] hover:bg-[#166534] text-white text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Customer Storefront Live</span>
                  </button>
                </div>

                <div className="bg-white p-6 border-2 border-[#9E7B32]/40 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-[#e4e2dd] mb-4">
                    <div className="flex items-center gap-2">
                      <Lock className="w-5 h-5 text-[#765a18]" />
                      <h4 className="font-serif-luxury text-lg font-bold text-[#1b1c19]">
                        2. Owner End (Private Portal)
                      </h4>
                    </div>
                    <span className="text-[10px] bg-[#F2EDE3] text-[#765a18] font-bold px-2 py-0.5 uppercase tracking-wider">
                      Private to You
                    </span>
                  </div>

                  <p className="text-xs text-[#4d4545] leading-relaxed mb-4">
                    This is your personal management console to run your store:
                  </p>

                  <ul className="text-xs text-[#4d4545] space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#765a18] shrink-0 mt-0.5" />
                      <span><strong>Order Storage:</strong> All placed orders are stored permanently with buyer name, phone, address and total.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#765a18] shrink-0 mt-0.5" />
                      <span><strong>Direct Delivery Channels:</strong> Orders are routed directly to your own WhatsApp and Email only.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#765a18] shrink-0 mt-0.5" />
                      <span><strong>Inventory &amp; Pricing:</strong> Add, edit &amp; delete jewellery pieces in PKR.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#765a18] shrink-0 mt-0.5" />
                      <span><strong>Quick Access:</strong> Return here anytime via the top mode switcher or the Owner Login in the footer.</span>
                    </li>
                  </ul>

                  <button
                    onClick={() => setActiveTab('inventory')}
                    className="w-full py-3 bg-[#1b1c19] hover:bg-[#9E7B32] text-white text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Manage Inventory &amp; Add Pieces</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: STORE PERFORMANCE */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-[#fbf9f4] p-6 border border-[#e4e2dd] shadow-xs">
                <span className="text-[10px] uppercase font-bold text-[#7f7575] tracking-wider block mb-1">
                  Total Active Catalogue
                </span>
                <p className="font-serif-luxury text-4xl font-normal text-[#1b1c19]">
                  {products.length} <span className="text-sm font-sans text-[#765a18]">Pieces</span>
                </p>
                <p className="text-xs text-[#7f7575] mt-2">Active in public customer shop</p>
              </div>

              <div className="bg-[#fbf9f4] p-6 border border-[#e4e2dd] shadow-xs">
                <span className="text-[10px] uppercase font-bold text-[#7f7575] tracking-wider block mb-1">
                  Total Storefront Inventory Value
                </span>
                <p className="font-serif-luxury text-3xl font-bold text-[#1b1c19] tabular-nums">
                  {formatPrice(totalStoreValuePKR)}
                </p>
                <p className="text-xs text-[#7f7575] mt-2">Calculated in Pakistani Rupees</p>
              </div>

              <div className="bg-[#fbf9f4] p-6 border border-[#e4e2dd] shadow-xs">
                <span className="text-[10px] uppercase font-bold text-[#7f7575] tracking-wider block mb-1">
                  Recorded Order Revenue
                </span>
                <p className="font-serif-luxury text-3xl font-bold text-[#15803d] tabular-nums">
                  {formatPrice(totalRevenuePKR)}
                </p>
                <p className="text-xs text-[#7f7575] mt-2">{orders.length} orders stored in studio records</p>
              </div>
            </div>

            <div className="bg-[#F2EDE3] p-8 border border-[#DFC27F]/40">
              <h3 className="font-serif-luxury text-xl text-[#1b1c19] mb-2 font-medium">
                Storefront &amp; Order Delivery Readiness
              </h3>
              <p className="text-xs text-[#4d4545] mb-6">
                Your store is live and operational. When customers visit your website, they experience the published storefront with seamless navigation, and all orders are routed directly to your personal WhatsApp and Email.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="flex items-start gap-2 bg-[#fbf9f4] p-4 border border-[#e4e2dd]">
                  <Check className="w-4 h-4 text-[#15803d] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#1b1c19]">Order Storage Active</strong>
                    <span className="text-[#4d4545]">Every placed order is stored with complete customer and jewellery details.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#fbf9f4] p-4 border border-[#e4e2dd]">
                  <Check className="w-4 h-4 text-[#15803d] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#1b1c19]">Direct Delivery to Your Channels</strong>
                    <span className="text-[#4d4545]">Orders are routed to your WhatsApp ({ownerSettings.ownerWhatsApp}) and Email ({ownerSettings.ownerEmail}).</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* EDIT PRODUCT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveEdit}
            className="bg-[#fbf9f4] border-2 border-[#9E7B32] max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-[#1b1c19] space-y-4 animate-in fade-in zoom-in-95 duration-200"
          >
            <button
              type="button"
              onClick={() => setEditingProduct(null)}
              className="absolute top-4 right-4 p-1.5 text-[#7f7575] hover:text-[#1b1c19]"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#765a18] block">
              QUICK EDIT PRODUCT
            </span>
            <h3 className="font-serif-luxury text-2xl text-[#1b1c19] font-normal">
              Edit Jewellery Piece Details
            </h3>

            <div>
              <label className="block text-xs uppercase font-semibold text-[#1b1c19] tracking-wider mb-1.5">
                Piece Title
              </label>
              <input
                type="text"
                required
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full bg-white border border-[#e4e2dd] p-2.5 text-sm focus:border-[#9E7B32] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-semibold text-[#1b1c19] tracking-wider mb-1.5">
                Price in Pakistani Rupees (PKR)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm font-semibold text-[#765a18]">
                  Rs.
                </span>
                <input
                  type="number"
                  required
                  min={1000}
                  step={5000}
                  value={editPricePKR}
                  onChange={(e) => setEditPricePKR(Number(e.target.value))}
                  className="w-full bg-white border border-[#e4e2dd] p-2.5 pl-12 text-sm font-bold focus:border-[#9E7B32] focus:outline-none"
                />
              </div>
              <span className="text-[11px] text-[#7f7575] mt-1 block">
                Formatted: {formatPrice(editPricePKR)}
              </span>
            </div>

            <div>
              <label className="block text-xs uppercase font-semibold text-[#1b1c19] tracking-wider mb-1.5">
                Metal Description
              </label>
              <input
                type="text"
                value={editMetal}
                onChange={(e) => setEditMetal(e.target.value)}
                className="w-full bg-white border border-[#e4e2dd] p-2.5 text-sm focus:border-[#9E7B32] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-semibold text-[#1b1c19] tracking-wider mb-1.5">
                Hallmark / Badge
              </label>
              <input
                type="text"
                value={editHallmarkBadge}
                onChange={(e) => setEditHallmarkBadge(e.target.value)}
                className="w-full bg-white border border-[#e4e2dd] p-2.5 text-sm focus:border-[#9E7B32] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="editInStock"
                checked={editInStock}
                onChange={(e) => setEditInStock(e.target.checked)}
                className="w-4 h-4 accent-[#15803d]"
              />
              <label htmlFor="editInStock" className="text-xs font-semibold text-[#1b1c19] cursor-pointer">
                In Stock &amp; Available for Purchase
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-[#e4e2dd]">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 border border-[#e4e2dd] text-xs font-semibold uppercase tracking-wider text-[#4d4545] hover:bg-[#eae8e3]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#1b1c19] hover:bg-[#9E7B32] text-white text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
