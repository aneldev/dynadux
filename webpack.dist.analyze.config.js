const path = require('path');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const config = require('./webpack.dist.config.js');

config.output.path = path.resolve(__dirname, 'temp/build-analyze');
config.output.publicPath = '/temp/build-analyze';
config.plugins.push(new BundleAnalyzerPlugin());

module.exports = config;
