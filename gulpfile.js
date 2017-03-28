'use strict';

var   gulp        = require('gulp');
var   sass        = require('gulp-sass');
const pug         = require('gulp-pug2');
var   browserSync = require('browser-sync').create();
var   rename      = require('gulp-rename');

gulp.task('browser-sync', function() {
    browserSync.init({ proxy: 'localhost:3000' });
});

gulp.task('reload', function() {
  browserSync.reload();
});

gulp.task('pug', function() {
    return gulp.src('./_pug/**/*.pug')
        .pipe(pug())
        .pipe(gulp.dest('./public'));
});

gulp.task('sass', function () {
  return gulp.src(['./_sass/*.sass', './_sass/*.scss'])
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(rename({extname: '.min.css'}))
    .pipe(gulp.dest('./public/assets/css'))
    .pipe(browserSync.reload({ stream:true }));
});

gulp.task('default', ['browser-sync'], function () {
  gulp.watch(['./_sass/*.sass', './_sass/*.scss'], ['sass']);
  gulp.watch('./_pug/**/*.pug', ['pug']);
  gulp.watch(['./public/**/*.html', './public/assets/**/*.*', ], ['reload']);
});
