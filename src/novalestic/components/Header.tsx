import React, { useEffect, useRef, useState } from 'react';
import { useShop } from '../context/ShopContext';
import { NovalesticLogo } from './NovalesticLogo';
import { ShoppingBag, Menu, X } from 'lucide-react';

export const Header: React.FC = () => {
  const { currentView, navigateTo, cartCount } = useShop();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const navLinks = [
    { label: 'All Jewellery', view: 'shop' },
    { label: 'Rings', view: 'rings' },
    { label: 'Earrings', view: 'earrings' },
    { label: 'Necklaces', view: 'necklaces' },
    { label: 'Bangles & Bracelets', view: 'bangles-bracelets' },
    { label: 'Contact Us', view: 'contact' },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isMobileMenuOpen]);

  const handleNavigate = (view: string) => {
    navigateTo(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-[background-color,box-shadow,border-color] duration-300 border-b ${
        scrolled || isMobileMenuOpen
          ? 'bg-background/85 backdrop-blur-xl backdrop-saturate-150 border-border shadow-soft'
          : 'bg-background/70 backdrop-blur-md border-transparent'
      }`}
    >
      <div className="h-8 flex items-center justify-center border-b border-border/70 px-4">
        <p className="text-[10px] sm:text-[11px] tracking-[0.18em] uppercase text-muted-foreground">
          Novalestic Jewellers <span className="text-champagne mx-2" aria-hidden="true">·</span> The Collection Preview
        </p>
      </div>

      <div className="shell h-16 flex items-center justify-between gap-4">
        <button onClick={() => handleNavigate('home')} className="flex items-center shrink-0 rounded-sm" aria-label="Novalestic Jewellers home">
          <NovalesticLogo variant="horizontal" size="sm" />
        </button>

        <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => {
            const isActive = currentView === link.view;
            return (
              <button
                key={link.view}
                onClick={() => handleNavigate(link.view)}
                aria-current={isActive ? 'page' : undefined}
                className={`relative py-1 text-[13px] tracking-wide transition-colors duration-200 rounded-sm ${
                  isActive ? 'text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className={`absolute -bottom-0.5 left-0 right-0 h-px bg-champagne transition-transform duration-300 origin-left ${isActive ? 'scale-x-100' : 'scale-x-0'}`}
                />
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-1 sm:gap-3 shrink-0">
          <span className="hidden sm:inline-flex rounded-full border border-border px-3 py-1 text-[11px] font-medium tracking-wider text-muted-foreground">
            PKR (₨)
          </span>

          <button
            onClick={() => handleNavigate('cart')}
            aria-label={cartCount > 0 ? `View shopping cart, ${cartCount} items` : 'View shopping cart'}
            aria-current={currentView === 'cart' ? 'page' : undefined}
            className="relative flex items-center gap-2 rounded-full p-2.5 text-foreground hover:bg-secondary transition-colors"
          >
            <ShoppingBag className="w-5 h-5" aria-hidden="true" />
            {cartCount > 0 && (
              <span aria-hidden="true" className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 rounded-full bg-emerald text-emerald-foreground text-[10px] font-semibold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          <button
            ref={menuButtonRef}
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="novalestic-mobile-navigation"
            className="lg:hidden rounded-full p-2.5 text-foreground hover:bg-secondary transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <nav
          id="novalestic-mobile-navigation"
          aria-label="Mobile navigation"
          className="lg:hidden border-t border-border bg-background/95 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <ul className="shell py-4">
            {navLinks.map((link) => (
              <li key={link.view}>
                <button
                  onClick={() => handleNavigate(link.view)}
                  aria-current={currentView === link.view ? 'page' : undefined}
                  className={`block w-full text-left font-serif-luxury text-2xl py-3 border-b border-border/60 rounded-sm ${
                    currentView === link.view ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
};
