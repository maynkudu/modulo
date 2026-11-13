import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  distDir: process.env.MODULO_DIST_DIR ?? ".next",
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  outputFileTracingIncludes: {
    "/r/*": ["./.private-registry/*.json"],
  },
  async headers() {
    return [{
      source: "/r/:path*",
      headers: [{ key: "X-Robots-Tag", value: "noindex" }],
    }];
  },
  turbopack: {
    rules: {
      "globals.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
