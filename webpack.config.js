const {resolve} = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');

const config = {
  devtool: 'cheap-module-eval-source-map',
  mode: 'development',
  entry: [
    'babel-polyfill',
    'react-hot-loader/patch',
    'react',
    'react-dom',
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
    './main.js'
  ],
  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, 'dist'),
    publicPath: '',
  },

  context: resolve(__dirname, 'app'),

  devServer: {
    clientLogLevel: "none",
    noInfo: true,
    quiet: true,
    hot: true,
    contentBase: resolve(__dirname, 'app'),
    publicPath: '/'
  },

  module: {
    rules: [
      {
        test: /\.(es6|jsx|js)$/,
        exclude: /node_modules/,
        use: ["babel-loader", "eslint-loader"]
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader",
        ],
      },
      {
        test: /\.(scss|sass)$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          'style-loader',
          'css-loader',
          { loader: 'sass-loader', options: { sourceMap: true } },
        ],
      },
      { test: /\.(png|jpg|gif)$/, use: 'file-loader' },
      { test: /\.eot(\?v=\d+.\d+.\d+)?$/, use: 'file-loader' },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, use: 'file-loader' },
      { test: /\.[ot]tf(\?v=\d+.\d+.\d+)?$/, use: 'file-loader' },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, use: 'file-loader' },
    ]
  },
  
  resolve: {
    // resolve.alias could be useful for resolving certain modules easily
    extensions: ['.js', '.jsx', '.es6'],
  },

  plugins: [
     new webpack.LoaderOptionsPlugin({
      test: /\.(js|jsx)$/,
      options: {
        eslint: {
          configFile: resolve(__dirname, '.eslintrc'),
          cache: false,
        }
      },
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new CopyWebpackPlugin([{ from: 'vendors', to: 'vendors' }]),
    new OpenBrowserPlugin({ url: 'http://localhost:8080/scorm2004.html' }),
    new webpack.HotModuleReplacementPlugin(),
  ],
};

module.exports = config;