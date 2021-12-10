const webpack = require("webpack");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const mode = process.env.NODE_ENV || "development";
const prod = mode === "production";

const config = {
  mode: mode,
  entry: "./src/index.js",
  target: "electron-main",
  // target: "electron-main",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.svelte$/,
        loader: "svelte-loader",
        options: {
          preprocess: require("svelte-preprocess")({ postcss: true }),
        },
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
            },
          },
          "postcss-loader",
        ],
      },
    ],
  },
  resolve: {
    extensions: [".mjs", ".js", ".svelte"],
  },
  plugins: [new MiniCssExtractPlugin()],
};

module.exports = config;
