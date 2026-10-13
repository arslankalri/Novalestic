import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Order } from '../types';
import { Trash2, ShoppingBag, ArrowLeft, Check, MessageCircle, Mail, ExternalLink, Send, Info } from 'lucide-react';

export const CartView: React.FC = () => {
  const {
    cart,
    cartTotal,
    formatPrice,
    removeFromCart,
    updateCartQuantity,
    placeOrder,
    navigateTo,
    ownerSettings,
    getOrderWhatsAppUrl,
    getOrderEmailUrl,
    getOrderGmailUrl,
    markOrderDelivered,
  } = useShop();

  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [city, setCity] = useState('Lahore');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank_transfer' | 'card'>('cod');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [sentToWhatsApp, setSentToWhatsApp] = useState(false);
  const [sentToEmail, setSentToEmail] = useState(false);

  const pakistaniCities = [
    'Lahore',
    'Karachi',
    'Islamabad',
    'Rawalpindi',
    'Faisalabad',
    'Multan',
    'Peshawar',
    'Quetta',
    'Sialkot',
    'Gujranwala',
    'Hyderabad',
    'Abbottabad',
    'Other City',
  ];

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !address) return;

    const order = placeOrder({
      customerName,
      customerPhone,
      customerEmail: customerEmail || 'client@novalestic.pk',
      city,
      address,
      paymentMethod,
    });

    setConfirmedOrder(order);
    setCheckoutStep('success');

    // Auto-prompt / trigger delivery to owner's WhatsApp if enabled
    if (ownerSettings.autoWhatsAppPrompt) {
      setTimeout(() => {
        const waUrl = getOrderWhatsAppUrl(order);
        if (typeof window !== 'undefined') {
          window.open(waUrl, '_blank');
          setSentToWhatsApp(true);
          // Opening WhatsApp does not confirm that a message was sent.
        }
      }, 700);
    }
  };

  const handleDeliverToWhatsApp = () => {
    if (!confirmedOrder) return;
    const waUrl = getOrderWhatsAppUrl(confirmedOrder);
    window.open(waUrl, '_blank');
    setSentToWhatsApp(true);
    // Opening WhatsApp does not confirm that a message was sent.
  };

  const handleDeliverToEmail = () => {
    if (!confirmedOrder) return;
    const mailUrl = getOrderEmailUrl(confirmedOrder);
    window.location.href = mailUrl;
    setSentToEmail(true);
    // Opening an email draft does not confirm that a message was sent.
  };

  return (
    <div className="w-full bg-[#fbf9f4] min-h-screen pt-36 pb-24">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs text-[#7f7575] uppercase tracking-wider">
          <button
            onClick={() => navigateTo('home')}
            className="hover:text-[#1b1c19] flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
          <span>/</span>
          <span className="text-[#1b1c19] font-semibold">Shopping Cart &amp; Checkout</span>
        </div>

        {checkoutStep === 'success' && confirmedOrder ? (
          <div className="bg-[#fbf9f4] border border-[#DFC27F]/40 p-8 sm:p-14 text-center max-w-2xl mx-auto shadow-xl">
            <div className="w-16 h-16 rounded-full bg-[#E8F4F0] text-[#15803d] mx-auto flex items-center justify-center mb-6">
              <Check className="w-9 h-9" />
            </div>

            <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#765a18] block mb-2">
              SAMPLE CHECKOUT PREVIEW
            </span>

            <h2 className="font-serif-luxury text-3xl text-[#1b1c19] font-normal mb-3">
              Thank You for Your Order
            </h2>

            <p className="text-sm text-[#4d4545] leading-relaxed mb-6">
              Your jewellery order <strong className="text-[#1b1c19]">#{confirmedOrder.id}</strong> has been stored securely in our system. Order details are being routed to our studio for insured packing and dispatch.
            </p>

            {/* Direct Delivery to Owner WhatsApp & Email Box */}
            <div className="bg-[#F2EDE3] border-2 border-[#DFC27F]/60 p-6 mb-8 text-left space-y-4">
              <div className="flex items-center justify-between border-b border-[#DFC27F]/30 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#765a18] block">
                    DIRECT OWNER TRANSMISSION
                  </span>
                  <h4 className="font-serif-luxury text-base font-semibold text-[#1b1c19]">
                    Deliver Order to Novalestic Studio
                  </h4>
                </div>
                <span className="text-[10px] bg-[#15803d]/15 text-[#15803d] px-2.5 py-1 font-semibold uppercase tracking-wider">
                  Live Dispatch
                </span>
              </div>

              <p className="text-xs text-[#4d4545] leading-relaxed">
                Use these links to open a message draft. You must send the message yourself; nothing is automatically delivered.
              </p>

              {/* Delivery Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* 1. WhatsApp to Owner */}
                <button
                  type="button"
                  onClick={handleDeliverToWhatsApp}
                  className={`w-full py-3 px-4 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-xs ${
                    sentToWhatsApp
                      ? 'bg-[#15803d] text-white'
                      : 'bg-[#15803d] hover:bg-[#166534] text-white'
                  }`}
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span>
                    {sentToWhatsApp ? 'WhatsApp opened — send message' : 'Open WhatsApp message'}
                  </span>
                </button>

                {/* 2. Email to Owner (Mail client + Gmail web option) */}
                <div className="flex flex-col gap-1.5">
                  <button
                    type="button"
                    onClick={handleDeliverToEmail}
                    className={`w-full py-3 px-4 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 border shadow-xs ${
                      sentToEmail
                        ? 'bg-[#1b1c19] text-white border-[#1b1c19]'
                        : 'bg-white hover:bg-[#eae8e3] text-[#1b1c19] border-[#DFC27F]/60'
                    }`}
                  >
                    <Mail className="w-4 h-4 text-[#765a18] shrink-0" />
                    <span>
                      {sentToEmail ? 'Email opened — send message' : 'Open email draft'}
                    </span>
                  </button>
                  {confirmedOrder && (
                    <a
                      href={getOrderGmailUrl(confirmedOrder)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        setSentToEmail(true);
                        markOrderDelivered(confirmedOrder.id, 'email');
                      }}
                      className="text-[10px] text-[#765a18] hover:underline text-center block"
                    >
                      Or Open Direct in Gmail Web →
                    </a>
                  )}
                </div>
              </div>

              <div className="text-[11px] text-[#765a18] pt-2 border-t border-[#DFC27F]/20 flex items-center justify-between">
                <span>Receiving Email: <strong>{ownerSettings.ownerEmail}</strong></span>
                <span>WhatsApp: <strong>{ownerSettings.ownerWhatsApp}</strong></span>
              </div>
            </div>

            {/* Stored Order Details Receipt */}
            <div className="bg-white p-4 text-xs space-y-2 border border-[#e4e2dd] mb-8 max-w-md mx-auto text-left">
              <div className="flex justify-between border-b border-[#e4e2dd] pb-2">
                <span className="text-[#7f7575]">Order ID:</span>
                <span className="font-mono font-bold text-[#1b1c19]">#{confirmedOrder.id}</span>
              </div>
              <div className="flex justify-between border-b border-[#e4e2dd] pb-2">
                <span className="text-[#7f7575]">Customer:</span>
                <span className="text-[#1b1c19] font-medium">{confirmedOrder.customerName} ({confirmedOrder.customerPhone})</span>
              </div>
              <div className="flex justify-between border-b border-[#e4e2dd] pb-2">
                <span className="text-[#7f7575]">Delivery Destination:</span>
                <span className="text-[#1b1c19] font-medium">{confirmedOrder.address}, {confirmedOrder.city}</span>
              </div>
              <div className="flex justify-between border-b border-[#e4e2dd] pb-2">
                <span className="text-[#7f7575]">Payment Method:</span>
                <span className="text-[#1b1c19] font-medium uppercase">
                  {confirmedOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : confirmedOrder.paymentMethod === 'bank_transfer' ? 'Direct Bank Wire' : 'Credit / Debit Card'}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#e4e2dd] pb-2">
                <span className="text-[#7f7575]">Total Amount:</span>
                <span className="font-serif-luxury font-bold text-sm text-[#1b1c19]">
                  {formatPrice(confirmedOrder.totalPKR)}
                </span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-[#7f7575]">Delivery Status:</span>
                <span className="text-[#15803d] font-bold">Stored in Studio Records</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => navigateTo('shop')}
                className="px-8 py-3.5 bg-[#1b1c19] text-white hover:bg-[#9E7B32] text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => navigateTo('orders')}
                className="px-8 py-3.5 bg-[#f5f3ee] text-[#1b1c19] border border-[#e4e2dd] text-xs font-semibold uppercase tracking-wider hover:bg-[#eae8e3] transition-colors"
              >
                View Stored Orders
              </button>
            </div>
          </div>
        ) : cart.length === 0 ? (
          <div className="bg-[#F2EDE3] p-12 sm:p-16 text-center border border-[#DFC27F]/30 max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#fbf9f4] flex items-center justify-center mx-auto mb-4 text-[#7f7575]">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="font-serif-luxury text-2xl text-[#1b1c19] mb-2 font-normal">
              Your Shopping Cart is Empty
            </h2>
            <p className="text-xs text-[#4d4545] max-w-md mx-auto mb-6">
              Explore our emerald and gold jewellery collection in Pakistani Rupees to add items to your cart.
            </p>
            <button
              onClick={() => navigateTo('shop')}
              className="px-8 py-3.5 bg-[#1b1c19] text-white hover:bg-[#9E7B32] text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
            >
              Browse Jewellery
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Cart Items or Checkout Form */}
            <div className="lg:col-span-7 space-y-6">
              {checkoutStep === 'cart' ? (
                <div className="bg-[#fbf9f4] border border-[#e4e2dd] p-6 shadow-sm">
                  <div className="border-b border-[#e4e2dd] pb-4 mb-4 flex justify-between items-center">
                    <h2 className="font-serif-luxury text-2xl text-[#1b1c19] font-normal">
                      Shopping Cart ({cart.length} Pieces)
                    </h2>
                    <span className="text-xs text-[#765a18] font-semibold">
                      Prices in PKR (₨)
                    </span>
                  </div>

                  <div className="divide-y divide-[#e4e2dd]">
                    {cart.map((item, idx) => (
                      <div
                        key={`${item.product.id}-${item.selectedMetal}-${idx}`}
                        className="py-4 flex gap-4 items-center justify-between"
                      >
                        <div className="flex gap-4 items-center">
                          <img
                            alt={item.product.title}
                            src={item.product.image}
                            className="w-16 h-20 object-cover bg-[#eae8e3] border border-[#e4e2dd] shrink-0"
                          />
                          <div>
                            <h4 className="font-serif-luxury text-base font-semibold text-[#1b1c19]">
                              {item.product.title}
                            </h4>
                            <p className="text-xs text-[#7f7575] mt-0.5">
                              {item.selectedMetal} {item.ringSize ? `• ${item.ringSize}` : ''}
                            </p>
                            <p className="font-serif text-sm font-bold text-[#1b1c19] mt-1">
                              {formatPrice(item.product.pricePKR)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center border border-[#e4e2dd] bg-[#f5f3ee] text-xs">
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.selectedMetal, -1)}
                              className="px-2.5 py-1 text-[#4d4545] hover:bg-[#eae8e3]"
                            >
                              -
                            </button>
                            <span className="px-2.5 py-1 font-bold">{item.quantity}</span>
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.selectedMetal, 1)}
                              className="px-2.5 py-1 text-[#4d4545] hover:bg-[#eae8e3]"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.product.id, item.selectedMetal)}
                            className="text-[#7f7575] hover:text-[#ba1a1a] transition-colors p-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-[#e4e2dd] flex items-center justify-between">
                    <button
                      onClick={() => navigateTo('shop')}
                      className="text-xs uppercase tracking-wider text-[#765a18] hover:text-[#1b1c19] font-semibold"
                    >
                      ← Continue Shopping
                    </button>
                    <button
                      onClick={() => setCheckoutStep('checkout')}
                      className="px-8 py-3.5 bg-[#1b1c19] hover:bg-[#9E7B32] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
                    >
                      Proceed to Checkout →
                    </button>
                  </div>
                </div>
              ) : (
                /* Checkout Form */
                <form
                  onSubmit={handleCheckoutSubmit}
                  className="bg-[#fbf9f4] border border-[#e4e2dd] p-6 sm:p-8 shadow-sm space-y-5"
                >
                  <div className="border-b border-[#e4e2dd] pb-3 mb-2 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-[#765a18] font-bold block">
                        DELIVERY &amp; PAYMENT DETAILS
                      </span>
                      <h2 className="font-serif-luxury text-2xl text-[#1b1c19]">
                        Complete Your Order
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCheckoutStep('cart')}
                      className="text-xs text-[#765a18] hover:underline"
                    >
                      ← Back to Cart
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#1b1c19] mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Zainab Ali"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-[#f5f3ee] border border-[#e4e2dd] px-3.5 py-2.5 text-xs text-[#1b1c19] focus:outline-none focus:border-[#9E7B32]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#1b1c19] mb-1.5">
                        Phone Number (for Courier &amp; WhatsApp) *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="0300-1234567"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full bg-[#f5f3ee] border border-[#e4e2dd] px-3.5 py-2.5 text-xs text-[#1b1c19] focus:outline-none focus:border-[#9E7B32]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#1b1c19] mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="name@gmail.com"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full bg-[#f5f3ee] border border-[#e4e2dd] px-3.5 py-2.5 text-xs text-[#1b1c19] focus:outline-none focus:border-[#9E7B32]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#1b1c19] mb-1.5">
                        City *
                      </label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-[#f5f3ee] border border-[#e4e2dd] px-3.5 py-2.5 text-xs text-[#1b1c19] focus:outline-none focus:border-[#9E7B32]"
                      >
                        {pakistaniCities.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#1b1c19] mb-1.5">
                        Payment Method *
                      </label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value as any)}
                        className="w-full bg-[#f5f3ee] border border-[#e4e2dd] px-3.5 py-2.5 text-xs text-[#1b1c19] focus:outline-none focus:border-[#9E7B32]"
                      >
                        <option value="cod">Cash on Delivery (Pay when you receive)</option>
                        <option value="bank_transfer">Direct Bank Transfer (HBL / Meezan / Alfalah)</option>
                                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#1b1c19] mb-1.5">
                      Full Delivery Address (Street / House / Area) *
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder="e.g. House #14, Street 3, Sector F-7/2, Islamabad"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-[#f5f3ee] border border-[#e4e2dd] px-3.5 py-2.5 text-xs text-[#1b1c19] focus:outline-none focus:border-[#9E7B32]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-[#1b1c19] hover:bg-[#9E7B32] text-white text-xs font-semibold uppercase tracking-[0.16em] transition-colors shadow-lg"
                  >
                    Confirm &amp; Place Order ({formatPrice(cartTotal)})
                  </button>
                </form>
              )}
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-5 bg-[#F2EDE3] p-6 sm:p-8 border border-[#DFC27F]/40 space-y-4">
              <h3 className="font-serif-luxury text-xl text-[#1b1c19] font-medium border-b border-[#DFC27F]/30 pb-3">
                Order Summary
              </h3>

              <div className="space-y-2 text-xs text-[#4d4545]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-[#1b1c19] tabular-nums">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery:</span>
                  <span className="text-[#765a18] font-medium">To be confirmed</span>
                </div>
                <div className="flex justify-between">

                </div>
                <div className="flex justify-between text-base font-serif-luxury font-bold text-[#1b1c19] pt-3 border-t border-[#DFC27F]/40">
                  <span>Total (PKR):</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
              </div>

              <div className="p-3 bg-[#E8F4F0] border border-[#15803d]/20 text-[#15803d] text-xs flex items-center gap-2">
                <Truck className="w-4 h-4 shrink-0" />
                <span>Store preview only. Shipping details will be added before launch.</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
