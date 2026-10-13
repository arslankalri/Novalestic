import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Mail, Info } from 'lucide-react';

export const NewsletterSection: React.FC = () => {
  const { showToast } = useShop();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      showToast('Newsletter sign-up is not connected yet. Please check back soon.');
    }
  };

  return (
    <section className="w-full py-16 lg:py-24 bg-[#fbf9f4]" id="newsletter-section">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="relative bg-[#F2EDE3] p-8 md:p-14 shadow-md border border-[#DFC27F]/40">
          <div className="relative z-10 max-w-2xl mx-auto text-center flex flex-col items-center">
            <div className="w-11 h-11 rounded-full bg-[#eae8e3] flex items-center justify-center mb-4 text-[#765a18]">
              <Mail className="w-5 h-5 text-[#9E7B32]" />
            </div>

            <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#765a18] mb-2">
              STORE UPDATES &amp; NEW ARRIVALS
            </span>

            <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#1b1c19] font-normal mb-3">
              Stay Informed on New Jewellery Creations
            </h2>

            <p className="text-sm text-[#4d4545] mb-8 leading-relaxed font-light">
              Subscribe to receive first access to newly added handcrafted emerald and gold pieces, seasonal offers, and custom commission openings.
            </p>

            <div className="w-full max-w-lg bg-white/70 p-4 text-[#765a18] border border-[#DFC27F]/40 flex items-center gap-2.5 text-left">
              <Info className="w-5 h-5 shrink-0" />
              <span className="text-xs">Newsletter sign-up is coming soon. It will be enabled once subscriber storage and email delivery are connected.</span>
            </div>
            <form onSubmit={handleSubmit} className="hidden w-full max-w-lg flex-col sm:flex-row items-center gap-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full bg-[#fbf9f4] px-4 py-3.5 text-xs text-[#1b1c19] placeholder:text-[#7f7575] focus:outline-none border border-[#e4e2dd] focus:border-[#9E7B32]"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto shrink-0 px-8 py-3.5 bg-[#1b1c19] text-white hover:bg-[#9E7B32] text-xs font-semibold tracking-[0.16em] uppercase transition-colors duration-300 shadow-md whitespace-nowrap"
                >
                  SUBSCRIBE
                </button>
              </form>
            )}


          </div>
        </div>
      </div>
    </section>
  );
};
