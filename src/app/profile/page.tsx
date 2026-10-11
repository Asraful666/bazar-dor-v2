import { Suspense } from "react";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

async function ProfileContent() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/signin?reason=login_required");
  }

  const { user } = session;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12">
      <section className="mx-auto max-w-lg rounded-2xl border border-[#dfe9e2] bg-[#fafcfb] p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-[#182b24]">
          আমার প্রোফাইল
        </h1>

        <div className="mt-6 flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#008c40] text-2xl font-bold text-white">
            {user.name?.trim().charAt(0).toUpperCase() || "U"}
          </div>

          <div className="min-w-0">
            <h2 className="break-words text-xl font-semibold">
              {user.name}
            </h2>
            <p className="mt-1 break-all text-sm text-[#64756c]">
              {user.email}
            </p>
          </div>
        </div>

        <Link
          href="/profile/update"
          className="mt-8 inline-flex rounded-lg bg-[#008c40] px-5 py-3 font-semibold text-white hover:bg-[#007535]"
        >
          তথ্য আপডেট করুন
        </Link>
      </section>
    </main>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div
          role="status"
          className="mx-auto my-12 h-64 w-[calc(100%-2rem)] max-w-lg animate-pulse rounded-2xl bg-[#dfe9e2]"
        >
          <span className="sr-only">প্রোফাইল লোড হচ্ছে...</span>
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}