import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Media thumbnails come from Twitter's CDN; allow them in <img> via next/image is optional.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "pbs.twimg.com" },
      { protocol: "https", hostname: "video.twimg.com" },
    ],
  },
};

export default nextConfig;
