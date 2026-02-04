import { ChevronRight } from "lucide-react";

export const Offer = () => {
  return (
    <>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-linear-to-r from-violet-800 to-violet-700 rounded-2xl p-8 sm:p-12 text-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wider text-white/80">
                Limited Time Offer
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold">Summer Sale</h2>
              <p className="text-lg text-white/90">
                Get up to 50% off on selected items. Grab your favorites before
                they're gone!
              </p>
              <button className="inline-flex items-center gap-2 bg-white text-indigo-600 font-semibold px-6 py-3 rounded-lg hover:bg-white/90 transition-colors mt-4">
                Shop Now
                <ChevronRight size={20} />
              </button>
            </div>
            <div className="h-64 bg-white/10 rounded-lg flex items-center justify-center">
              <p className="text-white/40 text-center">Featured Image</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
