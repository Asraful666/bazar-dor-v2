"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import PriceTicker from "@/components/PriceTicker";

const categories = [
  { slug: "chal", name: "চাল", icon: "🍚" },
  { slug: "dal", name: "ডাল", icon: "🫘" },
  { slug: "tel", name: "তেল", icon: "🫙" },
  { slug: "sobji", name: "সবজি", icon: "🥬" },
  { slug: "mach", name: "মাছ", icon: "🐟" },
  { slug: "mangsho", name: "মাংস", icon: "🍗" },
  { slug: "dim-dui", name: "ডিম-দুধ", icon: "🥛" },
  { slug: "mosla", name: "মসলা", icon: "🌶️" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [date, setDate] = useState("");

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("bn-BD", {
      timeZone: "Asia/Dhaka",
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    function updateDate() {
      setDate(formatter.format(new Date()));
    }

    updateDate();

    const timer = window.setInterval(updateDate, 60_000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <>
      <header className="border-b border-[#e8eee9] bg-[#fafcfb]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#008c40]">
              <Image
                src="/images/logo-icon.png"
                alt=""
                width={18}
                height={18}
              />
            </span>

            <div>
              <p className="text-xl font-bold leading-7">
                বাজার দর
              </p>

              <p className="min-h-4 text-[11px] text-[#64756b] sm:text-xs">
                {date || "আজকের বাজারদর"}
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/signin"
              className="rounded-lg px-3 py-2 text-sm font-semibold hover:bg-[#edf5ef]"
            >
              সাইন ইন
            </Link>

            <Link
              href="/signup"
              className="rounded-lg bg-[#008c40] px-4 py-2 text-sm font-semibold text-white hover:bg-[#007535]"
            >
              সাইন আপ
            </Link>
          </div>
        </div>
      </header>

      <nav
        aria-label="পণ্যের বিভাগ"
        className="border-b border-[#dfe9e2] bg-[#fafcfb]"
      >
        <div className="mx-auto max-w-6xl overflow-x-auto px-4 sm:px-6">
          <div className="flex w-max items-center gap-2 py-2 sm:gap-4">
            {categories.map((category) => {
              const href = `/category/${category.slug}`;
              const active = pathname === href;

              return (
                <Link
                  key={category.slug}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-[#008c40] text-white"
                      : "hover:bg-[#e5f2e9]"
                  }`}
                >
                  <span aria-hidden="true">{category.icon}</span>
                  {category.name}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <PriceTicker />
    </>
  );
}