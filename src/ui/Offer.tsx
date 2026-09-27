import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Tag, Timer } from "lucide-react";
import { routes } from "@/utils/routes";

export const Offer = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-950 via-indigo-900 to-slate-950 border border-violet-500/20 shadow-2xl p-8 sm:p-12 lg:p-16 text-white">
        {/* Glow blur background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Text & CTA (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/20 border border-violet-400/30 text-violet-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Tag size={13} />
              <span>Limited Time Seasonal Event</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Summer Clearance Sale <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-rose-300">
                Up to 50% Off Everything
              </span>
            </h2>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Upgrade your collection with signature accessories, casual wear, and tech essentials before stock runs out. Free express shipping included.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href={routes.PRODUCTS}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-sm shadow-xl transition-all hover:scale-103 active:scale-98"
              >
                <span>Shop the Sale</span>
                <ArrowRight size={17} />
              </Link>

              <div className="inline-flex items-center gap-2 text-xs font-semibold text-violet-300 bg-white/10 px-4 py-3 rounded-2xl backdrop-blur-md border border-white/10">
                <Timer size={16} />
                <span>Ends in 48 Hours</span>
              </div>
            </div>
          </div>

          {/* Right Image Feature (5 cols) */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-sm aspect-4/3 sm:aspect-square rounded-3xl overflow-hidden shadow-2xl border border-white/20 group">
              <Image
                src="https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80"
                alt="Fossil Chronograph Watch Special Deal"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                sizes="(max-width: 1024px) 100vw, 400px"
              />

              {/* Floating Discount Pill */}
              <div className="absolute top-4 right-4 bg-rose-600/95 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full font-black text-xs shadow-lg uppercase tracking-wider">
                50% OFF
              </div>

              {/* Floating Bottom Card */}
              <div className="absolute inset-x-4 bottom-4 p-4 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-white/15 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-violet-300 uppercase">Featured Deal</p>
                    <p className="text-sm font-extrabold text-white">Fossil Townsman Watch</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 line-through mr-1.5">₹9,999</span>
                    <span className="text-lg font-black text-amber-400">₹4,999</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
