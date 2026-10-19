import React from 'react';
import { useShop } from '../context/ShopContext';
import { ArrowUpRight } from 'lucide-react';

export const CuratedCategories: React.FC = () => {
  const { navigateTo } = useShop();

  const categories = [
    {
      num: '01',
      title: 'Rings',
      action: 'Explore Rings',
      view: 'rings',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKyw8-mnzt9cB285WanV7WNdJogBmtek50VPEy9PvejmgD3uaq9eINzPa4I7KeFWjKwsfPFkHgQRQAH-agbWe3aj4f85ZEvdhKEV75FnHurvLQw7RLhgRkoCRTOc6UkyDy8fpAsBIIV9Ps_ikfBiwGDWSqrb2TKhHntmRQcL6XJnBOjl6UM8z3f27jl0BUlTxXKPBrhoOFbdAHIe-UUw5-pyNbF49jLl30eLzCfNy1U73vlOCDYIkh',
    },
    {
      num: '02',
      title: 'Earrings',
      action: 'Explore Earrings',
      view: 'earrings',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRcymyOiMv32lVpJeJps0rTxubHLeLfWY1_Q4G93R4cLBOa2Vz64MVgTdDPNEPmn0gkcz5pwLImyGL5O5wLh5vEruyunMMahDjDq2hdN-iBg_jas15bw4PWqNiSIGfD6bUPeUvA7vsJUI5JVkcPuS1NPR5YZfMHzoT-D680FzUNp4qJPvsA0o-vsMcbJ27zMJev410X8DJx-YXRo-sChlH-X0KW4J7iDZp-XEARjp2wMuUSwjL15DN',
    },
    {
      num: '03',
      title: 'Necklaces',
      action: 'Explore Necklaces',
      view: 'necklaces',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9FiqYgHxW8OiddAhm7FJHvhOgw5nCgSUcIntiRF4XkwLN4Y3i9A-UqLQtPkxHNgSt2aOSZNmjV4CkMknjSkTLUdUUkg8eDrE8JawNu5JJnS6h_KvPm3ioGIgp2WC36dJsiGhWSS2QOfNE-T_AGTnU_oRDTQsEDj1W68M4A-wClvZNHlDYnkiw6jVxANP-nm1-qiGgoAz9m0dmgec3GHS_C9HQUHtetiHE1Ok4-l3rsRryjYTyXDyw',
    },
    {
      num: '04',
      title: 'Bangles & Bracelets',
      action: 'Explore Bangles & Bracelets',
      view: 'bangles-bracelets',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5byD9dRwnuowuRDcYjr1VpjQlWsiYzqCVwtZXdYIVI0zR90q4akLtco_3Wf9ZA4hzS0MkNXDoX2nFkuwphK6bvGZQquhW3UlRvBfIbOwvxWAT0q7WzuhV2smA_Umc4DnAUPrAtKSlpp08ahao50aP56ZF2gdTJ1mkPwUnbEt464iDQNhINUSRK8g4KzBXRttKhl7UzaXmqmZjGMhhqyO0oPGEwc8O7UfwE7Mgn5t_6V4lB41nbtW1',
    },
  ];

  return (
    <section className="w-full py-20 lg:py-28 bg-background" aria-labelledby="categories-heading">
      <div className="shell">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <p className="eyebrow mb-3">Curated Categories</p>
            <h2 id="categories-heading" className="font-serif-luxury text-3xl sm:text-5xl text-foreground tracking-tight">
              Find Your Next Favourite Piece
            </h2>
          </div>
          <button
            onClick={() => navigateTo('shop')}
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-foreground rounded-sm w-fit"
          >
            View the full collection
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <button
              key={cat.view}
              onClick={() => navigateTo(cat.view)}
              aria-label={cat.action}
              className="group text-left rounded-[1.5rem]"
            >
              <div className="relative w-full aspect-[3/4] overflow-hidden rounded-[1.5rem] bg-secondary">
                <img
                  alt=""
                  src={cat.image}
                  className="w-full h-full object-cover object-center transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/55 via-foreground/0 to-transparent" aria-hidden="true" />
                <div className="absolute inset-x-0 bottom-0 p-5 flex items-end justify-between gap-3 text-primary-foreground">
                  <div>
                    <span className="block text-[11px] tracking-[0.2em] opacity-80">{cat.num}</span>
                    <h3 className="font-serif-luxury text-2xl mt-1">{cat.title}</h3>
                  </div>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-background/20 backdrop-blur-md transition-colors group-hover:bg-background/35" aria-hidden="true">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
        <p className="mt-6 text-xs text-muted-foreground">Category photography is illustrative and does not represent specific pieces for sale.</p>
      </div>
    </section>
  );
};
