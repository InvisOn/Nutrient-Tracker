// Babel is used to transpile modern JavaScript syntax into code that can run in all environments when writing React components.
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Required for expo-router
      'expo-router/babel',
    ],
  };
};
