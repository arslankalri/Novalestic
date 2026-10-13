import React from 'react';
import { Mail, Info } from 'lucide-react';

export const NewsletterSection: React.FC = () => {
  return (
    <section className="w-full py-16 lg:py-24 bg-[#fbf9f4]" id="newsletter-section">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="relative bg-[#F2EDE3] p-8 md:p-14 border border-[#DFC27F]/40">
          <div className="relative z-10 max-w-2xl mx-auto text-center flex flex-col items-center">
            <div className="w-11 h-11 rounded-full bg-[#eae8e3] flex items-center justify-center mb-4 text-[#765a18]">
              <Mail className="w-5 h-5 text-[#9E7B32]" />
            </div>

            <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#765a18] mb-2">
              STORE UPDATES &amp; NEW ARRIVALS
            </span>

            <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#1b1c19] font-normal mb-3">
              Something Beautiful Is Coming
            </h2>

            <p className="text-sm text-[#4d4545] mb-6 leading-relaxed font-light">
              We are preparing the first Novalestic collection. Newsletter sign-up will open once collection updates are ready.
            </p>

            <div className="w-full max-w-lg bg-[#fbf9f4]/80 p-4 text-[#5d5750] border border-[#C6A45B]/30 flex items-start justify-center gap-2.5 text-left">
              <Info className="w-4 h-4 text-[#9E7B32] shrink-0 mt-0.5" />
              <span className="text-xs leading-relaxed">
                Newsletter registration is not connected yet. No email address is collected or stored on this preview.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
