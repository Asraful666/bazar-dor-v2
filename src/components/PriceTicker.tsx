"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/types";
import {
  formatNumber,
  formatPercent,
  formatUnit,
} from "@/lib/format";

export default function PriceTicker() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadPrices() {
      try {
        const response = await fetch("/api/products", {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Prices unavailable");
        }

        const data: unknown = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid product response");
        }

        if (!controller.signal.aborted) {
          setProducts(data as Product[]);
        }
      } catch {
        if (!controller.signal.aborted) {
          setError(true);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadPrices();

    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <div
        role="status"
        className="overflow-hidden border-b border-[#dfe9e2] bg-[#fafcfb] px-4 py-3"
      >
        <div className="mx-auto flex max-w-6xl animate-pulse gap-6">
          {[0, 1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-4 w-56 shrink-0 rounded bg-[#e4eee7]"
            />
          ))}
        </div>
        <span className="sr-only">বাজারদর লোড হচ্ছে...</span>
      </div>
    );
  }

  if (error || products.length === 0) {
    return (
      <div
        role="status"
        className="border-b border-[#dfe9e2] bg-[#fafcfb] px-4 py-3 text-center text-xs text-[#64756b]"
      >
        {error
          ? "বাজারদর লোড করা যায়নি।"
          : "এই মুহূর্তে বাজারদর পাওয়া যায়নি।"}
      </div>
    );
  }

  return (
    <section
      aria-label="আজকের বাজারদর"
      tabIndex={0}
      className="price-ticker overflow-hidden border-b border-[#dfe9e2] bg-[#fafcfb] focus-visible:outline-2 focus-visible:outline-green-700"
    >
      <div className="ticker-track flex w-max">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            aria-hidden={copy === 1 ? true : undefined}
            className="flex shrink-0 items-center"
          >
            {products.map((product) => {
              const direction = product.change.dir;

              const symbol =
                direction === "up"
                  ? "▲"
                  : direction === "down"
                    ? "▼"
                    : "—";

              const color =
                direction === "up"
                  ? "text-red-600"
                  : direction === "down"
                    ? "text-[#169c52]"
                    : "text-[#64756b]";

              const unit = formatUnit(product.unit).replace(
                /^প্রতি\s+/,
                ""
              );

              return (
                <div
                  key={`${copy}-${product.id}`}
                  className="flex shrink-0 items-center gap-2 whitespace-nowrap border-r border-[#e5eee8] px-5 py-3 text-xs sm:text-sm"
                >
                  <span aria-hidden="true">{product.image}</span>

                  <span className="font-medium">
                    {product.nameBn}
                  </span>

                  <span>
                    {formatNumber(product.today)} টাকা/{unit}
                  </span>

                  <span className={`font-semibold ${color}`}>
                    {symbol} {formatPercent(product.change.pct)}%
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}