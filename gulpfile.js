var path = require('path');
var gulp = require('gulp');

var connect = require('gulp-connect');
var filter = require('gulp-filter');
var rimraf = require('gulp-rimraf');
var roole = require('gulp-roole');
var symlink = require('gulp-sym');
var watch = require('gulp-watch');

var SRC = 'src';
var DEV = 'build/dev';
var DIST = 'build/dist'

function isAdded(file) {
  return file.event === 'added';
}

function isModified(file) {
  return file.event === 'changed';
}

function linkFile(file) {
  return path.join(path.dirname(file.base), DEV, file.relative);
}

gulp.task('clean', function() {
  return gulp.src('build', {read: false})
      .pipe(rimraf({force: true}));
});


gulp.task('symlink', function() {
  return gulp.src(['src/**/*.*', '!src/**/*.roo']).
    pipe(symlink(linkFile, {force: true}));
});

gulp.task('symlink-packages', function() {
  return gulp.src('packages', {read: false})
      .pipe(symlink(path.join(DEV, 'packages'), {force: true}));
});

gulp.task('roole', function() {
  return gulp.src(['src/**/*.roo'])
      .pipe(roole())
      .pipe(gulp.dest(DEV));
});

gulp.task('watch-srcs', function() {
  return watch({glob: ['src/**/*.*', '!src/**/*.roo'], name: 'srcs'})
      .pipe(filter(isAdded))
      .pipe(symlink(linkFile, {force: true}));
});

gulp.task('watch-roole', function() {
  return watch({glob: ['src/**/*.roo'], name: 'roole'})
      .pipe(filter(isModified))
      .pipe(roole())
      .pipe(gulp.dest(DEV));
});

gulp.task('devserver', function() {
  connect.server({
    root: DEV,
    port: 8000
  });
});

gulp.task('default', [
  'symlink',
  'symlink-packages',
  'roole',
  'watch-roole',
  'watch-srcs',
  'devserver'
]);
