"use strict"

const gulp = require('gulp');
const connect = require('gulp-connect');
const open = require('gulp-open');
const browserify = require('browserify');
const reactify = require('reactify');
const source = require('vinyl-source-stream');


var config = {
  port: 8888,
  devBaseUrl: 'http://localhost',
  paths: {
    html: './src/*.html',
    dist: './dist',
    js: './src/**/*.js',
    mainJs: './src/index.js'
  }
}

// Start a local dev server
gulp.task('connect', function() {
  connect.server({
    root: ['dist'],
    port: config.port,
    base: config.devBaseUrl,
    livereload: true
  });
});

gulp.task('open', ['connect'], function() {
  gulp
    .src('src/index.html')
    .pipe(open({uri: config.devBaseUrl + ':' + config.port + '/'}));
});

gulp.task('html', function() {
  gulp
    .src(config.paths.html)
    .pipe(gulp.dest(config.paths.dist))
    .pipe(connect.reload());
})

gulp.task('js', function() {
  browserify(config.paths.mainJs)
    .transform(reactify)
    .bundle()
    .on('error', console.error.bind(console))
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(config.paths.dist + '/scripts'))
    .pipe(connect.reload())
})

gulp.task('watch', function() {
  gulp.watch(config.paths.html, ['html'])
  gulp.watch(config.paths.js, ['js'])
})

gulp.task('default', ['html', 'js', 'open', 'watch'])
