import { NextRequest, NextResponse } from "next/server";

const SUBDOMAINS = ["apps", "replicas"];

function isLocalhost(hostname: string) {
  return hostname.includes("localhost") || hostname.includes("127.0.0.1") || hostname.includes("192.168.");
}

export function proxy(request: NextRequest) {
  const hostname = request.headers.get("x-forwarded-host") || request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;

  // Skip subdomain rewriting for localhost — use path-based routing instead
  if (isLocalhost(hostname)) {
    return NextResponse.next();
  }

  // Extract subdomain: "apps.thinhtran.dev" → "apps"
  const subdomain = hostname.split(".")[0];

  if (SUBDOMAINS.includes(subdomain)) {
    // Don't rewrite API routes — they're shared across subdomains
    if (pathname.startsWith("/api")) {
      return NextResponse.next();
    }

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
  // Skip proxy for static files and Next.js internals
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images/).*)"],
};
