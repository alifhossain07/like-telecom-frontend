/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    domains: [
      "sannai.test",
      "likeadmin.techdynobdltd.com",
      "like.test"
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'likeadmin.techdynobdltd.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'like.test',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'sannai.test',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;