var webpack = require('webpack'),
    path = require('path'),
    yargs = require('yargs');

var libraryName = 'jshiccup',
    plugins = [],
    outputFile,
    entryFile;

plugins.push(new webpack.optimize.UglifyJsPlugin({ minimize: true }));


var config = {
  entry: {
    worker: __dirname + '/src/worker.ts',
    recorder: __dirname + '/src/HiccupRecorder.ts'
  },
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, '/dist'),
    filename: "jshiccup.[name].js",
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    loaders: [
      { test: /\.tsx?$/, loader: 'ts', exclude: /node_modules/ }
    ]
  },
  resolve: {
    root: path.resolve('./src'),
    extensions: [ '', '.js', '.ts', '.jsx', '.tsx' ],
    fallback: path.join(__dirname, "node_modules")
  },


  plugins: plugins
};

module.exports = config;
