import React from 'react';
import { RefreshCw } from 'lucide-react';
import { useShop } from '../context/ShopContext';

/** Placeholder cards shown while the published collection loads. */
export const CollectionLoading: React.FC<{ count?: number }> = ({ count = 4 }) => (
  <div role="status" aria-live="polite" aria-busy="true">
    <span className="sr-only">Loading the collection…</span>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <div className="aspect-[4/5] rounded-[1.25rem] bg-secondary animate-pulse" />
          <div className="mt-5 h-3 w-20 rounded-full bg-secondary animate-pulse" />
          <div className="mt-3 h-4 w-3/4 rounded-full bg-secondary animate-pulse" />
        </div>
      ))}
    </div>
  </div>
);

/** Shown when the catalogue request fails; never presented as an empty catalogue. */
export const CollectionError: React.FC = () => {
  const { reloadProducts } = useShop();
  return (
    <div role="alert" className="rounded-[1.5rem] border border-border bg-card px-6 py-16 text-center">
      <p className="eyebrow mb-3">Connection issue</p>
      <h3 className="font-serif-luxury text-2xl text-foreground">We couldn’t load the collection</h3>
      <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">
        Please check your connection and try again. Nothing in your cart has changed.
      </p>
      <button
        type="button"
        onClick={reloadProducts}
        className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:opacity-90 transition-opacity"
      >
        <RefreshCw className="w-4 h-4" aria-hidden="true" /> Try again
      </button>
    </div>
  );
};

/** Designed empty state for when no pieces have been published yet. */
export const CollectionEmpty: React.FC<{ title?: string; message?: string }> = ({
  title = 'The collection is being prepared',
  message = 'New pieces will appear here as soon as they are published. In the meantime, our team is happy to help with enquiries.',
}) => {
  const { navigateTo } = useShop();
  return (
    <div role="status" className="rounded-[1.5rem] border border-border bg-card px-6 py-16 sm:py-20 text-center">
      <span className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-champagne-soft font-serif-luxury text-xl text-champagne" aria-hidden="true">N</span>
      <h3 className="font-serif-luxury text-2xl sm:text-3xl text-foreground">{title}</h3>
      <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">{message}</p>
      <button
        type="button"
        onClick={() => navigateTo('contact')}
        className="mt-8 inline-flex items-center rounded-full border border-foreground/15 px-6 py-3 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
      >
        Contact us
      </button>
    </div>
  );
};
