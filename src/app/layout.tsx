import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Suspense } from "react";
import { Hind_Siliguri } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const banglaFont = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bangla",
  display: "swap",
});

export const metadata: Metadata = {
  title: "বাজার দর | আজকের বাজারের দাম",
  description:
    "প্রয়োজনীয় পণ্যের আজকের দাম ও বাজারভিত্তিক তুলনা এক জায়গায়।",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="bn">
      <body
        className={`${banglaFont.variable} flex min-h-screen flex-col antialiased`}
      >
        <Suspense
          fallback={
            <div
              role="status"
              className="h-36 animate-pulse bg-[#fafcfb]"
            >
              <span className="sr-only">ন্যাভবার লোড হচ্ছে...</span>
            </div>
          }
        >
          <Navbar />
        </Suspense>

        <div className="flex-1">{children}</div>

        <Footer />
      </body>
    </html>
  );
}