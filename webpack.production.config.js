const { resolve } = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const config = {
  devtool: 'cheap-module-source-map',

  entry: [
    './main.js',
    './assets/scss/main.scss',
  ],

  context: resolve(__dirname, 'app'),

  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, 'dist'),
    publicPath: '',
  },

  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new HtmlWebpackPlugin({
      template: `${__dirname}/app/index.html`,
      filename: 'index.html',
      inject: false,
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new webpack.optimize.UglifyJsPlugin({
      beautify: false
    }),
    new webpack.DefinePlugin({ 'process.env': { NODE_ENV: JSON.stringify('production') } }),
    new ExtractTextPlugin({ filename: './styles/style.css', disable: false, allChunks: true }),
    new CopyWebpackPlugin([{ from: './vendors', to: 'vendors' }]),
  ],

  module: {
    loaders: [
      /* {
        enforce: "pre",
        test: /\.(es6|jsx|js)$/,
        exclude: /node_modules/,
        loader: "eslint-loader"
      }, */
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
      /* {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            { loader: 'sass-loader', query: { sourceMap: false } },
          ],
          publicPath: '../'
        }),
      },*/
      { test: /\.(png|jpg|gif)$/, use: 'url-loader?limit=15000&name=images/[name].[ext]' },
      { test: /\.eot(\?v=\d+.\d+.\d+)?$/, use: 'file-loader?name=fonts/[name].[ext]' },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, use: 'url-loader?limit=10000&mimetype=application/font-woff&name=fonts/[name].[ext]' },
      { test: /\.[ot]tf(\?v=\d+.\d+.\d+)?$/, use: 'url-loader?limit=10000&mimetype=application/octet-stream&name=fonts/[name].[ext]' },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, use: 'url-loader?limit=10000&mimetype=image/svg+xml&name=images/[name].[ext]' },
    ]
  },
  resolve: {
        // resolve.alias could be useful for resolving certain modules easily
        extensions: ['.js', '.jsx', '.es6'],
    }
};

module.exports = config;
