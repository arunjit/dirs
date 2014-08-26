var gutil    = require('../node_modules/gulp-util');
var roole    = require('../node_modules/roole');
var through2 = require('../node_modules/through2');

var PluginError = gutil.PluginError;

var NAME = 'gulp-roole-2';

module.exports = function(options) {
  'use strict';
  options = options || {};

  return through2.obj(function(file, enc, cb) {
    var self = this;

    if (file.isNull()) {
      cb(null, file);
      return;
    }

    if (file.isStream()) {
      cb(new PluginError(NAME, 'Streams not supported'));
      return;
    }

    if (file.isBuffer()) {
      var roo = file.contents.toString();
      roole.compile(roo, options, function(err, css) {
        if (err) {
          if (options.logErrors) {
            gutil.log(NAME, err);
            cb(null, file);
            return;
          }
          cb(new PluginError(NAME, err));
          return;
        }

        file.contents = new Buffer(css);
        file.path = gutil.replaceExtension(file.path, '.css');
        cb(null, file);
      });
    }
  });
};
