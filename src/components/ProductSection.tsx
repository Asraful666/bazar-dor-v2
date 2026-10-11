import type { Product } from "@/types";
import ProductCard from "@/components/ProductCard";

type Props = {
  id: string;
  title: string;
  subtitle?: string;
  products: Product[];
};

export default function ProductSection({
  id,
  title,
  subtitle,
  products,
}: Props) {
  const isRiser = id === "দাম-বেড়েছে";
  const isFaller = id === "দাম-কমেছে";

  const heading = title.replace(/[▲▼]/g, "").trim();

  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="mt-10 sm:mt-12"
    >
      <h2
        id={`${id}-title`}
        className="flex items-center gap-3 text-xl font-bold sm:text-2xl"
      >
        {(isRiser || isFaller) && (
          <span
            aria-hidden="true"
            className={
              isRiser ? "text-red-600" : "text-[#169c52]"
            }
          >
            {isRiser ? "▲" : "▼"}
          </span>
        )}

        {heading}
      </h2>

      {subtitle && !isRiser && !isFaller && (
        <p className="mt-2 text-sm text-[#64756b] sm:text-base">
          {subtitle}
        </p>
      )}

      {products.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="mt-6 rounded-2xl border border-[#dfe9e2] bg-[#fafcfb] p-6 text-[#64756b]">
          এই তালিকায় কোনো পণ্য পাওয়া যায়নি।
        </p>
      )}
    </section>
  );
}