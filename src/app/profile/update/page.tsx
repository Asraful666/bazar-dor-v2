import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import UpdateProfileForm from "@/components/UpdateProfileForm";

async function UpdateContent() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/signin?reason=login_required");
  }

  return <UpdateProfileForm initialName={session.user.name || ""} />;
}

export default function UpdateProfilePage() {
  return (
    <Suspense
      fallback={
        <div
          role="status"
          className="mx-auto my-12 h-64 w-[calc(100%-2rem)] max-w-lg animate-pulse rounded-2xl bg-[#dfe9e2]"
        >
          <span className="sr-only">তথ্য লোড হচ্ছে...</span>
        </div>
      }
    >
      <UpdateContent />
    </Suspense>
  );
}