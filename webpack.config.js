const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const BUILD_DIR = path.resolve(__dirname, 'dist');
const APP_DIR = path.resolve(__dirname, 'app');

const config = {
  entry: {
    'app': './app/index.jsx',
  },
  output: {
    path: BUILD_DIR,
    filename: '[name].bundle.js'
  },
  resolve: {
    'extensions': [
      '', '.js', '.jsx',
    ],
  },
  module : {
   loaders : [
     {
       test : /\.jsx?/,
       include : APP_DIR,
       loader : 'babel'
     },
     {
      test: /\.css$/,
      loader: 'style!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
    },
    { test: /\.(jpe?g|gif|png|svg|woff|ttf|wav|mp3)$/,
      loader: "file"
    }
   ]
 },

 plugins: [new HtmlWebpackPlugin({
   title: 'Icemark',
   template: 'my-index.ejs'
 })]
};

module.exports = config;
