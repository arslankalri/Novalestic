import React from 'react';

export const NewsletterSection: React.FC = () => {
  return (
    <section className="w-full py-20 lg:py-28 bg-background" id="newsletter-section" aria-labelledby="updates-heading">
      <div className="shell">
        <div className="rounded-[2rem] bg-card shadow-soft px-6 py-16 sm:px-16 sm:py-20 text-center">
          <p className="eyebrow mb-4">Store Updates &amp; New Arrivals</p>
          <h2 id="updates-heading" className="font-serif-luxury text-3xl sm:text-5xl text-foreground tracking-tight">
            Something Beautiful Is Coming
          </h2>
          <p className="mt-5 text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            We are preparing the first Novalestic collection. Newsletter sign-up will open once collection updates are ready.
          </p>
          <p className="mt-8 inline-block rounded-full border border-border px-4 py-2 text-xs text-muted-foreground">
            Newsletter registration is not connected yet. No email address is collected or stored.
          </p>
        </div>
      </div>
    </section>
  );
};
