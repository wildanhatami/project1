import { MapPin } from "lucide-react";
import { STORE_ADDRESS, STORE_MAPS_URL } from "@/lib/store-config";

const InstagramIcon = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const TikTokIcon = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.85.12V9.36a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.62a6.34 6.34 0 0 0 6.34 6.34c3.5 0 6.34-2.84 6.34-6.34V9.07a8.16 8.16 0 0 0 4.91 1.62V7.24a4.85 4.85 0 0 1-1-.55z"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className="w-full bg-brand-light-cream py-6 md:py-8 px-6 md:px-16 mt-12 md:mt-20 border-t border-brand-brown/10">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand signature */}
        <div className="flex items-center gap-3">
          <span className="font-signature text-2xl text-brand-terracotta">It&apos;s Tasty</span>
        </div>

        {/* Social Links & Location Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href={STORE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            title={STORE_ADDRESS}
            className="flex items-center gap-2 bg-white border border-brand-brown/10 hover:border-brand-terracotta/40 text-brand-brown hover:text-brand-terracotta px-4 py-2 rounded-full text-xs font-medium transition-all hover:scale-105 shadow-xs"
          >
            <MapPin size={15} className="text-brand-terracotta shrink-0" />
            <span>Sepatan, Kab. Tangerang</span>
          </a>

          <a
            href="https://www.instagram.com/itstasty.id?igsh=aXdiYnRld2owZXhz"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white border border-brand-brown/10 hover:border-brand-terracotta/40 text-brand-brown hover:text-brand-terracotta px-4 py-2 rounded-full text-xs font-medium transition-all hover:scale-105 shadow-xs"
          >
            <InstagramIcon size={16} className="text-brand-terracotta" />
            <span>@itstasty.id</span>
          </a>

          <a
            href="https://www.tiktok.com/@itstasty.id?_r=1&_t=ZS-98MDZGhuS1t"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white border border-brand-brown/10 hover:border-brand-terracotta/40 text-brand-brown hover:text-brand-terracotta px-4 py-2 rounded-full text-xs font-medium transition-all hover:scale-105 shadow-xs"
          >
            <TikTokIcon size={15} className="text-brand-terracotta" />
            <span>@itstasty.id</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
