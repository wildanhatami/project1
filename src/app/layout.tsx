import type { Metadata } from "next";
import { Inter, Playfair_Display, Sacramento } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const sacramento = Sacramento({
  variable: "--font-signature",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "It's Tasty - Boutique Bakery",
  description: "Kebahagiaan dalam Sekotak Kue. Kue bento ala Korea dan burnt cheesecake premium.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${playfair.variable} ${sacramento.variable} antialiased`}>
      <body className="min-h-screen flex flex-col font-sans text-brand-brown bg-brand-cream selection:bg-brand-terracotta selection:text-white">
        <Navbar />

        {/* Main Content */}
        <main className="flex-grow">
          {children}
        </main>

        {/* Footer */}
        <footer className="w-full bg-brand-light-cream pt-10 md:pt-16 pb-8 px-6 md:px-16 mt-12 md:mt-20 border-t border-brand-brown/10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 md:gap-6">
            <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
              <span className="font-signature text-3xl md:text-4xl text-brand-terracotta">It's Tasty</span>
              <p className="text-brand-gray text-xs md:text-sm">© 2024 It's Tasty. Crafted with Love in Indonesia.</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-xs md:text-sm text-brand-gray">
              <Link href="#" className="hover:text-brand-terracotta transition-colors">Kebijakan Privasi</Link>
              <Link href="#" className="hover:text-brand-terracotta transition-colors">Syarat & Ketentuan</Link>
              <Link href="#" className="hover:text-brand-terracotta transition-colors">Hubungi Kami</Link>
            </div>

            <div>
              <Link href="#" className="text-brand-brown hover:text-brand-terracotta transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
