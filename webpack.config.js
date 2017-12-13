const { resolve } = require('path');

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');

const config = {
  devtool: 'cheap-module-eval-source-map',

  entry: [
    'react-hot-loader/patch',
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
    hot: true,
    contentBase: resolve(__dirname, 'app'),
    publicPath: '/'
  },

  module: {
    rules: [
      // {
      //   enforce: "pre",
      //   test: /\.(es6|jsx|js)$/,
      //   exclude: /node_modules/,
      //   loader: "eslint-loader"
      // },
      {
        test: /\.es6$/,
        exclude: /(node_modules|bower_components)/,
        use: {
            loader: 'babel-loader',
            options: {
                presets: ['es2015'],
                plugins: [require('babel-plugin-transform-object-rest-spread')],
            },
        },
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
            loader: 'babel-loader',
            options: {
                presets: ['es2015', 'react'],
            },
        },
      },
      {
        test: /\.js$/,
        loaders: [
          'babel-loader',
        ],
        exclude: /node_modules/,
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
      { test: /\.(png|jpg|gif)$/, use: 'url-loader?limit=15000&name=images/[name].[ext]' },
      { test: /\.eot(\?v=\d+.\d+.\d+)?$/, use: 'file-loader?&name=fonts/[name].[ext]' },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, use: 'url-loader?limit=10000&mimetype=application/font-woff&name=fonts/[name].[ext]' },
      { test: /\.[ot]tf(\?v=\d+.\d+.\d+)?$/, use: 'url-loader?limit=10000&mimetype=application/octet-stream&name=fonts/[name].[ext]' },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, use: 'url-loader?limit=10000&mimetype=image/svg+xml&name=images/[name].[ext]' },
    ]
  },
  resolve: {
        // resolve.alias could be useful for resolving certain modules easily
        extensions: ['.js', '.jsx', '.es6'],
    },

  plugins: [
    /* new webpack.LoaderOptionsPlugin({
      test: /\.js$/,
      options: {
        eslint: {
          configFile: resolve(__dirname, '.eslintrc'),
          cache: false,
        }
      },
    }),*/
    new webpack.optimize.ModuleConcatenationPlugin(),
    new CopyWebpackPlugin([{ from: 'vendors', to: 'vendors' }]),
    new OpenBrowserPlugin({ url: 'http://localhost:8080' }),
    new webpack.HotModuleReplacementPlugin(),
  ],
};

module.exports = config;
