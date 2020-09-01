const path = require("path");
const ExtractPlugin = require("mini-css-extract-plugin");

module.exports = function withSass(
  config,
  { isDevelopment, noExtractPlugin } = {}
) {
  if (!isDevelopment) {
    const NODE_ENV = process.env.NODE_ENV || "development";
    isDevelopment = NODE_ENV === "development";
  }

  const postcssLoader = {
    loader: "postcss-loader",
    options: {
      plugins: [require("autoprefixer")({}), require("postcss-preset-env")({})],
    },
  };

  const sassOptions = {
    outputStyle: "expanded",
    includePaths: [path.resolve(__dirname, "node_modules")],
  };

  const sassLoader = {
    loader: "sass-loader",
    options: { sassOptions },
  };

  const rules = [
    {
      test: /\.css$/,
      use: [
        "source-map-loader",
        isDevelopment || noExtractPlugin
          ? "style-loader"
          : ExtractPlugin.loader,
        "css-loader",
        postcssLoader,
      ],
    },
    {
      test: /\.scss$/,
      use: [
        "source-map-loader",
        isDevelopment || noExtractPlugin
          ? "style-loader"
          : ExtractPlugin.loader,
        "css-loader",
        postcssLoader,
        sassLoader,
      ],
    },
  ];

  if (!config.module) {
    config.module = {};
  }
  if (!config.resolve) {
    config.resolve = {};
  }
  if (!config.module.rules) {
    config.module.rules = [];
  }
  if (!config.plugins) {
    config.plugins = [];
  }

  const extensions = new Set([
    ...(config.resolve.extensions || []),
    ".css",
    ".scss",
  ]);
  config.resolve.extensions = [...extensions];
  config.module.rules.push(...rules);

  if (!noExtractPlugin) {
    config.plugins.push(
      new ExtractPlugin({
        filename: isDevelopment ? "[name].css" : "[name].[hash].css",
        chunkFilename: isDevelopment ? "[id].css" : "[id].[hash].css",
      })
    );
  }

  return config;
};
