export const Features = () => {
  return (
    <section className="bg-gray-200 py-12 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-violet-600  rounded-full flex items-center justify-center mx-auto text-white text-xl">
              ✓
            </div>
            <h3 className="font-semibold text-foreground">Free Shipping</h3>
            <p className="text-sm text-muted-foreground">On orders over $50</p>
          </div>
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-violet-600 rounded-full flex items-center justify-center mx-auto text-white text-xl">
              ↩
            </div>
            <h3 className="font-semibold text-foreground">Easy Returns</h3>
            <p className="text-sm text-muted-foreground">
              30-day return policy
            </p>
          </div>
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-violet-600  rounded-full flex items-center justify-center mx-auto text-white text-xl">
              🔒
            </div>
            <h3 className="font-semibold text-foreground">Secure Payment</h3>
            <p className="text-sm text-muted-foreground">
              Protected transactions
            </p>
          </div>
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-violet-600  rounded-full flex items-center justify-center mx-auto text-white text-xl">
              ◆
            </div>
            <h3 className="font-semibold text-foreground">Premium Quality</h3>
            <p className="text-sm text-muted-foreground">Curated collections</p>
          </div>
        </div>
      </div>
    </section>
  );
};
