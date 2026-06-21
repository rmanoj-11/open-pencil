/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@open-pencil/react', '@open-pencil/core'],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'canvaskit-wasm': 'canvaskit-wasm/bin/canvaskit.js'
    }
    return config
  }
}

export default nextConfig