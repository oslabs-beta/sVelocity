const webpack = require("webpack");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const monacoEditorWebpackPlugin = require("monaco-editor-webpack-plugin");
const mode = process.env.NODE_ENV || "development";
const prod = mode === "production";

const config = {
  mode: mode,
  entry: "./src/index.js",
  target: "electron-main",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.svelte$/,
        exclude: /node_modules/,
        loader: "svelte-loader",
        options: {
          preprocess: require("svelte-preprocess")({ postcss: true }),
        },
      },

      // {
      //   test: /\.worker\.js$/,
      //   exclude: /node_modules/,
      //   use: {
      //     loader: 'worker-loader',
      //     options: {
      //       name: '[name].js',
      //     },
      //   },
      // },
      {
        test: /\.css$/,
        // use: [
        //   MiniCssExtractPlugin.loader,
        //   {
        //     loader: "css-loader",
        //     options: {
        //       importLoaders: 1,
        //     },
        //   },
        //   "postcss-loader",
        // ],
        use:
          process.env.NODE_ENV === "production"
            ? [MiniCssExtractPlugin.loader, "css-loader"]
            : ["style-loader", "css-loader"],
      },
      {
        test: /\.ttf$/,
        use: ["file-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".mjs", ".js", ".svelte"],
  },
  plugins: [new MiniCssExtractPlugin(), new monacoEditorWebpackPlugin()],
};

module.exports = config;
