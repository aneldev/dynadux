// help: http://webpack.github.io/docs/configuration.html
// help: https://webpack.github.io/docs/webpack-dev-server.html#webpack-dev-server-cli
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const rules = require('./webpack.loaders');
const plugins = require('./webpack.plugins');

const serverPort = Number(process.argv[process.argv.length - 1]);

console.log('To debug open address: http://localhost:' + serverPort + ' on any browser');
console.log('');

const config = {
	mode: "development",
	target: 'web', // help: https://webpack.github.io/docs/configuration.html#target
	entry: [
		'webpack-dev-server/client?http://localhost:'+serverPort, // bundle the client for webpack-dev-server and connect to the provided endpoint
		'webpack/hot/only-dev-server',                            // bundle the client for hot reloading, only- means to only hot reload for successful updates
		path.resolve(__dirname, 'tests/index.ts')
	],
	optimization: {
		usedExports: true,       // true to remove the dead code, for more https://webpack.js.org/guides/tree-shaking/
	},
	devtool: "source-map",     // help: https://webpack.js.org/configuration/devtool/
	devServer: {
		hot: true,
		port: serverPort,
	},
	externals: [],
	output: {
		path: path.resolve(__dirname, 'debug-ground/debug-test-on-browser'),
    filename: 'debug-test-browser.js'
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
