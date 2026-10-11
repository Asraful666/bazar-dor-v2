"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function ProtectedRedirectNotice() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");
  const authStatus = searchParams.get("auth_status");
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    const url = new URL(window.location.href);
    let changed = false;

    if (
      pathname === "/signin" &&
      reason === "login_required" &&
      url.searchParams.get("reason") === "login_required"
    ) {
      url.searchParams.delete("reason");
      changed = true;

      toast.error("এই পেজ দেখতে আগে সাইন ইন করুন।", {
        id: "protected-route-redirect",
      });
    }

    const currentStatus = url.searchParams.get("auth_status");

    if (authStatus === "error" && currentStatus === "error") {
      url.searchParams.delete("auth_status");
      url.searchParams.delete("error");
      url.searchParams.delete("error_description");
      changed = true;

      toast.error("সোশ্যাল লগইন সম্পন্ন হয়নি। আবার চেষ্টা করুন।", {
        id: "oauth-result",
      });
    }

    if (
      authStatus === "success" &&
      currentStatus === "success" &&
      !isPending
    ) {
      url.searchParams.delete("auth_status");
      changed = true;

      if (session?.user) {
        toast.success("সফলভাবে লগইন হয়েছে।", {
          id: "oauth-result",
        });
      } else {
        const callbackParams = new URLSearchParams(window.location.search);
const errorCode = callbackParams.get("error");
const errorDescription = callbackParams.get("error_description");

console.error("OAuth callback failed:", {
  error: errorCode,
  description: errorDescription,
});

toast.error(
  errorCode
    ? `সোশ্যাল লগইন ব্যর্থ: ${errorCode}`
    : "সোশ্যাল লগইন সম্পন্ন হয়নি। Terminal-এর error দেখুন।",
  {
    id: "oauth-result",
    duration: 10000,
  },
);
      }
    }

    if (changed) {
      window.history.replaceState(
        window.history.state,
        "",
        `${url.pathname}${url.search}${url.hash}`,
      );
    }
  }, [pathname, reason, authStatus, isPending, session]);

  return null;
}