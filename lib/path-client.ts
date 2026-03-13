const SUBDOMAINS = ["apps", "replicas"];

/**
 * Client-side: resolves a path based on the current subdomain.
 * On subdomain: strips the prefix → `/apps/movie` becomes `/movie`
 * On main domain: returns the path as-is → `/apps/movie`
 */
export function pathClient(path: string) {
  if (typeof window === "undefined") return path;
  const subdomain = window.location.hostname.split(".")[0];

  if (SUBDOMAINS.includes(subdomain) && path.startsWith(`/${subdomain}`)) {
    return path.replace(`/${subdomain}`, "") || "/";
  }
  return path;
}
