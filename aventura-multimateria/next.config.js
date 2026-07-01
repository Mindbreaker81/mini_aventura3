const path = require('path');

module.exports = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  outputFileTracingRoot: path.join(__dirname),
}; 