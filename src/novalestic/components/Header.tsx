import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { NovalesticLogo } from './NovalesticLogo';
import { ModeSwitcherBar } from './ModeSwitcherBar';
import { ShoppingBag, PlusCircle, PackageCheck, Menu, X, Settings } from 'lucide-react';

export const Header: React.FC = () => {
  const { currentView, navigateTo, cartCount, orders, isOwnerMode, setIsOwnerMode } = useShop();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'ALL JEWELLERY', view: 'shop' },
    { label: 'RINGS', view: 'rings' },
    { label: 'EARRINGS', view: 'earrings' },
    { label: 'NECKLACES', view: 'necklaces' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-40 bg-[#fbf9f4]/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#e4e2dd]">
      {/* Store View Switcher & Publishing Bar */}
      <ModeSwitcherBar />

      {/* Top Banner */}
      <div className="bg-[#F2EDE3] px-4 md:px-8 py-2 flex items-center justify-between gap-2 border-b border-[#DFC27F]/25 text-center">
        <div className="flex-1 flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#15803d] shrink-0" />
          <p className="text-[11px] font-medium tracking-[0.16em] uppercase text-[#4d4545] truncate">
            FREE SECURE DELIVERY ACROSS PAKISTAN <span className="text-[#DFC27F] mx-2">•</span> CASH ON DELIVERY &amp; BANK TRANSFER AVAILABLE
          </p>
        </div>

        {/* Discreet Owner Login link if in Customer Mode */}
        {!isOwnerMode && (
          <button
            onClick={() => {
              setIsOwnerMode(true);
              navigateTo('manage-store');
            }}
            className="hidden lg:flex items-center gap-1 text-[10px] uppercase tracking-wider text-[#765a18] hover:text-[#1b1c19] font-semibold transition-colors shrink-0"
            title="Access Store Management Portal"
          >
            <Settings className="w-3 h-3" />
            <span>Store Admin</span>
          </button>
        )}
      </div>

      {/* Main Header Row */}
      <div className="h-20 max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 flex items-center justify-between gap-4">
        {/* Brand Lockup using New Novalestic Logo */}
        <div className="flex items-center shrink-0">
          <button
            onClick={() => {
              navigateTo('home');
              setIsMobileMenuOpen(false);
            }}
            className="flex items-center text-left group focus:outline-none"
            aria-label="Novalestic Jewellers Home"
          >
            <NovalesticLogo variant="horizontal" size="sm" />
          </button>
        </div>

        {/* Center Desktop Navigation for Customers */}
        <nav className="hidden md:flex items-center gap-6 xl:gap-8">
          {navLinks.map((link) => {
            const isActive = currentView === link.view;
            return (
              <button
                key={link.view}
                onClick={() => navigateTo(link.view)}
                className={`text-[12px] uppercase tracking-[0.14em] font-medium transition-colors duration-200 py-1 relative ${
                  isActive
                    ? 'text-[#1b1c19] font-bold'
                    : 'text-[#4d4545] hover:text-[#1b1c19]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#9E7B32]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Currency Pill: PKR Only */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-[#F2EDE3] border border-[#DFC27F]/40 text-[#1b1c19] text-xs font-semibold tracking-wider">
            <span>PKR (₨)</span>
          </div>

          {/* Manage Store Button — ONLY VISIBLE IN OWNER MODE */}
          {isOwnerMode && (
            <button
              onClick={() => navigateTo('manage-store')}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                currentView === 'manage-store'
                  ? 'bg-[#9E7B32] text-white shadow-sm'
                  : 'bg-[#1b1c19] text-white hover:bg-[#9E7B32]'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Manage Store</span>
            </button>
          )}

          {/* Orders History (in owner mode or if customer placed orders) */}
          {orders.length > 0 && (
            <button
              onClick={() => navigateTo('orders')}
              className="text-[#4d4545] hover:text-[#1b1c19] transition-colors relative p-1.5"
              title={isOwnerMode ? 'Customer Orders' : 'My Order Receipt'}
            >
              <PackageCheck className="w-5 h-5 text-[#765a18]" />
              <span className="absolute -top-1 -right-1 bg-[#765a18] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {orders.length}
              </span>
            </button>
          )}

          {/* Cart Button for Customers */}
          <button
            onClick={() => navigateTo('cart')}
            aria-label="View Shopping Cart"
            className="flex items-center gap-2 p-1.5 text-[#1b1c19] hover:text-[#9E7B32] transition-colors relative"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">
              Cart
            </span>
            {cartCount > 0 && (
              <span className="bg-[#15803d] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
            className="md:hidden p-1.5 text-[#4d4545] hover:text-[#1b1c19]"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#fbf9f4] border-b border-[#e4e2dd] px-6 py-6 shadow-xl space-y-3">
          {navLinks.map((link) => (
            <button
              key={link.view}
              onClick={() => {
                navigateTo(link.view);
                setIsMobileMenuOpen(false);
              }}
              className={`block w-full text-left text-sm uppercase tracking-wider py-2 border-b border-[#e4e2dd]/60 ${
                currentView === link.view ? 'font-bold text-[#1b1c19]' : 'text-[#4d4545]'
              }`}
            >
              {link.label}
            </button>
          ))}

          {isOwnerMode ? (
            <button
              onClick={() => {
                navigateTo('manage-store');
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#1b1c19] text-white text-xs uppercase tracking-wider font-semibold"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Manage Store &amp; Add Products</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setIsOwnerMode(true);
                navigateTo('manage-store');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-center py-2 text-xs text-[#765a18] uppercase tracking-wider font-semibold"
            >
              Owner Portal Login
            </button>
          )}
        </div>
      )}
    </header>
  );
};
