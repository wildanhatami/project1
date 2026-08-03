import type { Metadata, Viewport } from "next";
import { Poppins, Playfair_Display, Sacramento } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import CartModal from "@/components/CartModal";

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${poppins.variable} ${playfair.variable} ${sacramento.variable} antialiased h-full`}>
      <body className="min-h-[100dvh] flex flex-col font-sans text-brand-brown bg-brand-cream selection:bg-brand-terracotta selection:text-white m-0 p-0">
        <Providers>
          <Navbar />

          {/* Main Content */}
          <main className="flex-grow w-full">
            {children}
          </main>

          <Footer />
          <CartModal />
        </Providers>
      </body>
    </html>
  );
}