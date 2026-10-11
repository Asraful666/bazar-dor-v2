"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function SocialLoginButtons() {
  const [busy, setBusy] = useState<"google" | "github" | null>(null);

  async function handleLogin(provider: "google" | "github") {
    if (busy) return;

    setBusy(provider);

    try {
      const result = await authClient.signIn.social({
        provider,
        callbackURL: "/?auth_status=success",
        newUserCallbackURL: "/?auth_status=success",
        errorCallbackURL: "/signin?auth_status=error",
      });

      if (result.error) {
        toast.error(
          result.error.message || "লগইন শুরু করা যায়নি। আবার চেষ্টা করুন।",
        );
        setBusy(null);
      }
    } catch {
      toast.error("লগইন শুরু করা যায়নি। আবার চেষ্টা করুন।");
      setBusy(null);
    }
  }

  return (
    <div className="mt-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-[#dfe9e2]" />
        <span className="text-sm text-[#64756c]">অথবা</span>
        <span className="h-px flex-1 bg-[#dfe9e2]" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => handleLogin("google")}
          disabled={busy !== null}
          className="rounded-lg border border-[#dfe9e2] bg-white px-4 py-3 font-semibold text-[#182b24] hover:bg-[#eff5f0] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy === "google" ? "অপেক্ষা করুন..." : "Google দিয়ে লগইন"}
        </button>

        <button
          type="button"
          onClick={() => handleLogin("github")}
          disabled={busy !== null}
          className="rounded-lg border border-[#dfe9e2] bg-white px-4 py-3 font-semibold text-[#182b24] hover:bg-[#eff5f0] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy === "github" ? "অপেক্ষা করুন..." : "GitHub দিয়ে লগইন"}
        </button>
      </div>
    </div>
  );
}