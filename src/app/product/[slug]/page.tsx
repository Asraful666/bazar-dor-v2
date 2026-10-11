import { Suspense } from "react";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getProductDetails } from "@/lib/product-details";
import { formatNumber, formatUnit } from "@/lib/format";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function DetailsSkeleton() {
  return (
    <main
      role="status"
      className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8"
    >
      <span className="sr-only">পণ্যের তথ্য লোড হচ্ছে...</span>
      <div className="h-5 w-48 animate-pulse rounded bg-[#dfe9e2]" />
      <div className="h-44 animate-pulse rounded-2xl bg-[#dfe9e2]" />
      <div className="h-[600px] animate-pulse rounded-2xl bg-[#dfe9e2]" />
    </main>
  );
}

async function ProductContent({ params }: PageProps) {
  const { slug } = await params;

  let product: Awaited<ReturnType<typeof getProductDetails>>;

  try {
    product = await getProductDetails(slug);
  } catch {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-12">
        <section className="rounded-2xl border border-[#dfe9e2] bg-[#fafcfb] p-8 text-center">
          <h1 className="text-xl font-bold">
            পণ্যের তথ্য লোড করা যায়নি।
          </h1>
          <p className="mt-3 text-[#64756c]">
            কিছুক্ষণ পর আবার চেষ্টা করুন।
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-lg bg-[#008c40] px-5 py-3 font-semibold text-white"
          >
            হোম পেজে ফিরে যান
          </Link>
        </section>
      </main>
    );
  }

  if (!product) notFound();

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/signin?reason=login_required");
  }

  const { markets } = product;

  const minimum = markets.length
    ? Math.min(...markets.map((market) => market.min))
    : null;

  const maximum = markets.length
    ? Math.max(...markets.map((market) => market.max))
    : null;

  const average = markets.length
    ? markets.reduce(
        (total, market) => total + (market.min + market.max) / 2,
        0,
      ) / markets.length
    : null;

  const cheapestMarket = markets.find((market) => market.min === minimum);
  const highestMarket = markets.find((market) => market.max === maximum);

  const summaries = [
    {
      label: "সর্বনিম্ন দাম",
      value: minimum,
      detail: cheapestMarket?.market || "তথ্য নেই",
      color: "text-[#008c40]",
    },
    {
      label: "সর্বোচ্চ দাম",
      value: maximum,
      detail: highestMarket?.market || "তথ্য নেই",
      color: "text-[#e54848]",
    },
    {
      label: "গড় দাম",
      value: average,
      detail: `${formatNumber(markets.length)}টি বাজারের গড় দাম`,
      color: "text-[#008c40]",
    },
  ];

  const changeColor =
    product.change.dir === "up"
      ? "text-[#e54848]"
      : product.change.dir === "down"
        ? "text-[#008c40]"
        : "text-[#64756c]";

  const changeSymbol =
    product.change.dir === "up"
      ? "▲"
      : product.change.dir === "down"
        ? "▼"
        : "—";

  const changePercent = new Intl.NumberFormat("bn-BD", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(Math.abs(product.change.pct));

  function price(value: number | null) {
    return value === null ? "তথ্য নেই" : `${formatNumber(value)} টাকা`;
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-7 sm:pb-24">
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex flex-wrap items-center gap-2 text-sm"
      >
        <Link href="/" className="text-[#64756c] hover:text-[#008c40]">
          হোম
        </Link>
        <span aria-hidden="true" className="text-[#64756c]">›</span>
        <Link
          href={`/category/${product.category}`}
          className="text-[#64756c] hover:text-[#008c40]"
        >
          {product.categoryNameBn}
        </Link>
        <span aria-hidden="true" className="text-[#64756c]">›</span>
        <span aria-current="page" className="text-[#182b24]">
          {product.nameBn}
        </span>
      </nav>

      <section className="flex flex-col gap-5 rounded-2xl border border-[#dfe9e2] bg-[#fafcfb] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#eff5f0] text-5xl">
            {product.image}
          </div>

          <div>
            <h1 className="text-2xl font-bold leading-tight text-[#182b24] sm:text-3xl">
              {product.nameBn}
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-[#64756c]">
              <span>{formatUnit(product.unit)}</span>
              <span aria-hidden="true">·</span>
              <Link
                href={`/category/${product.category}`}
                className="hover:text-[#008c40] hover:underline"
              >
                {product.categoryNameBn}
              </Link>
            </div>

            <p className="mt-2 text-sm text-[#182b24]">
              বিভিন্ন বাজারের আজকের দাম দেখুন এক নজরে।
            </p>
          </div>
        </div>

        <div className="shrink-0 rounded-2xl bg-[#eff5f0] px-5 py-4 text-center sm:min-w-32">
          <p className="text-xs text-[#64756c]">আজকের দাম</p>
          <p className="mt-1 text-3xl font-bold text-[#182b24]">
            {formatNumber(product.today)}
          </p>
          <p className="mt-1 text-xs text-[#64756c]">
            টাকা / {formatUnit(product.unit).replace(/^প্রতি\s*/, "")}
          </p>
          <p className={`mt-2 text-xs font-semibold ${changeColor}`}>
            {changeSymbol} {changePercent}%
          </p>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-[#dfe9e2] bg-[#fafcfb] p-4 sm:p-5">
        <h2 className="text-lg font-bold text-[#182b24]">
          দামের সারসংক্ষেপ
        </h2>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {summaries.map((summary) => (
            <div
              key={summary.label}
              className="rounded-2xl border border-[#dfe9e2] p-4"
            >
              <p className="text-sm text-[#64756c]">
                {summary.label}
              </p>
              <p className={`mt-1 text-2xl font-bold ${summary.color}`}>
                {price(summary.value)}
              </p>
              <p className="mt-1 text-xs text-[#64756c]">
                {summary.detail}
              </p>
            </div>
          ))}
        </div>

        <h2 className="mb-4 mt-7 text-lg font-bold text-[#182b24]">
          বাজারভিত্তিক আজকের দাম
        </h2>

        {markets.length === 0 ? (
          <p className="py-6 text-[#64756c]">
            এই পণ্যের বাজারভিত্তিক দাম এখনও পাওয়া যায়নি।
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-[#dfe9e2]">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <caption className="sr-only">
                {product.nameBn} — বাজারভিত্তিক দাম, টাকায়
              </caption>

              <thead className="bg-[#fafcfb] text-[#64756c]">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left font-medium">
                    বাজার
                  </th>
                  <th scope="col" className="px-4 py-3 text-left font-medium">
                    বিভাগ
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">
                    সর্বনিম্ন
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">
                    সর্বোচ্চ
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">
                    গড়
                  </th>
                </tr>
              </thead>

              <tbody>
                {markets.map((market, index) => (
                  <tr
                    key={`${market.market}-${index}`}
                    className="border-t border-[#a9b5ad] odd:bg-[#fafcfb] even:bg-[#eff5f0]"
                  >
                    <td className="border-r border-[#a9b5ad] px-4 py-3 font-medium">
                      {market.market}
                    </td>
                    <td className="border-r border-[#a9b5ad] px-4 py-3">
                      {market.division}
                    </td>
                    <td className="whitespace-nowrap border-r border-[#a9b5ad] px-4 py-3 text-right">
                      {price(market.min)}
                    </td>
                    <td className="whitespace-nowrap border-r border-[#a9b5ad] px-4 py-3 text-right">
                      {price(market.max)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right font-semibold">
                      {price((market.min + market.max) / 2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default function ProductPage(props: PageProps) {
  return (
    <Suspense fallback={<DetailsSkeleton />}>
      <ProductContent {...props} />
    </Suspense>
  );
}