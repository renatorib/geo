const redirects = require("./redirects"); // eslint-disable-line

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["upload.wikimedia.org", "rena.to", "geo.rena.to", "geomemo.rena.to"],
  },

  async redirects() {
    return [...redirects];
  },
};

module.exports = nextConfig;
