var path    = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  entry: {},
  module: {
    rules: [
      { 
         test: /\.js$/, 
         exclude: [/app\/lib/, /node_modules/], 
         use: ['ng-annotate-loader','babel-loader']
      },
      { 
         test: /\.html$/, 
         use: 'raw-loader' 
      },
      { 
        test: /\.(scss|sass)$/, 
        use: ['style-loader','css-loader','sass-loader'] 
      },
      { 
        test: /\.css$/, 
        use: ['style-loader','css-loader'] 
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      inject: 'body',
      hash: true
    }),

    // Automatically move all modules defined outside of application directory to vendor bundle.
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        return module.resource && module.resource.indexOf(path.resolve(__dirname, 'src')) === -1;
      }
    })
  ]
};
