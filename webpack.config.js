const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';


const config = {
  entry: './src/index.js',
  output: {
    globalObject: 'self',
    path: path.resolve(__dirname, 'dist'),
    filename: 'webpack-bundle.js',
    publicPath: './dist/',
  },
  // Compile for Electron for main process.
  target: 'electron-main',
  // configure whether to polyfill or mock certain Node.js globals
  node: {
    __dirname: false,
    __filename: false,
  },
  mode: mode,
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.svelte$/,
        exclude: /node_modules/,
        loader: 'svelte-loader',
        options: {
          preprocess: require('svelte-preprocess')({ postcss: true }),
        },
      },
      {
        test: /\.css$/,
        use:
          process.env.NODE_ENV === 'production'
            ? [MiniCssExtractPlugin.loader, 'css-loader']
            : ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader', // creates style nodes from JS strings
          'css-loader', // translates CSS into CommonJS
          'sass-loader', // compiles Sass to CSS, using Node Sass by default
        ],
      },
      {
        test: /\.ttf$/,
        use: ['file-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.mjs', '.js', '.svelte'],
  },
  // plugins: [
  //   // new MiniCssExtractPlugin(),
  //   new HtmlWebpackPlugin({
  //     inject: true,
  //     template: path.resolve(__dirname, "./index.html"),
  // }),
  // //   new ChunksWebpackPlugin()
  //   // new monacoEditorWebpackPlugin()
  // ],
};

module.exports = config;
