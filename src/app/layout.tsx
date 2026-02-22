import type { Metadata } from "next";
import { Outfit, Poppins, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { Analytics } from "@vercel/analytics/next";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const poppins = Poppins({ weight: ["400", "500", "600", "700"], subsets: ["latin"], variable: "--font-poppins" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "BCR 306 Session Report Generator",
  description: "Minimal web application to generate formatted session reports",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${poppins.variable} ${inter.variable} font-sans bg-[#F8FAFC] text-[#0F172A] min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1 w-full max-w-[1100px] mx-auto px-4 py-8">
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  );
}
