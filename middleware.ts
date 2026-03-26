import { NextRequest, NextResponse } from "next/server";

const SUBDOMAINS = ["apps", "replicas"];
const ALLOWED_ORIGINS = [
  "https://lab.thinhtran.dev",
  "https://apps.thinhtran.dev",
  "https://replicas.thinhtran.dev",
];

function isLocalhost(hostname: string) {
  return hostname.includes("localhost") || hostname.includes("127.0.0.1");
}

function setCorsHeaders(response: NextResponse, origin: string) {
  response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  response.headers.set("Access-Control-Allow-Credentials", "true");
  return response;
}

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;
  const origin = request.headers.get("origin") || "";

  // Handle CORS for auth API routes
  if (pathname.startsWith("/api/auth") && ALLOWED_ORIGINS.includes(origin)) {
    // Handle preflight requests
    if (request.method === "OPTIONS") {
      return setCorsHeaders(new NextResponse(null, { status: 204 }), origin);
    }

    // Add CORS headers to actual requests
    const response = NextResponse.next();
    return setCorsHeaders(response, origin);
  }

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
  // Skip middleware for static files and Next.js internals
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images/).*)"],
};
