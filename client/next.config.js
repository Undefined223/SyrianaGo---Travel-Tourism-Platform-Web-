const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: ['localhost'],
  },
};

module.exports = withPWA(nextConfig);
