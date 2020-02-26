// help: http://webpack.github.io/docs/configuration.html
// help: https://webpack.github.io/docs/webpack-dev-server.html#webpack-dev-server-cli
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

const rules = require('./webpack.loaders');
const plugins = require('./webpack.plugins');

const config = {
	mode: "development",
	target: 'node', // help: https://webpack.github.io/docs/configuration.html#target
  entry: [
    path.resolve(__dirname, 'tests/index.ts')
  ],
	optimization: {
		usedExports: true,       // true to remove the dead code, for more https://webpack.js.org/guides/tree-shaking/
	},
	devtool: "source-map",     // help: https://webpack.js.org/configuration/devtool/
	devServer: {
		hot: true,
	},
  externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
  output: {
    path: path.resolve(__dirname, 'debug-ground/debug-test-on-nodejs'),
    filename: 'index.js'
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
		new webpack.HotModuleReplacementPlugin(),     // enable HMR globally
		new webpack.NamedModulesPlugin(),             // prints more readable module names in the browser console on HMR updates
	].concat(plugins),
};

module.exports = config;
