/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["sook-posttracheal-arthur.ngrok-free.dev"],
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vsmov.com",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
      },
      {
        protocol: "https",
        hostname: "*.convex.cloud",
        pathname: "/api/storage/**",
      },
    ],
  },
};

export default nextConfig;
