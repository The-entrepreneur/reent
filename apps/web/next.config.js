/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost", "minio.localhost"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "9000",
        pathname: "/reent/**",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  env: {
    API_BASE_URL: process.env.API_BASE_URL || "http://localhost:8000",
    WS_URL: process.env.WS_URL || "ws://localhost:8000/ws",
    ENVIRONMENT: process.env.ENVIRONMENT || "development",
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.API_BASE_URL || "http://localhost:8000"}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
