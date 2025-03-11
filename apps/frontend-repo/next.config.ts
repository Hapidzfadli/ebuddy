/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Nonaktifkan ESLint saat build
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig