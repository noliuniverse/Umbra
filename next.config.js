/** @type {import('next').NextConfig} */
const nextConfig = {reactStrictMode: false,
  output: 'export',
    images: {
        domains: [
          "i.seadn.io",
          "i.imgur.com",
          "upload.wikimedia.org",
          "imagedelivery.net",
        ],
      },
      experimental: {
        missingSuspenseWithCSRBailout: false,
      },}

module.exports = nextConfig
