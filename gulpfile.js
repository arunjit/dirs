var path = require('path');
var gulp = require('gulp');

var connect = require('gulp-connect');
var filter = require('gulp-filter');
var mincss = require('gulp-minify-css');
var rimraf = require('gulp-rimraf');
var roole = require('./plugins/gulp-roole-2');
var symlink = require('gulp-sym');
var uglify = require('gulp-uglify');
var vulcanize = require('gulp-vulcanize');
var watch = require('gulp-watch');

var SRC = 'src';
var DEV = 'build/dev';
var DIST = 'build/dist';
var TMP = 'build/tmp';

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

gulp.task('symlink', function() {
  return gulp.src(['src/**/*.*', '!src/**/*.roo'])
      .pipe(symlink(linkFile, {force: true}));
});

gulp.task('symlink-packages-dev', function() {
  return gulp.src('packages', {read: false})
      .pipe(symlink(path.join(DEV, 'packages'), {force: true}));
});

gulp.task('roole-dev', function() {
  return gulp.src(['src/**/*.roo'])
      .pipe(roole())
      .pipe(gulp.dest(DEV));
});

gulp.task('dev', [
  'symlink',
  'symlink-packages-dev',
  'roole-dev'
]);

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

gulp.task('dev-serve', ['dev', 'watch-srcs', 'watch-roole'], function() {
  connect.server({
    root: DEV,
    port: 8000
  });
});


// PRODUCTION

gulp.task('symlink-packages', function() {
  return gulp.src('packages', {read: false})
      .pipe(symlink(path.join(TMP, 'packages'), {force: true}));
});

gulp.task('html', function() {
  return gulp.src('src/**/*.html')
      .pipe(gulp.dest(TMP));
});

gulp.task('js', function() {
  return gulp.src('src/**/*.js')
      //.pipe(uglify())
      .pipe(gulp.dest(TMP));
})

gulp.task('css', function() {
  return gulp.src(['src/**/*.roo'])
      .pipe(roole())
      .pipe(mincss())
      .pipe(gulp.dest(TMP));
});

gulp.task('dist', ['symlink-packages', 'html', 'js', 'css'], function() {
  return gulp.src(path.join(TMP, 'index.html'))
      .pipe(vulcanize({dest: DIST, inline: true, strip: true}))
      .pipe(gulp.dest(DIST));
});

gulp.task('dist-serve', ['dist'], function() {
  connect.server({
    root: DIST,
    port: 8000
  });
});
