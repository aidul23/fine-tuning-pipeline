import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { Footer } from "@/components/Footer";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fine-Tuning Platform",
  description: "Fine-tune LLMs with an easy interface",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen font-sans">
        <MobileNav />
        <div className="flex min-h-screen pt-14 lg:pt-0">
          <Sidebar />
          <main className="flex min-h-screen flex-1 flex-col overflow-auto pl-0 lg:pl-64">
            <div className="mx-auto flex min-h-0 flex-1 flex-col max-w-7xl p-6 lg:p-8">
              {children}
              <Footer />
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
