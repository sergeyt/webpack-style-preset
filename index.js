const path = require("path");
const ExtractPlugin = require("mini-css-extract-plugin");

module.exports = function withSass(config) {
  const NODE_ENV = process.env.NODE_ENV || "development";
  const isDevelopment = NODE_ENV === "development";

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
        isDevelopment ? "style-loader" : ExtractPlugin.loader,
        "css-loader",
        postcssLoader,
      ],
    },
    {
      test: /\.scss$/,
      use: [
        "source-map-loader",
        isDevelopment ? "style-loader" : ExtractPlugin.loader,
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

  config.resolve.extensions = [...(config.resolve.extensions || []), ".scss"];
  config.module.rules = [...(config.module.rules || []), ...rules];
  config.plugins = [
    ...(config.plugins || []),
    new ExtractPlugin({
      filename: isDevelopment ? "[name].css" : "[name].[hash].css",
      chunkFilename: isDevelopment ? "[id].css" : "[id].[hash].css",
    }),
  ];
  
  return config;
};
