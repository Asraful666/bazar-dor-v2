import Hero from "@/components/Hero";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Hero />

      <section
        id="সব-পণ্য"
        className="mt-10 rounded-2xl border border-[#dfe9e2] bg-[#fafcfb] p-6"
      >
        <h2 className="text-2xl font-bold">সব পণ্য</h2>
        <p className="mt-2 text-[#64756b]">
          নিত্যপ্রয়োজনীয় পণ্যের আজকের দাম।
        </p>
      </section>
    </main>
  );
}