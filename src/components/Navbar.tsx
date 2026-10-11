"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
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
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [date, setDate] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

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

  useEffect(() => {
    function handleOutsideClick(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !menuRef.current?.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && menuOpen) {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }

    function handleFocusOutside(event: FocusEvent) {
      if (
        event.target instanceof Node &&
        !menuRef.current?.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    document.addEventListener("focusin", handleFocusOutside);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("focusin", handleFocusOutside);
    };
  }, [menuOpen]);

  async function handleSignOut() {
    if (signingOut) return;

    setSigningOut(true);

    try {
      const result = await authClient.signOut();

      if (result.error) {
        toast.error(
          result.error.message || "সাইন আউট হয়নি। আবার চেষ্টা করুন।"
        );
        return;
      }

      setMenuOpen(false);
      toast.success("সাইন আউট সফল হয়েছে।");
      router.replace("/");
      router.refresh();
    } catch {
      toast.error("সংযোগে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setSigningOut(false);
    }
  }

  const user = session?.user;

  return (
    <>
      <header className="border-b border-[#e8eee9] bg-[#fafcfb]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3"
          >
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

          {isPending ? (
            <div
              role="status"
              className="h-10 w-28 animate-pulse rounded-lg bg-[#e4eee7]"
            >
              <span className="sr-only">প্রোফাইল লোড হচ্ছে...</span>
            </div>
          ) : user ? (
            <div ref={menuRef} className="relative">
              <button
                ref={menuButtonRef}
                type="button"
                aria-expanded={menuOpen}
                aria-controls="navbar-profile"
                onClick={() => setMenuOpen((value) => !value)}
                className="flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-[#edf5ef]"
              >
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e2f2e7] font-bold text-[#008c40]"
                >
                  {user.name.trim().charAt(0) || "👤"}
                </span>

                <span className="max-w-24 truncate text-sm sm:max-w-40">
                  {user.name}
                </span>

                <span aria-hidden="true" className="text-xs">
                  {menuOpen ? "▴" : "▾"}
                </span>
              </button>

              {menuOpen && (
                <div
                  id="navbar-profile"
                  className="absolute top-full right-0 z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-[#dfe9e2] bg-[#fafcfb] shadow-lg"
                >
                  <div className="border-b border-[#e8eee9] px-5 py-4">
                    <p className="truncate text-sm font-semibold">
                      {user.name}
                    </p>
                    <p className="mt-1 break-all text-xs text-[#64756b]">
                      {user.email}
                    </p>
                  </div>

                  <div className="py-2">
                    <Link
                      href="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="block px-5 py-3 text-sm hover:bg-[#edf5ef]"
                    >
                      👤 আমার প্রোফাইল
                    </Link>

                    <button
                      type="button"
                      disabled={signingOut}
                      onClick={handleSignOut}
                      className="block w-full px-5 py-3 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-60"
                    >
                      {signingOut
                        ? "সাইন আউট হচ্ছে..."
                        : "↪ সাইন আউট"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
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
          )}
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
                  onClick={() => setMenuOpen(false)}
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