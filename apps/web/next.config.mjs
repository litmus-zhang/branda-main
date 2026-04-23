/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'standalone',
  // Ensure that images and other static assets are handled correctly
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "i.postimg.cc",
      }
    ]
  },
  transpilePackages: [],
  serverExternalPackages: ["shiki", "opik"],
};

export default nextConfig;
