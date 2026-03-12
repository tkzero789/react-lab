import { headers } from "next/headers";

const SUBDOMAINS = ["apps", "replicas"];

/**
 * Server-side: resolves a path based on the current subdomain.
 * On subdomain: strips the prefix → `/apps/movie` becomes `/movie`
 * On main domain: returns the path as-is → `/apps/movie`
 */
export function appPath(path: string) {
  const host = headers().get("host") || "";
  const subdomain = host.split(".")[0];

  if (SUBDOMAINS.includes(subdomain) && path.startsWith(`/${subdomain}`)) {
    return path.replace(`/${subdomain}`, "") || "/";
  }
  return path;
}
