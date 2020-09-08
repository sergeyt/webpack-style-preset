const path = require("path");
const ExtractPlugin = require("mini-css-extract-plugin");

function regexEqual(r1, r2) {
  return (
    r1 instanceof RegExp &&
    r2 instanceof RegExp &&
    r1.source === r2.source &&
    r1.flags.split("").sort().join("") === r2.flags.split("").sort().join("")
  );
}

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
      postcssOptions: {
        plugins: [
          require("autoprefixer")({}),
          require("postcss-preset-env")({}),
        ],
      },
    },
  };

  const sassOptions = {
    implementation: require("sass"),
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

  for (const rule of rules) {
    const i = config.module.rules.findIndex((t) =>
      regexEqual(t.test, rule.test)
    );
    if (i >= 0) {
      config.module.rules.splice(i);
    }
    config.module.rules.push(rule);
  }

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
