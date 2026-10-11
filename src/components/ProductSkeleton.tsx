export default function ProductSkeleton() {
  return (
    <div role="status" aria-label="পণ্য লোড হচ্ছে">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-2xl border border-[#dfe9e2] bg-[#fafcfb] p-5"
          >
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-[#e4eee7]" />
              <div className="flex-1">
                <div className="h-4 w-3/4 rounded bg-[#e4eee7]" />
                <div className="mt-3 h-3 w-1/2 rounded bg-[#e4eee7]" />
              </div>
            </div>

            <div className="mt-5 h-3 w-20 rounded bg-[#e4eee7]" />
            <div className="mt-3 h-5 w-28 rounded bg-[#e4eee7]" />
          </div>
        ))}
      </div>

      <span className="sr-only">লোড হচ্ছে...</span>
    </div>
  );
}