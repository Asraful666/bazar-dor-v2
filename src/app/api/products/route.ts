import { getProducts } from "@/lib/api";

export async function GET() {
  try {
    const products = await getProducts();

    return Response.json(products, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error(
      "Products API:",
      error instanceof Error ? error.message : "Unknown error"
    );

    return Response.json(
      {
        message: "পণ্যের তথ্য লোড করা যায়নি। আবার চেষ্টা করুন।",
      },
      { status: 502 }
    );
  }
}