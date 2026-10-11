import Image from "next/image";

export default function Hero() {
  return (
    <section className="grid items-center gap-8 rounded-3xl border border-[#dfe9e2] bg-[#fafcfb] p-6 sm:p-10 lg:grid-cols-[1.5fr_1fr]">
      <div>
        <p className="inline-block rounded-full bg-[#e2f2e7] px-4 py-1.5 text-sm font-medium text-[#008c40]">
          প্রতিদিনের বাজারদর এক জায়গায়
        </p>

        <h1 className="mt-5 text-3xl leading-[1.4] font-bold sm:text-4xl lg:text-5xl">
          আজকের বাজারের দাম এক নজরে
        </h1>

        <p className="mt-5 max-w-xl text-base leading-7 text-[#64756b]">
          চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম —
          বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বোচ্চ এবং
          দামের পরিবর্তন এক জায়গায়।
        </p>

        <a
          href="#সব-পণ্য"
          className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#008c40] px-6 py-3 font-semibold text-white transition hover:bg-[#007535] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-700"
        >
          সব পণ্য দেখুন
          <span aria-hidden="true">↓</span>
        </a>
      </div>

      <div className="flex justify-center">
        <Image
          src="/images/bazar-hero.png"
          alt="বাজারের ফলভর্তি ঝুড়ি"
          width={315}
          height={263}
          priority
          className="h-auto w-full max-w-[280px] object-contain sm:max-w-[315px]"
        />
      </div>
    </section>
  );
}