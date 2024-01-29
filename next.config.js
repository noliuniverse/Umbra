/** @type {import('next').NextConfig} */
const nextConfig = {reactStrictMode: false,
    images: {
        domains: [
          "i.seadn.io",
          "i.imgur.com",
          "upload.wikimedia.org",
        ],
      },}

module.exports = nextConfig
