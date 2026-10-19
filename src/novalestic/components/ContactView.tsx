import React from 'react';
import { Mail, MapPin, MessageCircle, ArrowUpRight } from 'lucide-react';

const WHATSAPP_URL = 'https://wa.me/923019653550';
const EMAIL = 'novalestic1@gmail.com';

export const ContactView: React.FC = () => (
  <main className="w-full bg-background min-h-screen pt-36 pb-24">
    <div className="shell max-w-5xl">
      <div className="text-center py-10 sm:py-16">
        <p className="eyebrow">Novalestic Jewellers</p>
        <h1 className="font-serif-luxury text-5xl sm:text-6xl text-foreground tracking-tight mt-4">Contact Us</h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mt-5 leading-relaxed">
          Interested in a piece? Contact us for current prices, availability, product details and ordering assistance.
        </p>
        <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 mt-9 rounded-full bg-emerald hover:bg-emerald-hover text-emerald-foreground px-7 py-3.5 text-sm font-medium transition-colors">
          <MessageCircle className="w-4 h-4" aria-hidden="true" /> Chat on WhatsApp <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
        <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="rounded-[1.5rem] bg-card shadow-soft p-7 hover:shadow-lift transition-shadow">
          <MessageCircle className="w-5 h-5 text-emerald mb-6" aria-hidden="true" />
          <h2 className="font-serif-luxury text-xl text-foreground">WhatsApp</h2>
          <p className="text-sm text-muted-foreground mt-2">0301 9653550</p>
          <p className="text-xs text-champagne mt-5">Product enquiries and orders ↗</p>
        </a>
        <a href={`mailto:${EMAIL}`} className="rounded-[1.5rem] bg-card shadow-soft p-7 hover:shadow-lift transition-shadow">
          <Mail className="w-5 h-5 text-champagne mb-6" aria-hidden="true" />
          <h2 className="font-serif-luxury text-xl text-foreground">Email</h2>
          <p className="text-sm text-muted-foreground mt-2 break-words">{EMAIL}</p>
          <p className="text-xs text-champagne mt-5">Send us a message ↗</p>
        </a>
        <div className="rounded-[1.5rem] bg-card shadow-soft p-7">
          <MapPin className="w-5 h-5 text-champagne mb-6" aria-hidden="true" />
          <h2 className="font-serif-luxury text-xl text-foreground">Visit Us</h2>
          <p className="text-sm text-muted-foreground mt-2">Barrier 2, Wah Cantt, Taxila, Pakistan</p>
          <p className="text-xs text-champagne mt-5">Contact us before visiting</p>
        </div>
      </div>
      <p className="text-xs text-muted-foreground text-center mt-10">Prices, availability, materials and specifications are confirmed individually before an order is finalised.</p>
    </div>
  </main>
);
