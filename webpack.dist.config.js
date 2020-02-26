// help: http://webpack.github.io/docs/configuration.html
// help: https://webpack.github.io/docs/webpack-dev-server.html#webpack-dev-server-cli
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

const package_ = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const entries = require('./webpack.entries');
const rules = require('./webpack.loaders');
const plugins = require('./webpack.plugins');

const config = {
  mode: "development",  // do not minify the code, this part of the app, not of the module
  target: 'web',        // help: https://webpack.github.io/docs/configuration.html#target
  entry: entries.entry,
  externals: [nodeExternals()].concat(['fs', 'path']), // in order to ignore all modules in node_modules folder
  optimization: {
    usedExports: true,       // true to remove the dead code, for more https://webpack.js.org/guides/tree-shaking/
  },
  devtool: "source-map",     // help: https://webpack.js.org/configuration/devtool/
  output: {
    path: path.resolve(__dirname, 'temp/dist'),
    filename: '[name].js',
    publicPath: '/temp/dist/',
    library: package_.name,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  resolve: {
    alias: {},
    extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js", ".jsx"]
  },
  module: {
    rules,
  },
  node: {
    // universal app? place here your conditional imports for node env
    fs: "empty",
    path: "empty",
    child_process: "empty",
  },
  plugins: [
    new webpack.NamedModulesPlugin(),             // prints more readable module names in the browser console on HMR updates
  ].concat(plugins),
};

module.exports = config;
