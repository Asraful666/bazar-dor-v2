"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/types";
import ProductSection from "@/components/ProductSection";
import ProductSkeleton from "@/components/ProductSkeleton";

export default function HomeProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch("/api/products", {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("পণ্যের তথ্য লোড করা যায়নি।");
        }

        const data: unknown = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("পণ্যের তথ্য সঠিক নয়।");
        }

        if (!controller.signal.aborted) {
          // /api/products ইতিমধ্যে প্রতিটি product validate করে।
          setProducts(data as Product[]);
        }
      } catch {
        if (!controller.signal.aborted) {
          setError("পণ্যের তথ্য লোড করা যায়নি। আবার চেষ্টা করুন।");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadProducts();

    return () => controller.abort();
  }, [attempt]);

  if (loading) {
    return (
      <div className="mt-10 space-y-10">
        <section>
          <h2 className="mb-5 text-xl font-bold">
            আজ দাম বেড়েছে ▲
          </h2>
          <ProductSkeleton />
        </section>

        <section>
          <h2 className="mb-5 text-xl font-bold">
            আজ দাম কমেছে ▼
          </h2>
          <ProductSkeleton />
        </section>

        <section id="সব-পণ্য">
          <h2 className="mb-5 text-xl font-bold">সব পণ্য</h2>
          <ProductSkeleton />
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <section
        id="সব-পণ্য"
        className="mt-10 rounded-2xl border border-[#dfe9e2] bg-[#fafcfb] p-8 text-center"
      >
        <p role="alert" className="text-red-600">
          {error}
        </p>

        <button
          type="button"
          onClick={() => setAttempt((value) => value + 1)}
          className="mt-5 rounded-lg bg-[#008c40] px-5 py-3 font-semibold text-white hover:bg-[#007535]"
        >
          আবার চেষ্টা করুন
        </button>
      </section>
    );
  }

  const risers = products
    .filter((product) => product.change.dir === "up")
    .sort(
      (a, b) =>
        Math.abs(b.change.pct) - Math.abs(a.change.pct)
    )
    .slice(0, 6);

  const fallers = products
    .filter((product) => product.change.dir === "down")
    .sort(
      (a, b) =>
        Math.abs(b.change.pct) - Math.abs(a.change.pct)
    )
    .slice(0, 6);

  const productCount = new Intl.NumberFormat("bn-BD").format(
    products.length
  );

  return (
    <>
      <ProductSection
        id="দাম-বেড়েছে"
        title="আজ দাম বেড়েছে ▲"
        subtitle="আজ সবচেয়ে বেশি দাম বেড়েছে যেসব পণ্যের।"
        products={risers}
      />

      <ProductSection
        id="দাম-কমেছে"
        title="আজ দাম কমেছে ▼"
        subtitle="আজ সবচেয়ে বেশি দাম কমেছে যেসব পণ্যের।"
        products={fallers}
      />

      <ProductSection
        id="সব-পণ্য"
        title="সব পণ্য"
        subtitle={`প্রয়োজনীয় সব পণ্যের আজকের দাম ও পরিবর্তন এক নজরে। মোট ${productCount}টি পণ্য দেখানো হচ্ছে।`}
        products={products}
      />
    </>
  );
}