const path = require("path");
//const webpack = require("webpack");
const monacoEditorWebpackPlugin = require("monaco-editor-webpack-plugin");
const sveltePreprocess = require("svelte-preprocess");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const WebpackElectronReload = require("webpack-electron-reload")({
//   path: path.join(__dirname, "./build/bundle.js"),
// });
const mode = process.env.NODE_ENV || "development";
const prod = mode === "production";

module.exports = {
  mode: mode,
  entry: "./src/index.js",
  target: "electron-main",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "bundle.js",
  },
  devtool: "source-map",
  resolve: {
    // fullySpecified: false,
    // alias: {
    //   svelte: path.resolve("node_modules", "svelte"),
    // },
    extensions: [".mjs", ".js", ".svelte"],
    mainFields: ["svelte", "browser", "module", "main"],
  },
  module: {
    rules: [
      {
        test: /\.(html|svelte)$/,
        exclude: /node_modules/,
        use: "svelte-loader",
        // options: {
        //   emitCss: true,
        //   //if we don't want to extract css we can use the following rule:
        //   compilerOptions: {
        //     dev: !prod,
        //     //css: false,
        //   },
        // preprocess: sveltePreprocess({
        //   postcss: true,
        // }),
      },
      {
        test: /node_modules\/svelte\/.*\.mjs$/,
        resolve: {
          fullySpecified: false, // load Svelte correctly
        },
      },
      {
        // required to prevent errors from Svelte on Webpack 5+, omit on Webpack 4
        test: /\.css$/,
        exclude: /svelte\.\d+\.css/,
        use: [
          MiniCssExtractPlugin.loader,
          // {
          //   loader: MiniCssExtractPlugin.loader,
          //   options: {
          //     filename: "styles.css",
          //   },
          // },
          "postcss-loader",
          "css-loader",
          // {
          //   loader: "css-loader",

          //   options: {
          //     url: false, // necessary if you use url('/path/to/some/asset.png|jpg|gif')
          //     sourceMap: true,
          //   },
          // },
        ],
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: "styles.css" }),
    // WebpackElectronReload(),
    new monacoEditorWebpackPlugin(),
  ],
  // node: {
  //   fs: "empty",
  // },
};
