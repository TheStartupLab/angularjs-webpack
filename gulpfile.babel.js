'use strict';

import gulp     from 'gulp';
import webpack  from 'webpack';
import path     from 'path';
import fs       from 'fs';
import gutil    from 'gulp-util';
import del      from 'del';
import serve    from 'browser-sync';

import webpackDevMiddleware from 'webpack-dev-middleware';

import historyApiFallback   from 'connect-history-api-fallback';




let root = 'src';


let resolveToApp = (glob = '') => {
  return path.join(root, 'app', glob); 
};


let resolveToComponents = (glob = '') => {
  return path.join(root, 'app/components', glob); 
};

let paths = {
  js: resolveToComponents('**/*!(.spec.js).js'), 
  scss: resolveToApp('**/*.scss'), 
  html: [
    resolveToApp('**/*.html'),
    path.join(root, 'index.html')
  ],
  entry: [
    'babel-polyfill',
    path.join(__dirname, root, 'app/app.js')
  ],
  output: root,
  dest: path.join(__dirname, 'dist')
};


gulp.task('webpack', ['clean'], (cb) => {
  const config = require('./webpack.dist.config');
  config.entry.app = paths.entry;

  webpack(config, (err, stats) => {
    if(err)  {
      throw new gutil.PluginError("webpack", err);
    }

    gutil.log("[webpack]", stats.toString({
      colors: true,
      chunks: false,
      errorDetails: true
    }));

    cb();
  });
});



gulp.task('serve', () => {
  const config = require('./webpack.dev.config');
  config.entry.app = [
    //TODO add HMR
  ].concat(paths.entry);

  var compiler = webpack(config);

  var devServer = serve({
    port: process.env.PORT || 3000,
    open: false,
    server: {baseDir: root},
    middleware: [
      historyApiFallback(),
      webpackDevMiddleware(compiler, {
        stats: {
          colors: true,
          chunks: false,
          modules: false
        },
        publicPath: config.output.publicPath
      })
    ]
  });

  gulp.watch('dist/app.bundle.js').on('change', devServer.reload);
});

gulp.task('clean', (cb) => {
  del([paths.dest]).then(function (paths) {
    gutil.log("[clean]", paths);
    cb();
  })
});


gulp.task('default', ['serve']);