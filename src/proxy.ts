import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export const proxy = auth((req) => {
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;
  const path = req.nextUrl.pathname;

  const isAdminRoute = path.startsWith("/admin");
  const isLoginRoute = path === "/login";

  if (isAdminRoute) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", req.nextUrl);
      loginUrl.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(loginUrl);
    }
    if (role !== "admin") {
      // Redirect non-admin to home page
      return NextResponse.redirect(new URL("/", req.nextUrl));
    }
  }

  if (isLoginRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths starting with /admin or exact /login
     */
    "/admin/:path*",
    "/login",
  ],
};
