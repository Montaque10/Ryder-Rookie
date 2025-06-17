const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add platform-specific extensions
config.resolver.sourceExts = process.env.RN_SRC_EXT
  ? [...process.env.RN_SRC_EXT.split(','), ...config.resolver.sourceExts]
  : [...config.resolver.sourceExts];

// Add platform-specific asset extensions
config.resolver.assetExts = [...config.resolver.assetExts, 'web.js', 'web.jsx', 'web.ts', 'web.tsx'];

module.exports = config; 