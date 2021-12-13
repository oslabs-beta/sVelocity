//const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const monacoEditorWebpackPlugin = require('monaco-editor-webpack-plugin');
// const WebpackElectronReload = require('webpack-electron-reload')({
//   path: path.join(__dirname, './dist/bundle.js'),
// });

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

const config = {
  mode: mode,
  entry: './src/index.js',
  target: 'electron-main',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist/',
  },
  devtool: 'source-map',
  watch: true,
  module: {
    rules: [
      {
        test: /\.svelte$/,
        loader: 'svelte-loader',
        options: {
          preprocess: require('svelte-preprocess')({ postcss: true }),
        },
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          'postcss-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.mjs', '.js', '.svelte'],
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new monacoEditorWebpackPlugin(),
    //WebpackElectronReload(),
  ],
};

module.exports = config;
