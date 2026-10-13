import React from 'react';
import { useShop } from '../context/ShopContext';
import { ArrowUpRight } from 'lucide-react';

export const CuratedCategories: React.FC = () => {
  const { navigateTo } = useShop();

  const categories = [
    {
      num: '01 / RINGS',
      kicker: 'Explore the collection',
      title: 'Fine Jewellery Rings',
      action: 'Explore Rings',
      view: 'rings',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKyw8-mnzt9cB285WanV7WNdJogBmtek50VPEy9PvejmgD3uaq9eINzPa4I7KeFWjKwsfPFkHgQRQAH-agbWe3aj4f85ZEvdhKEV75FnHurvLQw7RLhgRkoCRTOc6UkyDy8fpAsBIIV9Ps_ikfBiwGDWSqrb2TKhHntmRQcL6XJnBOjl6UM8z3f27jl0BUlTxXKPBrhoOFbdAHIe-UUw5-pyNbF49jLl30eLzCfNy1U73vlOCDYIkh',
    },
    {
      num: '02 / EARRINGS',
      kicker: 'Explore the collection',
      title: 'Solitaire & Drop Earrings',
      action: 'Explore Earrings',
      view: 'earrings',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRcymyOiMv32lVpJeJps0rTxubHLeLfWY1_Q4G93R4cLBOa2Vz64MVgTdDPNEPmn0gkcz5pwLImyGL5O5wLh5vEruyunMMahDjDq2hdN-iBg_jas15bw4PWqNiSIGfD6bUPeUvA7vsJUI5JVkcPuS1NPR5YZfMHzoT-D680FzUNp4qJPvsA0o-vsMcbJ27zMJev410X8DJx-YXRo-sChlH-X0KW4J7iDZp-XEARjp2wMuUSwjL15DN',
    },
    {
      num: '03 / NECKLACES',
      kicker: 'Explore the collection',
      title: 'Necklaces',
      action: 'Explore Necklaces',
      view: 'necklaces',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9FiqYgHxW8OiddAhm7FJHvhOgw5nCgSUcIntiRF4XkwLN4Y3i9A-UqLQtPkxHNgSt2aOSZNmjV4CkMknjSkTLUdUUkg8eDrE8JawNu5JJnS6h_KvPm3ioGIgp2WC36dJsiGhWSS2QOfNE-T_AGTnU_oRDTQsEDj1W68M4A-wClvZNHlDYnkiw6jVxANP-nm1-qiGgoAz9m0dmgec3GHS_C9HQUHtetiHE1Ok4-l3rsRryjYTyXDyw',
    },
    {
      num: '04 / BANGLES & BRACELETS',
      kicker: 'Explore the collection',
      title: 'Bangles & Bracelets',
      action: 'Explore Bangles & Bracelets',
      view: 'bangles-bracelets',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5byD9dRwnuowuRDcYjr1VpjQlWsiYzqCVwtZXdYIVI0zR90q4akLtco_3Wf9ZA4hzS0MkNXDoX2nFkuwphK6bvGZQquhW3UlRvBfIbOwvxWAT0q7WzuhV2smA_Umc4DnAUPrAtKSlpp08ahao50aP56ZF2gdTJ1mkPwUnbEt464iDQNhINUSRK8g4KzBXRttKhl7UzaXmqmZjGMhhqyO0oPGEwc8O7UfwE7Mgn5t_6V4lB41nbtW1',
    },
    {
      num: '05 / CATALOGUE',
      kicker: 'Explore the collection',
      title: 'Browse All Sample Jewellery',
      action: 'View All Pieces',
      view: 'shop',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5byD9dRwnuowuRDcYjr1VpjQlWsiYzqCVwtZXdYIVI0zR90q4akLtco_3Wf9ZA4hzS0MkNXDoX2nFkuwphK6bvGZQquhW3UlRvBfIbOwvxWAT0q7WzuhV2smA_Umc4DnAUPrAtKSlpp08ahao50aP56ZF2gdTJ1mkPwUnbEt464iDQNhINUSRK8g4KzBXRttKhl7UzaXmqmZjGMhhqyO0oPGEwc8O7UfwE7Mgn5t_6V4lB41nbtW1',
    },
  ];

  return (
    <section className="w-full py-16 lg:py-24 bg-[#fbf9f4]">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#765a18] mb-2">
            CURATED CATEGORIES
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#1b1c19] font-normal">
            Find Your Next Favourite Piece
          </h2>
          <div className="w-12 h-[1px] bg-[#DFC27F] mt-4" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <button
              key={cat.num}
              onClick={() => navigateTo(cat.view)}
              className="group flex flex-col text-left bg-[#f5f3ee] transition-all duration-500 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9E7B32] border border-[#e4e2dd]/60"
            >
              <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#F2EDE3]">
                <img
                  alt={cat.title}
                  src={cat.image}
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-[#1b1c19]/0 transition-colors duration-300 group-hover:bg-[#1b1c19]/10" />
                <span className="absolute bottom-3 right-3 bg-[#fbf9f4]/95 border border-[#C6A45B]/40 text-[#765a18] px-2.5 py-1 text-[9px] uppercase tracking-[0.14em] font-semibold">Preview</span>
                <span className="absolute top-4 left-4 text-[10px] tracking-widest uppercase bg-[#fbf9f4]/90 text-[#1b1c19] px-2.5 py-1 backdrop-blur-sm font-semibold">
                  {cat.num}
                </span>
              </div>

              <div className="p-6 flex flex-col justify-between flex-grow bg-[#f5f3ee] transition-colors duration-300 group-hover:bg-[#F2EDE3]">
                <div>
                  <p className="text-[11px] text-[#4d4545] uppercase tracking-[0.15em] mb-1 font-medium">
                    {cat.kicker}
                  </p>
                  <h3 className="font-serif-luxury text-xl text-[#1b1c19] font-normal">
                    {cat.title}
                  </h3>
                </div>

                <div className="mt-6 flex items-center justify-between pt-4 border-t border-[#e4e2dd]">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#765a18] group-hover:text-[#1b1c19] transition-colors">
                    {cat.action}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-[#765a18] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
