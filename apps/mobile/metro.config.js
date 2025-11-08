const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Enhanced configuration for TypeScript and monorepo support
config.watchFolders = [__dirname];

// Improved resolver configuration
config.resolver = {
  ...config.resolver,

  // Enhanced asset extensions
  assetExts: [
    ...config.resolver.assetExts,
    'db', // For database files
    'sqlite', // For SQLite databases
    'ttf', // For custom fonts
    'otf', // For custom fonts
  ],

  // Enhanced source extensions
  sourceExts: [
    ...config.resolver.sourceExts,
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'mjs',
  ],

  // Block problematic directories
  blockList: [
    /node_modules\/.*\/node_modules\/react-native\/.*/,
    /data\/.*/,
    /\.minio\.sys\/.*/,
    /\.trash\/.*/,
    /.*\/__tests__\/.*/, // Exclude test files
    /.*\/\.git\/.*/, // Exclude git files
  ],

  // Enable symlinks for monorepo support
  unstable_enableSymlinks: true,

  // Enable package exports
  unstable_enablePackageExports: true,
};

// Enhanced transformer configuration
config.transformer = {
  ...config.transformer,

  // Enable babel transformer for better TypeScript support
  babelTransformerPath: require.resolve('metro-react-native-babel-transformer'),

  // Enable minification in production
  minifierConfig: {
    keep_classnames: true,
    keep_fnames: true,
    mangle: {
      keep_classnames: true,
      keep_fnames: true,
    },
  },
};

// Server configuration
config.server = {
  ...config.server,

  // Enhanced server options
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      // Add custom headers for development
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

      // Handle preflight requests
      if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
      }

      return middleware(req, res, next);
    };
  },
};

module.exports = config;
