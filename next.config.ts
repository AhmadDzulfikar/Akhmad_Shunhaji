import type { NextConfig } from "next"
import { fileURLToPath } from "url"

// Turbopack expects a stable project root; normalize Windows backslashes.
const projectRoot = fileURLToPath(new URL(".", import.meta.url)).replace(/\\/g, "/")

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    root: projectRoot,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
}

export default nextConfig
