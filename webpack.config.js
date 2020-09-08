const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const withSass = require("./index");

const config = {
  mode: "development",
  devtool: "source-map",
  entry: path.resolve(__dirname, "example/src/index.js"),
  output: {
    path: path.resolve(__dirname, "example/dist"),
    filename: "main.js",
  },
  resolve: {
    extensions: [".js", ".css", ".scss"],
  },
  plugins: [new HtmlWebpackPlugin()],
};

module.exports = withSass(config);
