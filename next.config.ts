import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output enables clean tarball deploys to Hetzner (same as main CRM)
  output: 'standalone',
};

export default nextConfig;
