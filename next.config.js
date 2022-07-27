const redirects = require("./redirects");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  async redirects() {
    return [...redirects];
  },
};

module.exports = nextConfig;
