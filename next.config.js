/** @type {import('next').NextConfig} */
const nextTranslate = require('next-translate');

const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: [
      'demos.creative-tim.com',
      'sportsconnect-profilephotos.s3.amazonaws.com',
    ],
    unoptimized: true,
  },
  // experimental: {
  //   images: {
  //     unoptimized: true,
  //   },
  // },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_RAW_URL}/:path*`,
      },
    ];
  },
  ...nextTranslate(),
};

module.exports = nextConfig;
