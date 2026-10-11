export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[#dfe9e2] bg-[#fafcfb]">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-5 text-sm sm:px-6 md:flex-row md:items-center md:justify-between">
        <p className="text-[#64756b]">
          <span className="font-semibold text-[#182b24]">
            বাজার দর
          </span>
          {" "}— প্রয়োজনীয় পণ্যের দাম এক নজরে।
        </p>

        <p className="max-w-md text-xs leading-6 text-[#64756b] md:text-right">
          সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
        </p>
      </div>
    </footer>
  );
}