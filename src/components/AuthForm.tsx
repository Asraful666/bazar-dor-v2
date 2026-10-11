"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import SocialLoginButtons from "@/components/SocialLoginButtons";

export default function AuthForm({
  mode,
}: {
  mode: "signin" | "signup";
}) {
  const router = useRouter();
  const isSignup = mode === "signup";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function showError(message: string) {
    setErrorMessage(message);
    toast.error(message);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;

    setErrorMessage("");

    if (isSignup && (!name.trim() || name.trim().length > 100)) {
      showError("নাম ১ থেকে ১০০ অক্ষরের মধ্যে লিখুন।");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      showError("সঠিক ইমেইল লিখুন।");
      return;
    }

    if (password.length < 8 || password.length > 128) {
      showError("পাসওয়ার্ড ৮ থেকে ১২৮ অক্ষরের মধ্যে হতে হবে।");
      return;
    }

    if (isSignup && password !== confirmPassword) {
      showError("পাসওয়ার্ড ও নিশ্চিত পাসওয়ার্ড একই হতে হবে।");
      return;
    }

    setBusy(true);

    try {
      if (isSignup) {
        const result = await authClient.signUp.email({
          name: name.trim(),
          email: email.trim(),
          password,
        });

        if (result.error) {
          showError(result.error.message || "রেজিস্ট্রেশন হয়নি।");
          return;
        }

        toast.success("রেজিস্ট্রেশন সম্পন্ন হয়েছে। এখন সাইন ইন করুন।");
        router.replace("/signin");
      } else {
        const result = await authClient.signIn.email({
          email: email.trim(),
          password,
        });

        if (result.error) {
          showError(
            result.error.message || "ইমেইল বা পাসওয়ার্ড সঠিক নয়।"
          );
          return;
        }

        toast.success("সাইন ইন সফল হয়েছে।");
        router.replace("/");
        router.refresh();
      }
    } catch {
      showError("সংযোগে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setBusy(false);
    }
  }

  const inputStyle =
    "mt-2 w-full rounded-lg border border-[#dfe9e2] bg-white px-3 py-3 text-sm outline-none focus:border-[#008c40] focus:ring-2 focus:ring-green-100 disabled:opacity-60";

  return (
    <main className="mx-auto max-w-md px-4 py-12 sm:py-16">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold">
          {isSignup ? "অ্যাকাউন্ট তৈরি করুন" : "সাইন ইন"}
        </h1>
        <p className="mt-2 text-sm text-[#64756b]">
          {isSignup
            ? "বাজার দর ব্যবহার করতে নতুন অ্যাকাউন্ট খুলুন।"
            : "আপনার অ্যাকাউন্টে প্রবেশ করুন।"}
        </p>
      </div>

      <div className="rounded-2xl border border-[#dfe9e2] bg-[#fafcfb] p-6">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-4"
        >
          {isSignup && (
            <div>
              <label htmlFor="name" className="text-sm font-medium">
                নাম
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={100}
                disabled={busy}
                required
                className={inputStyle}
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="text-sm font-medium">
              ইমেইল
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={busy}
              required
              className={inputStyle}
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-medium">
              পাসওয়ার্ড
            </label>

            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete={
                  isSignup ? "new-password" : "current-password"
                }
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={8}
                maxLength={128}
                disabled={busy}
                required
                className={`${inputStyle} pr-16`}
              />

              <button
                type="button"
                disabled={busy}
                aria-label={
                  showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখান"
                }
                aria-pressed={showPassword}
                onClick={() => setShowPassword((value) => !value)}
                className="absolute top-1/2 right-3 mt-1 -translate-y-1/2 text-xs text-[#008c40]"
              >
                {showPassword ? "লুকান" : "দেখান"}
              </button>
            </div>
          </div>

          {isSignup && (
            <div>
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium"
              >
                পাসওয়ার্ড নিশ্চিত করুন
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                minLength={8}
                maxLength={128}
                disabled={busy}
                required
                className={inputStyle}
              />
            </div>
          )}

          {errorMessage && (
            <p role="alert" className="text-sm text-red-600">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-lg bg-[#008c40] px-4 py-3 font-semibold text-white hover:bg-[#007535] disabled:cursor-wait disabled:opacity-60"
          >
            {busy
              ? "অপেক্ষা করুন..."
              : isSignup
                ? "সাইন আপ"
                : "সাইন ইন"}
          </button>
        </form>
        <SocialLoginButtons />

        <p className="mt-6 text-center text-sm text-[#64756b]">
          {isSignup ? "আগেই অ্যাকাউন্ট আছে? " : "অ্যাকাউন্ট নেই? "}
          <Link
            href={isSignup ? "/signin" : "/signup"}
            className="font-semibold text-[#008c40] hover:underline"
          >
            {isSignup ? "সাইন ইন করুন" : "সাইন আপ করুন"}
          </Link>
        </p>
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/"
          className="text-sm text-[#64756b] hover:text-[#008c40]"
        >
          ← হোম পেজে ফিরে যান
        </Link>
      </div>
    </main>
  );
}