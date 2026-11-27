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
      source: "/artwork/porsche-gt3rs.glb",
      headers: [{ key: "Access-Control-Allow-Origin", value: "*" }, { key: "Content-Type", value: "model/gltf-binary" }],
    }, {
      source: "/r/:path*",
      headers: [{ key: "X-Robots-Tag", value: "noindex" }],
    }];
  },
  async redirects() {
    return [{ source: "/components/2048", destination: "/pages/2048", permanent: true }];
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
