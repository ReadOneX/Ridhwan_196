import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Navbar from "./components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Haru Urara - Uma Musume Fan Site",
  description: "A showcase of Haru Urara using Next.js rendering techniques",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-pink-50/30 text-gray-900 min-h-screen flex flex-col pt-20`}
      >
        <Navbar />

        <main className="flex-grow container mx-auto px-4 pb-16 max-w-6xl">
          {children}
        </main>

        <footer className="bg-white border-t border-pink-100 py-10 text-center">
          <div className="max-w-6xl mx-auto px-4">
            <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">© 2026 Haru Urara Fan Project</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
