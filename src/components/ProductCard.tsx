import Link from "next/link";
import type { Product } from "@/types";
import {
  formatNumber,
  formatPercent,
  formatUnit,
} from "@/lib/format";

export default function ProductCard({
  product,
}: {
  product: Product;
}) {
  const direction = product.change.dir;

  const symbol =
    direction === "up" ? "▲" : direction === "down" ? "▼" : "—";

  const badgeColor =
  direction === "up"
    ? "bg-[#eff5f0] text-red-600"
    : direction === "down"
      ? "bg-[#eff5f0] text-[#169c52]"
      : "bg-gray-100 text-gray-500";

  return (
    <Link
      href={`/product/${encodeURIComponent(product.slug)}`}
      className="group block rounded-2xl border border-[#dfe9e2] bg-[#fafcfb] p-5 transition hover:border-[#9dceb0] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-700"
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#edf5ef] text-2xl"
        >
          {product.image}
        </span>

        <div className="min-w-0">
          <h3 className="text-base leading-6 font-semibold group-hover:text-[#008c40]">
            {product.nameBn}
          </h3>

          <p className="mt-1 text-sm text-[#64756b]">
            {formatUnit(product.unit)}
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-end justify-between gap-2">
        <div>
          <p className="text-xs text-[#64756b]">আজকের দাম</p>
          <p className="mt-1 text-xl font-bold">
            {formatNumber(product.today)}
            <span className="ml-1 text-sm font-normal">টাকা</span>
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${badgeColor}`}
        >
          {symbol} {formatPercent(product.change.pct)}%
        </span>
      </div>
    </Link>
  );
}