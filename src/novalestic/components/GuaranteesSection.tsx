import React from 'react';
import { Sparkles, Package, ShoppingBag, Info } from 'lucide-react';

export const GuaranteesSection: React.FC = () => {
  const previewNotes = [
    {
      icon: Sparkles,
      title: 'Product Details',
      description: 'Materials, dimensions and gemstone information are confirmed with our team for each piece.',
    },
    {
      icon: Package,
      title: 'Delivery Information',
      description: 'Delivery areas, courier options, charges and estimated times will be confirmed before launch.',
    },
    {
      icon: ShoppingBag,
      title: 'Shopping Experience',
      description: 'Browse the collection and enquire on WhatsApp. Online ordering is not enabled yet.',
    },
    {
      icon: Info,
      title: 'Launch Updates',
      description: 'We are preparing the store. Verified policies and customer support details will appear here before launch.',
    },
  ];

  return (
    <section className="w-full py-20 lg:py-28 bg-secondary/60 border-t border-border" aria-labelledby="details-heading">
      <div className="shell">
        <div className="max-w-2xl mb-14">
          <p className="eyebrow mb-3">The Novalestic Preview</p>
          <h2 id="details-heading" className="font-serif-luxury text-3xl sm:text-5xl text-foreground tracking-tight">
            Thoughtful Details, Coming Soon
          </h2>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            We are shaping the storefront and finalising store policies before launch.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-border">
          {previewNotes.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="py-8 sm:pr-8 border-b border-border lg:border-b-0">
                <Icon className="w-5 h-5 text-champagne mb-5" aria-hidden="true" />
                <h3 className="font-serif-luxury text-xl text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>

        <p className="mt-10 text-xs text-muted-foreground max-w-3xl leading-relaxed">
          Prices, availability and authenticity details are confirmed directly with our team before any order. Store policies will be published only after they are verified.
        </p>
      </div>
    </section>
  );
};
