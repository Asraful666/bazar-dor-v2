import Link from "next/link";
import { notFound } from "next/navigation";
import { getProducts } from "@/lib/api";
import CategoryProducts from "@/components/CategoryProducts";
import type { Product } from "@/types";

const categories: Record<
  string,
  { name: string; icon: string }
> = {
  chal: { name: "চাল", icon: "🍚" },
  dal: { name: "ডাল", icon: "🫘" },
  tel: { name: "তেল", icon: "🫙" },
  sobji: { name: "সবজি", icon: "🥬" },
  mach: { name: "মাছ", icon: "🐟" },
  mangsho: { name: "মাংস", icon: "🍗" },
  "dim-dui": { name: "ডিম-দুধ", icon: "🥛" },
  mosla: { name: "মসলা", icon: "🌶️" },
};

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const category = Object.hasOwn(categories, slug)
    ? categories[slug]
    : undefined;

  if (!category) {
    notFound();
  }

  let products: Product[];

  try {
    products = await getProducts();
  } catch {
    return (
      <main className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-2xl font-bold">
          পণ্যের তথ্য লোড করা যায়নি।
        </h1>
        <p className="mt-3 text-[#64756b]">
          কিছুক্ষণ পরে পেজটি আবার লোড করুন।
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-[#008c40] px-5 py-3 text-white"
        >
          হোম পেজে ফিরে যান
        </Link>
      </main>
    );
  }

  const categoryProducts = products.filter(
    (product) => product.category === slug
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="rounded-2xl border border-[#dfe9e2] bg-[#fafcfb] p-6">
        <h1 className="flex items-center gap-3 text-2xl font-bold">
          <span aria-hidden="true">{category.icon}</span>
          {category.name}
        </h1>

        <p className="mt-2 text-sm text-[#64756b]">
          {category.name} বিভাগের আজকের দাম ও পরিবর্তন।
        </p>
      </div>

      <CategoryProducts
        key={slug}
        products={categoryProducts}
      />
    </main>
  );
}