import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  PackageCheck,
  ArrowLeft,
  MessageCircle,
  Mail,
  ExternalLink,
  ShieldCheck,
  Trash2,
  Download,
  Search,
  Check,
  Phone,
  Clock,
} from 'lucide-react';

export const OrdersView: React.FC = () => {
  const {
    orders,
    formatPrice,
    navigateTo,
    ownerSettings,
    getOrderWhatsAppUrl,
    getOrderEmailUrl,
    getOrderGmailUrl,
    markOrderDelivered,
    deleteOrder,
    clearAllOrders,
    exportOrdersJSON,
    updateOrderStatus,
  } = useShop();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Confirmed' | 'Processing' | 'Dispatched' | 'Delivered'>('All');

  const filteredOrders = orders.filter((ord) => {
    const matchesFilter = filterStatus === 'All' || ord.status === filterStatus;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesFilter;

    const matchesQuery =
      ord.id.toLowerCase().includes(query) ||
      ord.customerName.toLowerCase().includes(query) ||
      ord.customerPhone.toLowerCase().includes(query) ||
      ord.city.toLowerCase().includes(query) ||
      ord.items.some((item) => item.product.title.toLowerCase().includes(query));

    return matchesFilter && matchesQuery;
  });

  return (
    <div className="w-full bg-[#fbf9f4] min-h-screen pt-36 pb-24">
      <div className="max-w-[1050px] mx-auto px-6 md:px-12">
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
          <span className="text-[#1b1c19] font-semibold">Studio Order Records</span>
        </div>

        {/* Top Banner */}
        <div className="bg-[#F2EDE3] p-8 border border-[#DFC27F]/40 mb-8 flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#15803d]" />
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#765a18]">
                SECURE ORDER STORAGE &amp; DIRECT DELIVERY
              </span>
            </div>
            <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#1b1c19] font-normal">
              Stored Jewellery Orders ({orders.length})
            </h1>
            <p className="text-xs text-[#4d4545] mt-1.5 max-w-xl">
              All client orders are permanently recorded here and delivered strictly to your own WhatsApp (
              <strong className="text-[#1b1c19]">{ownerSettings.ownerWhatsApp}</strong>) and Email (
              <strong className="text-[#1b1c19]">{ownerSettings.ownerEmail}</strong>).
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {orders.length > 0 && (
              <>
                <button
                  onClick={exportOrdersJSON}
                  className="px-4 py-2.5 bg-white hover:bg-[#eae8e3] text-[#1b1c19] border border-[#DFC27F]/60 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-[#765a18]" />
                  <span>Backup JSON</span>
                </button>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to clear all stored orders?')) {
                      clearAllOrders();
                    }
                  }}
                  className="px-3.5 py-2.5 bg-[#f5f3ee] hover:bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Clear History
                </button>
              </>
            )}
            <button
              onClick={() => navigateTo('shop')}
              className="px-5 py-2.5 bg-[#1b1c19] text-white hover:bg-[#9E7B32] text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Browse Shop
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        {orders.length > 0 && (
          <div className="bg-white p-4 border border-[#e4e2dd] mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-[#7f7575] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search orders, clients, cities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#fbf9f4] border border-[#e4e2dd] pl-9 pr-3 py-2 text-xs text-[#1b1c19] focus:outline-none focus:border-[#9E7B32]"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              {(['All', 'Confirmed', 'Processing', 'Dispatched', 'Delivered'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap ${
                    filterStatus === status
                      ? 'bg-[#1b1c19] text-white'
                      : 'bg-[#f5f3ee] text-[#4d4545] hover:bg-[#eae8e3]'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {orders.length === 0 ? (
          <div className="text-center py-20 bg-[#f5f3ee] border border-[#e4e2dd] max-w-lg mx-auto p-8">
            <div className="w-16 h-16 rounded-full bg-[#F2EDE3] flex items-center justify-center mx-auto mb-4 text-[#765a18] border border-[#DFC27F]/40">
              <PackageCheck className="w-8 h-8" />
            </div>
            <h3 className="font-serif-luxury text-2xl text-[#1b1c19] mb-2 font-normal">
              No Stored Orders Yet
            </h3>
            <p className="text-xs text-[#4d4545] mb-6 leading-relaxed">
              When customers complete checkout, each order is securely saved in your studio database and delivered directly to your own WhatsApp and Email.
            </p>
            <button
              onClick={() => navigateTo('shop')}
              className="px-6 py-3.5 bg-[#1b1c19] hover:bg-[#9E7B32] text-white text-xs font-semibold uppercase tracking-wider shadow-sm transition-colors"
            >
              Start Shopping &amp; Place Test Order
            </button>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-white border border-[#e4e2dd]">
            <p className="text-sm text-[#7f7575]">No orders match your filter criteria.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterStatus('All');
              }}
              className="mt-3 text-xs text-[#765a18] font-bold underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((ord) => {
              const waUrl = getOrderWhatsAppUrl(ord);
              const mailUrl = getOrderEmailUrl(ord);
              const gmailUrl = getOrderGmailUrl(ord);

              // Customer direct WhatsApp link
              const cleanCustomerPhone = ord.customerPhone.replace(/[^0-9]/g, '');
              const customerWaNumber = cleanCustomerPhone.startsWith('0')
                ? `92${cleanCustomerPhone.slice(1)}`
                : cleanCustomerPhone;
              const customerWaUrl = `https://wa.me/${customerWaNumber}?text=${encodeURIComponent(
                `Assalam o Alaikum ${ord.customerName}, this is Novalestic Jewellers regarding your order #${ord.id}. We are confirming your delivery destination in ${ord.city}.`
              )}`;

              return (
                <div key={ord.id} className="bg-[#fbf9f4] border border-[#e4e2dd] p-6 shadow-sm hover:border-[#DFC27F]/60 transition-colors">
                  {/* Order Top Bar */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-[#e4e2dd] gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-base text-[#1b1c19]">#{ord.id}</span>
                        <span className="bg-[#E8F4F0] text-[#15803d] text-[10px] font-bold px-2.5 py-0.5 uppercase tracking-wider">
                          {ord.status}
                        </span>
                        <span className="bg-[#F2EDE3] text-[#765a18] text-[10px] font-semibold px-2 py-0.5 uppercase tracking-wider border border-[#DFC27F]/30">
                          Stored in Studio System
                        </span>
                        {ord.deliveredToWhatsApp && (
                          <span className="text-[10px] text-[#15803d] font-semibold flex items-center gap-1">
                            <Check className="w-3 h-3" /> Sent to WhatsApp
                          </span>
                        )}
                        {ord.deliveredToEmail && (
                          <span className="text-[10px] text-[#1b1c19] font-semibold flex items-center gap-1">
                            <Check className="w-3 h-3" /> Sent to Email
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#7f7575] mt-1">Placed on {ord.createdAt}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] uppercase text-[#7f7575] block font-medium">Total Amount</span>
                        <span className="font-serif-luxury text-lg font-bold text-[#1b1c19]">
                          {formatPrice(ord.totalPKR)}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          if (confirm(`Delete order #${ord.id}?`)) {
                            deleteOrder(ord.id);
                          }
                        }}
                        className="p-2 text-[#7f7575] hover:text-rose-600 transition-colors"
                        title="Delete order"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3 mb-4">
                    {ord.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-[#e4e2dd]/40 last:border-0">
                        <div className="flex items-center gap-3">
                          <img
                            alt=""
                            src={item.product.image}
                            className="w-12 h-14 object-cover bg-[#eae8e3] border border-[#e4e2dd]"
                          />
                          <div>
                            <span className="font-semibold text-[#1b1c19] text-sm block">
                              {item.product.title}
                            </span>
                            <span className="text-[#7f7575] block mt-0.5">
                              Metal: <strong className="text-[#1b1c19]">{item.selectedMetal}</strong>
                              {item.ringSize ? ` • Size: ${item.ringSize}` : ''} • Qty: {item.quantity}
                            </span>
                          </div>
                        </div>
                        <span className="font-mono font-semibold text-sm">
                          {formatPrice(item.product.pricePKR * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Customer Delivery Details */}
                  <div className="bg-[#f5f3ee] p-4 text-xs text-[#4d4545] border border-[#e4e2dd] grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                    <div>
                      <span className="text-[#7f7575] block text-[10px] uppercase font-bold tracking-wider">
                        Customer
                      </span>
                      <p className="font-medium text-[#1b1c19] mt-0.5">
                        {ord.customerName}
                      </p>
                      <p className="text-[#765a18] font-mono">{ord.customerPhone}</p>
                      <p className="text-[11px] text-[#7f7575] truncate">{ord.customerEmail}</p>
                    </div>

                    <div>
                      <span className="text-[#7f7575] block text-[10px] uppercase font-bold tracking-wider">
                        Delivery Destination
                      </span>
                      <p className="font-medium text-[#1b1c19] mt-0.5">
                        {ord.address}
                      </p>
                      <p className="text-[#765a18] font-semibold">{ord.city}, Pakistan</p>
                    </div>

                    <div>
                      <span className="text-[#7f7575] block text-[10px] uppercase font-bold tracking-wider">
                        Payment &amp; Status
                      </span>
                      <p className="font-semibold uppercase text-[#1b1c19] mt-0.5">
                        {ord.paymentMethod === 'cod'
                          ? 'Cash on Delivery (COD)'
                          : ord.paymentMethod === 'bank_transfer'
                          ? 'Direct Bank Wire'
                          : 'Credit / Debit Card'}
                      </p>

                      {/* Status Selector */}
                      <div className="mt-2 flex items-center gap-1.5">
                        <label className="text-[10px] text-[#7f7575]">Status:</label>
                        <select
                          value={ord.status}
                          onChange={(e) =>
                            updateOrderStatus(
                              ord.id,
                              e.target.value as 'Confirmed' | 'Processing' | 'Dispatched' | 'Delivered'
                            )
                          }
                          className="bg-white border border-[#e4e2dd] text-[11px] px-2 py-1 font-semibold text-[#1b1c19] focus:outline-none focus:border-[#9E7B32]"
                        >
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Direct Delivery Actions to Owner WhatsApp and Email */}
                  <div className="pt-3 border-t border-[#e4e2dd] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
                    <div className="text-[11px] text-[#765a18]">
                      <span>Deliver to Studio: <strong>{ownerSettings.ownerWhatsApp}</strong> • <strong>{ownerSettings.ownerEmail}</strong></span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {/* WhatsApp to Owner */}
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => markOrderDelivered(ord.id, 'whatsapp')}
                        className="px-3.5 py-2 bg-[#15803d] hover:bg-[#166534] text-white text-[11px] font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-xs"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Deliver to My WhatsApp</span>
                      </a>

                      {/* Email to Owner (Mail client) */}
                      <a
                        href={mailUrl}
                        onClick={() => markOrderDelivered(ord.id, 'email')}
                        className="px-3.5 py-2 bg-white hover:bg-[#eae8e3] text-[#1b1c19] border border-[#DFC27F]/60 text-[11px] font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5"
                      >
                        <Mail className="w-3.5 h-3.5 text-[#765a18]" />
                        <span>Deliver to My Email</span>
                      </a>

                      {/* Gmail Web Compose */}
                      <a
                        href={gmailUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => markOrderDelivered(ord.id, 'email')}
                        className="px-3 py-2 bg-[#F2EDE3] hover:bg-[#eae8e3] text-[#765a18] border border-[#DFC27F]/40 text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Gmail Web</span>
                      </a>

                      {/* WhatsApp Customer */}
                      <a
                        href={customerWaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-[#f5f3ee] hover:bg-[#eae8e3] text-[#4d4545] border border-[#e4e2dd] text-[10px] font-semibold uppercase tracking-wider transition-colors flex items-center gap-1"
                        title="Contact customer directly"
                      >
                        <Phone className="w-3 h-3" />
                        <span>WhatsApp Customer</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
