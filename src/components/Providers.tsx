"use client";

import { Suspense, type ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import ProtectedRedirectNotice from "@/components/ProtectedRedirectNotice";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      {children}

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#fafcfb",
            color: "#182b24",
            border: "1px solid #dfe9e2",
          },
        }}
      />

      <Suspense fallback={null}>
        <ProtectedRedirectNotice />
      </Suspense>
    </>
  );
}