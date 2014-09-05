var path = require('path');
var gulp = require('gulp');

var connect = require('gulp-connect');
var filter = require('gulp-filter');
var rimraf = require('gulp-rimraf');
var roole = require('./plugins/gulp-roole-2');
var symlink = require('gulp-sym');
var watch = require('gulp-watch');

var SRC = 'src';
var DEV = 'build/dev';
var DIST = 'build/dist'

function isAdded(file) {
  return file.event === 'added';
}

function isWritten(file) {
  return file.event === 'added' || file.event === 'changed';
}

function linkFile(file) {
  return path.join(path.dirname(file.base), DEV, file.relative);
}

gulp.task('clean', function() {
  return gulp.src('build', {read: false})
      .pipe(rimraf({force: true}));
});

// DEVELOPMENT

gulp.task('symlink-packages', function() {
  return gulp.src('packages', {read: false})
      .pipe(symlink(path.join(DEV, 'packages'), {force: true}));
});

gulp.task('watch-srcs', function() {
  return watch({glob: ['src/**/*.*', '!src/**/*.roo'], name: 'srcs'})
      .pipe(filter(isAdded))
      .pipe(symlink(linkFile, {force: true}));
});

gulp.task('watch-roole', function() {
  return watch({glob: ['src/**/*.roo'], name: 'roole'})
      .pipe(filter(isWritten))
      .pipe(roole({logErrors: true}))
      .pipe(gulp.dest(DEV));
});

gulp.task('devserver', function() {
  connect.server({
    root: DEV,
    port: 8000
  });
});

gulp.task('dev', [
  'symlink-packages',
  'watch-roole',
  'watch-srcs',
  'devserver'
]);


// PRODUCTION

gulp.task('copy', function() {
  return gulp.src(['src/**/*.*', '!src/**/*.roo']).
    pipe(gulp.dest(DIST));
});

gulp.task('roole', function() {
  return gulp.src(['src/**/*.roo'])
      .pipe(roole())
      .pipe(gulp.dest(DIST));
});

gulp.task('dist', [
  'copy',
  'roole'
]);
