import { NextRequest, NextResponse } from "next/server";

const SUBDOMAINS = ["apps", "replicas"];

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;

  // Extract subdomain: "apps.thinhtran.dev" → "apps"
  // Also supports local dev: "apps.localhost:3000" → "apps"
  const subdomain = hostname.split(".")[0];

  if (SUBDOMAINS.includes(subdomain)) {
    // Skip if the path already starts with the subdomain prefix
    if (pathname.startsWith(`/${subdomain}`)) {
      return NextResponse.next();
    }

    // Rewrite: apps.thinhtran.dev/movie → /apps/movie
    const url = request.nextUrl.clone();
    url.pathname = `/${subdomain}${pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  // Skip middleware for static files and Next.js internals
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images/).*)"],
};
