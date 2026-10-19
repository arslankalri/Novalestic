import React from 'react';
import { useShop } from '../context/ShopContext';
import { NovalesticLogo } from './NovalesticLogo';
import { Mail, MapPin, MessageCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo } = useShop();

  const links = [
    { label: 'All Jewellery', view: 'shop' },
    { label: 'Rings', view: 'rings' },
    { label: 'Earrings', view: 'earrings' },
    { label: 'Necklaces', view: 'necklaces' },
    { label: 'Bangles & Bracelets', view: 'bangles-bracelets' },
    { label: 'Contact Us', view: 'contact' },
  ];

  return (
    <footer className="w-full bg-secondary/70 text-foreground border-t border-border">
      <div className="shell py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <button onClick={() => navigateTo('home')} aria-label="Novalestic home" className="mb-5 rounded-sm">
              <NovalesticLogo variant="horizontal" size="sm" />
            </button>
            <p className="max-w-xs text-sm text-muted-foreground leading-relaxed">
              Jewellery, considered. Discover the Novalestic collection and find pieces that feel like you.
            </p>
          </div>

          <nav aria-label="Footer" className="lg:col-span-2">
            <h2 className="eyebrow font-sans text-muted-foreground mb-5">Explore</h2>
            <ul className="space-y-3 text-sm">
              {links.map((link) => (
                <li key={link.view}>
                  <button onClick={() => navigateTo(link.view)} className="text-muted-foreground hover:text-foreground transition-colors rounded-sm">
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <h2 className="eyebrow font-sans text-muted-foreground mb-5">Contact</h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <a href="https://wa.me/923019653550" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-emerald transition-colors"><MessageCircle className="w-4 h-4" aria-hidden="true" /> WhatsApp: 0301 9653550</a>
              <a href="mailto:novalestic1@gmail.com" className="flex items-center gap-2 hover:text-foreground transition-colors"><Mail className="w-4 h-4" aria-hidden="true" /> novalestic1@gmail.com</a>
              <p className="flex items-start gap-2"><MapPin className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" /> Barrier 2, Wah Cantt, Taxila, Pakistan</p>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h2 className="eyebrow font-sans text-muted-foreground mb-5">Before you enquire</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Current prices, product details and availability are confirmed by our team. Shipping and payment arrangements are discussed directly before an order is placed.
            </p>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Novalestic Jewellers</p>
          <button onClick={() => navigateTo('home')} className="hover:text-foreground transition-colors rounded-sm">
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  );
};
