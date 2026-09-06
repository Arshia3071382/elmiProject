/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for the Docker build: emits a minimal ./.next/standalone
  // server that only bundles the node_modules actually needed at runtime,
  // instead of shipping the whole node_modules folder in the image.
  output: "standalone",

  experimental: {
    serverActions: {
      bodySizeLimit: "500mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

module.exports = nextConfig;
