const redirects = require("./redirects"); // eslint-disable-line

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["upload.wikimedia.org", "guess.li"],
  },

  async redirects() {
    return [...redirects];
  },
};

module.exports = nextConfig;
