/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // wagmi's connector barrel (wagmi/connectors) bundles every connector
    // it ships, including ones we never use or call (e.g. Tempo Wallet).
    // Those connectors wrap their extra dependencies in dynamic import()
    // + .catch() specifically so they degrade gracefully at runtime when
    // not installed — but webpack still tries to statically resolve them
    // at build time and fails the whole build. We never invoke these
    // connectors, so it's safe to stub them out entirely.
    config.resolve.alias = {
      ...config.resolve.alias,
      accounts: false,
    }
    return config
  },
}
module.exports = nextConfig
