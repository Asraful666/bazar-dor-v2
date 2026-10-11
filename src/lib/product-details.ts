import "server-only";

import { getProducts } from "@/lib/api";
import { toNumber } from "@/lib/format";

type MarketPrice = {
  market: string;
  division: string;
  min: number;
  max: number;
};

const API_URLS = [
  "https://openapi.programming-hero.com/api/bazardor",
  "https://api.api-store.workers.dev/api/bazardor",
  "https://api.abcz.workers.dev/api/bazardor",
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseMarkets(value: unknown): MarketPrice[] {
  if (!Array.isArray(value)) {
    throw new Error("Invalid market data");
  }

  return value.map((item) => {
    if (
      !isRecord(item) ||
      typeof item.market !== "string" ||
      typeof item.division !== "string"
    ) {
      throw new Error("Invalid market");
    }

    const min = toNumber(item.min);
    const max = toNumber(item.max);

    if (min < 0 || max < min) {
      throw new Error("Invalid market prices");
    }

    return {
      market: item.market,
      division: item.division,
      min,
      max,
    };
  });
}

export async function getProductDetails(slug: string) {
  const products = await getProducts();

  const product = products.find(
    (item) => item.slug === slug || String(item.id) === slug,
  );

  if (!product) return null;

  for (const baseURL of API_URLS) {
    try {
      const response = await fetch(`${baseURL}/products/${product.id}`, {
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      });

      if (!response.ok) continue;

      const payload: unknown = await response.json();

      const detail =
        isRecord(payload) && isRecord(payload.data)
          ? payload.data
          : payload;

      if (!isRecord(detail) || toNumber(detail.id) !== product.id) {
        continue;
      }

      return {
        ...product,
        categoryNameBn:
          typeof detail.categoryNameBn === "string"
            ? detail.categoryNameBn
            : product.category,
        markets: parseMarkets(detail.markets),
      };
    } catch {
      // পরের API দিয়ে আবার চেষ্টা করা হবে।
    }
  }

  throw new Error("পণ্যের বিস্তারিত তথ্য লোড করা যায়নি।");
}