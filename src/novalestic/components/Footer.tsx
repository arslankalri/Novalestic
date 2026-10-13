import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { NovalesticLogo } from './NovalesticLogo';
import { ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo, showToast, isOwnerMode, setIsOwnerMode, ownerSettings } = useShop();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      showToast('Thank you for subscribing to Novalestic updates.');
      setEmail('');
    }
  };

  return (
    <footer className="w-full bg-[#F2EDE3] text-[#1b1c19] mt-24 border-t border-[#DFC27F]/30">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-16">
          {/* Column 1: Store Branding & Newsletter */}
          <div className="flex flex-col items-start">
            <div className="mb-4">
              <NovalesticLogo variant="horizontal" size="sm" />
            </div>
            <p className="text-[13px] text-[#4d4545] leading-relaxed mb-6">
              Handcrafted 18k solid gold &amp; natural emerald fine jewellery available with insured delivery across Pakistan.
            </p>
            {isSubscribed ? (
              <div className="p-3 bg-[#E8F4F0] text-[#15803d] text-xs font-medium w-full">
                Thank you. You are subscribed to new catalogue drops.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2 w-full">
                <div className="flex items-center border-b border-[#DFC27F]">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-transparent py-2.5 text-xs text-[#1b1c19] placeholder:text-[#7f7575] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="ml-3 text-[11px] font-semibold uppercase tracking-widest text-[#1b1c19] hover:text-[#9E7B32] transition-colors shrink-0"
                  >
                    JOIN
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Column 2: Categories */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase text-[#4d4545] tracking-[0.2em] mb-4">
              Explore Store
            </h4>
            <ul className="space-y-2.5 text-xs text-[#4d4545]">
              <li>
                <button
                  onClick={() => navigateTo('shop')}
                  className="hover:text-[#1b1c19] transition-colors text-left"
                >
                  All Jewellery Pieces
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('rings')}
                  className="hover:text-[#1b1c19] transition-colors text-left"
                >
                  Emerald Solitaire Rings
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('earrings')}
                  className="hover:text-[#1b1c19] transition-colors text-left"
                >
                  Drop &amp; Chandelier Earrings
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('necklaces')}
                  className="hover:text-[#1b1c19] transition-colors text-left"
                >
                  Pendants &amp; Necklaces
                </button>
              </li>
              {isOwnerMode ? (
                <li>
                  <button
                    onClick={() => navigateTo('manage-store')}
                    className="hover:text-[#1b1c19] transition-colors text-left font-bold text-[#765a18]"
                  >
                    ⚙️ Store Management Dashboard
                  </button>
                </li>
              ) : (
                <li>
                  <button
                    onClick={() => {
                      setIsOwnerMode(true);
                      navigateTo('manage-store');
                    }}
                    className="text-[#7f7575] hover:text-[#1b1c19] transition-colors text-left text-[11px]"
                  >
                    Owner / Staff Login →
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Column 3: Customer Care & Pakistan Delivery */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase text-[#4d4545] tracking-[0.2em] mb-4">
              Customer Support
            </h4>
            <ul className="space-y-3 text-xs text-[#4d4545]">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#765a18]" />
                <span>{ownerSettings.ownerWhatsApp} (Call &amp; WhatsApp)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#765a18]" />
                <span>{ownerSettings.ownerEmail}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#765a18] shrink-0 mt-0.5" />
                <span>Gulberg III, Lahore, Pakistan</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Hallmarks & Trust Emblem */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase text-[#4d4545] tracking-[0.2em] mb-4">
              Store Guarantee
            </h4>
            <div className="space-y-4">
              <div className="bg-[#E8F4F0] p-3.5 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#15803d] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] font-bold text-[#15803d] uppercase tracking-wider block">
                    100% Genuine 18K Gold
                  </span>
                  <span className="text-[11px] text-[#4d4545]">
                    Official maker stamp with natural certified emeralds.
                  </span>
                </div>
              </div>
              <p className="text-xs text-[#4d4545] leading-relaxed">
                Cash on delivery &amp; bank wire available nationwide. Free delivery in Lahore, Karachi, Islamabad &amp; all cities.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Novalestic Emblem */}
        <div className="pt-8 border-t border-[#DFC27F]/25 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#7f7575] uppercase tracking-wider">
          <p>© {new Date().getFullYear()} NOVALESTIC JEWELLERS PAKISTAN. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-4">
            <span>PKR Currency Store</span>
            <span>•</span>
            <span>Nationwide Courier Transit</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
