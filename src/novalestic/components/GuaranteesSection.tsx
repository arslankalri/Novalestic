import React from 'react';
import { Sparkles, Package, ShoppingBag, Info } from 'lucide-react';

export const GuaranteesSection: React.FC = () => {
  const previewNotes = [
    {
      icon: Sparkles,
      title: 'Product Details',
      description: 'Materials, dimensions and gemstone information will be added once the real collection is finalized.',
    },
    {
      icon: Package,
      title: 'Delivery Information',
      description: 'Delivery areas, courier options, charges and estimated times will be confirmed before launch.',
    },
    {
      icon: ShoppingBag,
      title: 'Shopping Experience',
      description: 'Browse the sample catalogue and explore product details. Real ordering is not enabled yet.',
    },
    {
      icon: Info,
      title: 'Launch Updates',
      description: 'We are preparing the store. Verified policies and customer support details will appear here before launch.',
    },
  ];

  return (
    <section className="w-full py-16 lg:py-24 bg-[#F2EDE3] text-[#1b1c19] border-t border-[#DFC27F]/25">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#765a18] block mb-2">
            THE NOVALESTIC PREVIEW
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#1b1c19] font-normal">
            Thoughtful Details, Coming Soon
          </h2>
          <p className="mt-4 text-sm text-[#5d5750] leading-relaxed">
            We are shaping the storefront before adding the real collection and store policies.
          </p>
          <div className="w-12 h-[1px] bg-[#DFC27F] mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {previewNotes.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
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

        <div className="mt-10 bg-[#fbf9f4] border border-[#DFC27F]/40 p-5 sm:p-6 flex items-start gap-3 max-w-3xl mx-auto">
          <Info className="w-5 h-5 text-[#9E7B32] shrink-0 mt-0.5" />
          <p className="text-xs text-[#5d5750] leading-relaxed">
            All product cards and prices currently shown are sample content for layout testing, not live offers. Product authenticity, prices, availability and policies will be published only after they are verified.
          </p>
        </div>
      </div>
    </section>
  );
};
