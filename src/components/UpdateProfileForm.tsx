"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function UpdateProfileForm({
  initialName,
}: {
  initialName: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (busy) return;

    const updatedName = name.trim();

    if (!updatedName || updatedName.length > 100) {
      const message = "নাম ১ থেকে ১০০ অক্ষরের মধ্যে দিন।";
      setError(message);
      toast.error(message);
      return;
    }

    setBusy(true);
    setError("");

    try {
      const result = await authClient.updateUser({
        name: updatedName,
      });

      if (result.error) {
        const message =
          result.error.message || "তথ্য আপডেট করা যায়নি।";
        setError(message);
        toast.error(message);
        return;
      }

      toast.success("আপনার নাম সফলভাবে আপডেট হয়েছে।");
      router.replace("/profile");
      router.refresh();
    } catch {
      const message = "তথ্য আপডেট করা যায়নি। আবার চেষ্টা করুন।";
      setError(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12">
      <section className="mx-auto max-w-lg rounded-2xl border border-[#dfe9e2] bg-[#fafcfb] p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-[#182b24]">
          তথ্য আপডেট করুন
        </h1>

        <p className="mt-2 text-sm text-[#64756c]">
          আপনার প্রোফাইলের নাম পরিবর্তন করুন।
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="profile-name"
              className="mb-2 block font-medium"
            >
              নাম
            </label>

            <input
              id="profile-name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={busy}
              maxLength={100}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "update-error" : undefined}
              className="w-full rounded-lg border border-[#dfe9e2] bg-white px-4 py-3 outline-none focus:border-[#008c40] focus:ring-2 focus:ring-[#008c40]/20 disabled:opacity-60"
            />
          </div>

          {error && (
            <p id="update-error" role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-lg bg-[#008c40] px-5 py-3 font-semibold text-white hover:bg-[#007535] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? "আপডেট হচ্ছে..." : "তথ্য আপডেট করুন"}
          </button>
        </form>

        <Link
          href="/profile"
          className="mt-5 inline-block text-sm font-semibold text-[#008c40] hover:underline"
        >
          প্রোফাইলে ফিরে যান
        </Link>
      </section>
    </main>
  );
}