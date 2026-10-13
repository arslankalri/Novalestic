import React from 'react';
import { Mail, MapPin, MessageCircle, Phone, ArrowUpRight } from 'lucide-react';

const WHATSAPP_URL = 'https://wa.me/923019653550';
const EMAIL = 'novalestic1@gmail.com';

export const ContactView: React.FC = () => (
  <main className="w-full bg-[#fbf9f4] min-h-screen pt-36 pb-24">
    <div className="max-w-5xl mx-auto px-6 md:px-12">
      <div className="bg-[#F2EDE3] border border-[#DFC27F]/40 px-6 py-12 sm:px-12 sm:py-16 text-center">
        <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#765a18]">NOVALESTIC JEWELLERS</span>
        <h1 className="font-serif-luxury text-4xl sm:text-5xl text-[#1b1c19] font-normal mt-3">Contact Us</h1>
        <p className="text-sm sm:text-base text-[#4d4545] max-w-xl mx-auto mt-4 leading-relaxed">
          Interested in a piece? Contact us for current prices, availability, product details and ordering assistance.
        </p>
        <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 mt-8 px-7 py-4 bg-[#176b43] hover:bg-[#125637] text-white text-xs font-semibold uppercase tracking-[0.15em] transition-colors">
          <MessageCircle className="w-4 h-4" /> Chat on WhatsApp <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
        <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="border border-[#e4e2dd] bg-white p-6 hover:border-[#9E7B32] transition-colors">
          <MessageCircle className="w-6 h-6 text-[#176b43] mb-4" />
          <h2 className="font-serif-luxury text-xl text-[#1b1c19]">WhatsApp</h2>
          <p className="text-sm text-[#5d5750] mt-2">0301 9653550</p>
          <p className="text-xs text-[#765a18] mt-4">Product enquiries and orders ↗</p>
        </a>
        <a href={`mailto:${EMAIL}`} className="border border-[#e4e2dd] bg-white p-6 hover:border-[#9E7B32] transition-colors">
          <Mail className="w-6 h-6 text-[#9E7B32] mb-4" />
          <h2 className="font-serif-luxury text-xl text-[#1b1c19]">Email</h2>
          <p className="text-sm text-[#5d5750] mt-2 break-words">{EMAIL}</p>
          <p className="text-xs text-[#765a18] mt-4">Send us a message ↗</p>
        </a>
        <div className="border border-[#e4e2dd] bg-white p-6">
          <MapPin className="w-6 h-6 text-[#9E7B32] mb-4" />
          <h2 className="font-serif-luxury text-xl text-[#1b1c19]">Visit Us</h2>
          <p className="text-sm text-[#5d5750] mt-2">Barrier 2, Wah Cantt, Taxila, Pakistan</p>
          <p className="text-xs text-[#765a18] mt-4">Contact us before visiting</p>
        </div>
      </div>
      <p className="text-xs text-[#7f7575] text-center mt-8">Prices, availability, materials and specifications are confirmed individually before an order is finalised.</p>
    </div>
  </main>
);
