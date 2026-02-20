import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

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
      <body className={`${inter.variable} font-sans bg-background text-foreground min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1 w-full max-w-[1100px] mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
