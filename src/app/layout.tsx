import type { Metadata } from "next";
import { Poppins, Playfair_Display, Sacramento } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
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
    <html lang="id" className={`${poppins.variable} ${playfair.variable} ${sacramento.variable} antialiased`}>
      <body className="min-h-screen flex flex-col font-sans text-brand-brown bg-brand-cream selection:bg-brand-terracotta selection:text-white">
        <Navbar />

        {/* Main Content */}
        <main className="flex-grow">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
