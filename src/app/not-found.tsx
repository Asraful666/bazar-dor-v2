import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col items-center px-4 py-24 text-center">
      <p className="text-7xl font-bold text-[#008c40]">
        ৪০৪
      </p>

      <h1 className="mt-6 text-2xl font-bold">
        পেজটি পাওয়া যায়নি।
      </h1>

      <p className="mt-3 text-[#64756b]">
        লিংকটি ভুল হতে পারে অথবা এই পেজটি আর পাওয়া যাচ্ছে না।
      </p>

      <Link
        href="/"
        className="mt-8 rounded-lg bg-[#008c40] px-6 py-3 font-semibold text-white hover:bg-[#007535]"
      >
        হোম পেজে ফিরে যান
      </Link>
    </main>
  );
}