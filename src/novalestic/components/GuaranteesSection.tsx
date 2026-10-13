import React from 'react';
import { ShieldCheck, Sparkles, Award, Truck, Lock, PhoneCall } from 'lucide-react';

export const GuaranteesSection: React.FC = () => {
  const guarantees = [
    {
      icon: Sparkles,
      title: '100% Natural Gemstones',
      description:
        'All emeralds, rubies, and sapphires are natural, unheated, and authenticated for crystalline saturation and purity.',
    },
    {
      icon: ShieldCheck,
      title: '18K Gold Assay Hallmark',
      description:
        'Every jewellery piece is stamped with official maker hallmarks and 18 karat gold purity guarantee.',
    },
    {
      icon: Truck,
      title: 'Insured Delivery in Pakistan',
      description:
        'Dispatched via verified couriers across Karachi, Lahore, Islamabad, and all cities with tamper-evident packaging.',
    },
    {
      icon: Lock,
      title: 'Cash on Delivery & Wire',
      description:
        'Flexible checkout with Cash on Delivery (COD) and direct bank wire transfer options for peace of mind.',
    },
  ];

  return (
    <section className="w-full py-16 lg:py-24 bg-[#F2EDE3] text-[#1b1c19] border-t border-[#DFC27F]/25">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#765a18] block mb-2">
            QUALITY &amp; AUTHENTICITY STANDARDS
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#1b1c19] font-normal">
            Our Heirloom Guarantees
          </h2>
          <div className="w-12 h-[1px] bg-[#DFC27F] mx-auto mt-4" />
        </div>

        {/* 4 Pillars of Guarantee (No fake reviews) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {guarantees.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-[#fbf9f4] p-8 border border-[#e4e2dd] shadow-sm flex flex-col items-center text-center hover:border-[#9E7B32] transition-colors duration-300"
              >
                <div className="w-14 h-14 rounded-full bg-[#F2EDE3] flex items-center justify-center mb-5 text-[#9E7B32] border border-[#DFC27F]/30">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="font-serif-luxury text-lg text-[#1b1c19] mb-2 font-medium">
                  {item.title}
                </h3>
                <p className="text-xs text-[#4d4545] leading-relaxed font-light">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Direct Studio Contact Banner */}
        <div className="mt-12 bg-[#fbf9f4] border border-[#DFC27F]/40 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 bg-[#15803d]/10 text-[#15803d] rounded-full flex items-center justify-center shrink-0">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif-luxury text-base sm:text-lg font-medium text-[#1b1c19]">
                Direct Studio Concierge &amp; Inquiries
              </h4>
              <p className="text-xs text-[#4d4545]">
                Speak directly with our atelier team for custom commissions, ring sizing, or order delivery tracking.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#765a18] bg-[#F2EDE3] px-3.5 py-2 border border-[#DFC27F]/40">
              Lahore Atelier • Nationwide Courier
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
