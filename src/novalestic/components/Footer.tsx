import React from 'react';
import { useShop } from '../context/ShopContext';
import { NovalesticLogo } from './NovalesticLogo';
import { ArrowUpRight, Mail, MapPin, MessageCircle } from 'lucide-react';

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
    <footer className="w-full bg-[#F2EDE3] text-[#1b1c19] mt-20 border-t border-[#DFC27F]/30">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16">
          <div className="flex flex-col items-start">
            <button onClick={() => navigateTo('home')} aria-label="Novalestic home" className="mb-5">
              <NovalesticLogo variant="horizontal" size="sm" />
            </button>
            <p className="max-w-sm text-sm text-[#5d5750] leading-relaxed">
              Jewellery, considered. Discover the Novalestic collection and find pieces that feel like you.
            </p>
          </div>

          <div>
            <h2 className="text-[11px] font-semibold uppercase text-[#4d4545] tracking-[0.2em] mb-5">
              Explore
            </h2>
            <ul className="space-y-3 text-sm text-[#4d4545]">
              {links.map((link) => (
                <li key={link.view}>
                  <button
                    onClick={() => navigateTo(link.view)}
                    className="inline-flex items-center gap-2 hover:text-[#9E7B32] transition-colors"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-[11px] font-semibold uppercase text-[#4d4545] tracking-[0.2em] mb-5">Contact</h2>
            <div className="space-y-3 text-sm text-[#4d4545]">
              <a href="https://wa.me/923019653550" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-[#176b43]"><MessageCircle className="w-4 h-4" /> WhatsApp: 0301 9653550</a>
              <a href="mailto:novalestic1@gmail.com" className="flex items-center gap-2 hover:text-[#9E7B32]"><Mail className="w-4 h-4" /> novalestic1@gmail.com</a>
              <p className="flex items-start gap-2"><MapPin className="w-4 h-4 shrink-0 mt-0.5" /> Barrier 2, Wah Cantt, Taxila, Pakistan</p>
              <button onClick={() => navigateTo('contact')} className="inline-flex items-center gap-1 text-xs uppercase tracking-wider text-[#765a18] hover:text-[#1b1c19]">Contact Us <ArrowUpRight className="w-3.5 h-3.5" /></button>
            </div>
          </div>

          <div>
            <h2 className="text-[11px] font-semibold uppercase text-[#4d4545] tracking-[0.2em] mb-5">
              A note about this preview
            </h2>
            <p className="text-sm text-[#5d5750] leading-relaxed">
              This storefront is being prepared. Product listings are samples for design review; materials, availability, shipping and payment details will be confirmed before orders open.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#DFC27F]/25 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-[#7f7575] uppercase tracking-[0.16em]">
          <p>© {new Date().getFullYear()} NOVALESTIC JEWELLERS</p>
          <button onClick={() => navigateTo('home')} className="hover:text-[#1b1c19] transition-colors">
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  );
};
