import ProductSkeleton from "@/components/ProductSkeleton";

export default function CategoryLoading() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div
        aria-hidden="true"
        className="mb-6 animate-pulse rounded-2xl border border-[#dfe9e2] bg-[#fafcfb] p-6"
      >
        <div className="h-7 w-40 rounded bg-[#e4eee7]" />
        <div className="mt-4 h-4 w-56 rounded bg-[#e4eee7]" />
      </div>

      <ProductSkeleton />
    </main>
  );
}