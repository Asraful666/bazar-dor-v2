import type { Product } from "@/types";
import { toNumber } from "@/lib/format";

const BASE_URLS = [
  "https://openapi.programming-hero.com/api/bazardor",
  "https://api.api-store.workers.dev/api/bazardor",
  "https://api.abcz.workers.dev/api/bazardor",
];

function isRecord(
  value: unknown
): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseProduct(value: unknown): Product {
  if (!isRecord(value) || !isRecord(value.change)) {
    throw new Error("Invalid product data");
  }

  const textFields = [
    "slug",
    "nameBn",
    "category",
    "image",
    "unit",
  ] as const;

  for (const field of textFields) {
    if (typeof value[field] !== "string") {
      throw new Error(`Invalid product field: ${field}`);
    }
  }

  const direction = value.change.dir;

  if (
    direction !== "up" &&
    direction !== "down" &&
    direction !== "flat"
  ) {
    throw new Error("Invalid price change direction");
  }

  const id = toNumber(value.id);

  if (!Number.isInteger(id)) {
    throw new Error("Invalid product ID");
  }

  return {
    id,
    slug: value.slug as string,
    nameBn: value.nameBn as string,
    category: value.category as string,
    image: value.image as string,
    unit: value.unit as string,
    today: toNumber(value.today),
    change: {
      dir: direction,
      pct: toNumber(value.change.pct),
    },
  };
}

function extractProducts(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;

  if (isRecord(data)) {
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.products)) return data.products;
  }

  throw new Error("Invalid product response");
}

export async function getProducts(): Promise<Product[]> {
  for (const baseURL of BASE_URLS) {
    try {
      const response = await fetch(`${baseURL}/products`, {
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      });

      if (!response.ok) {
        throw new Error(`Product API returned ${response.status}`);
      }

      const data: unknown = await response.json();

      return extractProducts(data).map(parseProduct);
    } catch {
      // Request বা data validation fail হলে পরের API চেষ্টা করি।
    }
  }

  throw new Error("বাজারদর পাওয়া যাচ্ছে না। আবার চেষ্টা করুন।");
}