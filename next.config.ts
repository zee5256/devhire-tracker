import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the dev overlay out of screenshots and demos.
  devIndicators: false,
  // The board is fully personalised, so every route reads cookies and is
  // rendered dynamically. Cache Components and force-dynamic are mutually
  // exclusive, so it is disabled here.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts", "date-fns"],
  },
};

export default nextConfig;
