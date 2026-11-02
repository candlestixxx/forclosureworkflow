import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output enables clean tarball deploys to Hetzner (same as main CRM)
  output: 'standalone',
  // Pin Turbopack root to this repo: without it Next walks up past the
  // submodule boundary and infers C:\Users\hyper (parent lockfile) as root.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
