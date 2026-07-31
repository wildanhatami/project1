"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

function LoginContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const error = searchParams.get("error");

  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center px-4">
      {/* Background Decoration */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-brand-terracotta/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-brand-brown/5 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-brand-brown/8 px-8 py-10 flex flex-col items-center gap-6">
          {/* Logo & Brand */}
          <div className="text-center">
            <span className="font-signature text-5xl text-brand-terracotta block mb-2">
              It&apos;s Tasty
            </span>
            <p className="text-brand-gray text-sm">
              Masuk untuk menikmati pengalaman memesan kue terbaik
            </p>
          </div>

          <div className="w-full h-px bg-brand-brown/8" />

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm text-center"
            >
              {error === "OAuthCallback"
                ? "Terjadi kesalahan saat login. Coba lagi."
                : "Login gagal. Pastikan akun Google Anda valid."}
            </motion.div>
          )}

          {/* Login Button */}
          <motion.button
            id="google-login-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => signIn("google", { callbackUrl })}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-brand-brown/15 hover:border-brand-terracotta/40 hover:bg-brand-cream text-brand-brown font-medium py-3.5 px-6 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md group"
          >
            <GoogleIcon />
            <span className="text-sm font-semibold group-hover:text-brand-terracotta transition-colors">
              Masuk dengan Google
            </span>
          </motion.button>

          {/* Info Text */}
          <div className="text-center">
            <p className="text-xs text-brand-gray/70 leading-relaxed">
              Dengan masuk, Anda menyetujui syarat & ketentuan kami.
              <br />
              Data Anda aman dan tidak akan disalahgunakan.
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-sm text-brand-gray hover:text-brand-terracotta transition-colors"
          >
            ← Kembali ke Beranda
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-cream" />}>
      <LoginContent />
    </Suspense>
  );
}
