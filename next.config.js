/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Optimize for GitHub Pages
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  // Ensure proper base path handling for GitHub Pages
  basePath: '',
  // Disable x-powered-by header for security
  poweredByHeader: false,
  // Optimize build output
  compress: true,
  // Ensure proper handling of trailing slashes for GitHub Pages
  skipTrailingSlashRedirect: true,
}

module.exports = nextConfig
