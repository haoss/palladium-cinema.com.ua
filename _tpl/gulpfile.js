"use strict";

var gulp = require('gulp'),
  browserSync = require('browser-sync'),
  sass = require('gulp-sass'),
  uncss = require('gulp-uncss'),
  autoprefixer = require('gulp-autoprefixer'),
  sourcemaps = require('gulp-sourcemaps'),
  rename = require("gulp-rename"),
  plumber = require('gulp-plumber'),
  spritesmith = require('gulp.spritesmith'),
  buffer = require('vinyl-buffer'),
  merge = require('merge-stream'),
  svgmin = require('gulp-svgmin'),
  svgstore = require('gulp-svgstore'),
  cheerio = require('gulp-cheerio'),
  jadeInheritance = require('gulp-jade-inheritance'),
  jade = require('gulp-jade'),
  changed = require('gulp-changed'),
  cached = require('gulp-cached'),
  gulpif = require('gulp-if'),
  filter = require('gulp-filter');

var plugins = require("gulp-load-plugins")();

gulp.task('sprite-image', function () {
  var spriteData = gulp.src('./img/img-sprite/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: '_sprite.sass',
    algorithm : 'top-down'
  }));
  // Pipe image stream through image optimizer and onto disk
  var imgStream = spriteData.img
    // DEV: We must buffer our stream into a Buffer for `imagemin`
    .pipe(buffer())
    .pipe(gulp.dest('./dist/img/'));

  // Pipe CSS stream through CSS optimizer and onto disk
  var cssStream = spriteData.css
    .pipe(gulp.dest('./sass/1-base/'));

  // Return a merged stream to handle both `end` events
  return merge(imgStream, cssStream);
});

gulp.task('sass', function() {
  gulp.src('./sass/main.sass')
    .pipe(plumber())
    .pipe(plugins.sourcemaps.init())
    .pipe(sass({
        includePaths: ['./dist/css/'],
        onError: browserSync.notify
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: true
    }))
    // .pipe(uncss({
    //    html: ['*.html']
    // }))
    .pipe(plugins.sourcemaps.write("./"))
    .pipe(gulp.dest('./dist/css/'))
    .pipe(browserSync.reload({stream:true}));
});

// jade
gulp.task('jade', function() {
  gulp.src('./jade/**/*.jade')
    .pipe(changed('./dist/', {extension: '.html'}))
    .pipe(gulpif(global.isWatching, cached('jade')))
    .pipe(jadeInheritance({basedir: './jade/'}))
    .pipe(filter(function (file) {
      return !/\/_/.test(file.path) && !/^_/.test(file.relative);
    }))
    .pipe(plumber())
    .pipe(jade({
      pretty: '    '
    }))
    .pipe(gulp.dest('./dist/'))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('setWatch', function() {
  global.isWatching = true;
});

// Html
gulp.task('html', function(){
  gulp.src('./dist/*.html');
});

// Static server
gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: "./"
    },
    notify: false,
    reloadDelay: 3000
  });
});

gulp.task('js', function(){
  gulp.src('./dist/**/*.js')
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('watch', ['setWatch'], function () {
  gulp.watch('./sass/**/*.sass', ['sass']);
  gulp.watch('./jade/**/*.jade', ['jade']);
  gulp.watch('./dist/**/*.js', ['js']);
  gulp.watch('./img/img-sprite/*.png', ['sprite-image']);
  gulp.watch('./img/svg-sprite/*.svg', ['sprite-svg']);
});

gulp.task('default', ['browser-sync','watch']);
