var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: [
    'webpack-dev-server/client?http://localhost:8080',
    './src/client/index.js'
  ]
  ,
  output: {
    path: './src/client/public', 
    filename: 'bundle.js' 
  },
  devServer: {
    contentBase: "./src/client/public",
    historyApiFallback: {
      index: 'index.html'
    }
  },
  resolve: {
    extensions: ['', '.js', '.jsx','.json']
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          // plugins: ["transform-object-rest-spread","transform-class-properties"],
          presets: ['es2015', 'react']
        }
      },
      {
        test: /\.json$/, 
        loader: "json",
	      exclude: /node_modules/
      },
      { test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader") },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
      { test: /\.(woff|woff2)$/, loader:"url?prefix=font/&limit=5000" },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream" },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml" }
    ]
  },
  plugins: [
    new ExtractTextPlugin("index.css")
  ]
};
