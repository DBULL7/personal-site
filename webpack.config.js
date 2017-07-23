const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, 'dist')
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ }
    ]
  }
}