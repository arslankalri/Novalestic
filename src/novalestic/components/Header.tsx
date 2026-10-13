import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { NovalesticLogo } from './NovalesticLogo';
import { ShoppingBag, Menu, X } from 'lucide-react';

export const Header: React.FC = () => {
  const { currentView, navigateTo, cartCount } = useShop();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'ALL JEWELLERY', view: 'shop' },
    { label: 'RINGS', view: 'rings' },
    { label: 'EARRINGS', view: 'earrings' },
    { label: 'NECKLACES', view: 'necklaces' },
  ];

  const handleNavigate = (view: string) => {
    navigateTo(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-40 bg-[#fbf9f4]/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#e4e2dd]">
      <div className="bg-[#F2EDE3] px-4 md:px-8 py-2 border-b border-[#DFC27F]/25 text-center">
        <p className="text-[10px] sm:text-[11px] font-medium tracking-[0.12em] sm:tracking-[0.16em] uppercase text-[#4d4545]">
          NOVALESTIC JEWELLERS <span className="text-[#DFC27F] mx-2">•</span> THE COLLECTION PREVIEW
        </p>
      </div>

      <div className="h-20 max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 flex items-center justify-between gap-3 sm:gap-4">
        <button
          onClick={() => handleNavigate('home')}
          className="flex items-center text-left shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9E7B32]"
          aria-label="Novalestic Jewellers home"
        >
          <NovalesticLogo variant="horizontal" size="sm" />
        </button>

        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-4 lg:gap-6 xl:gap-8">
          {navLinks.map((link) => {
            const isActive = currentView === link.view;
            return (
              <button
                key={link.view}
                onClick={() => handleNavigate(link.view)}
                aria-current={isActive ? 'page' : undefined}
                className={`text-[11px] lg:text-[12px] uppercase tracking-[0.1em] lg:tracking-[0.14em] font-medium transition-colors duration-200 py-1 relative focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9E7B32] ${
                  isActive ? 'text-[#1b1c19] font-bold' : 'text-[#4d4545] hover:text-[#1b1c19]'
                }`}
              >
                {link.label}
                {isActive && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#9E7B32]" />}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-[#F2EDE3] border border-[#DFC27F]/40 text-[#1b1c19] text-xs font-semibold tracking-wider">
            <span>PKR (₨)</span>
          </div>

          <button
            onClick={() => handleNavigate('cart')}
            aria-label={cartCount > 0 ? `View shopping cart, ${cartCount} items` : 'View shopping cart'}
            className="flex items-center gap-2 p-2 text-[#1b1c19] hover:text-[#9E7B32] transition-colors relative focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9E7B32]"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">Cart</span>
            {cartCount > 0 && (
              <span aria-hidden="true" className="bg-[#15803d] text-white text-[10px] font-bold min-w-5 h-5 px-1 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="novalestic-mobile-navigation"
            className="md:hidden p-2 text-[#4d4545] hover:text-[#1b1c19] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9E7B32]"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <nav id="novalestic-mobile-navigation" aria-label="Mobile navigation" className="md:hidden bg-[#fbf9f4] border-b border-[#e4e2dd] px-6 py-5 shadow-xl space-y-1">
          {navLinks.map((link) => (
            <button
              key={link.view}
              onClick={() => handleNavigate(link.view)}
              aria-current={currentView === link.view ? 'page' : undefined}
              className={`block w-full text-left text-sm uppercase tracking-wider py-3 border-b border-[#e4e2dd]/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9E7B32] ${
                currentView === link.view ? 'font-bold text-[#1b1c19]' : 'text-[#4d4545]'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
};
