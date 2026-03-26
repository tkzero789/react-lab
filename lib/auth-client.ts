import { createAuthClient } from "better-auth/react";
import {
  convexClient,
  crossDomainClient,
} from "@convex-dev/better-auth/client/plugins";

const cookieDomain = process.env.NEXT_PUBLIC_COOKIE_DOMAIN;

/**
 * Cookie-based storage shared across subdomains.
 * The crossDomainClient defaults to localStorage which is per-origin,
 * so apps.thinhtran.dev can't see tokens set on thinhtran.dev.
 * Using cookies with domain=.thinhtran.dev fixes this.
 */
const crossSubdomainStorage =
  typeof window !== "undefined"
    ? {
        getItem(key: string): string | null {
          const match = document.cookie.match(
            new RegExp(
              `(?:^|; )${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}=([^;]*)`
            )
          );
          return match ? decodeURIComponent(match[1]) : null;
        },
        setItem(key: string, value: string) {
          const maxAge = 60 * 60 * 24 * 30; // 30 days
          let cookie = `${key}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
          if (cookieDomain) {
            cookie += `; domain=${cookieDomain}`;
          }
          if (window.location.protocol === "https:") {
            cookie += "; Secure";
          }
          document.cookie = cookie;
        },
      }
    : undefined;

export const authClient = createAuthClient({
  baseURL:
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL,
  plugins: [
    convexClient(),
    crossDomainClient({ storage: crossSubdomainStorage }),
  ],
});
