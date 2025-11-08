module.exports = function(api) {
  api.cache(true);

  return {
    presets: [
      'babel-preset-expo'
    ],
    plugins: [
      // Add any additional babel plugins here if needed
    ],
    env: {
      development: {
        plugins: [
          // Development-only plugins
        ]
      },
      production: {
        plugins: [
          // Production-only plugins
          'transform-remove-console'
        ]
      }
    }
  };
};
