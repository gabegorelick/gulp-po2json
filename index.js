'use strict';

var PluginError = require('plugin-error');
var through = require('through2');
var po2json = require('po2json');
var path = require('path');

var pluginName = 'gulp-po2json';

module.exports = function (config) {
  config = Object.assign({
    stringify: true
  }, config);

  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      this.push(file);
      return cb();
    }

    if (file.isStream()) {
      this.emit('error', new PluginError(pluginName, 'Streaming not supported'));
      return cb();
    }

    file.contents = new Buffer(po2json.parse(file.contents, config));

    var dirname = path.dirname(file.path);
    var basename = path.basename(file.path, '.po');
    file.path = path.join(dirname, basename + '.json');

    this.push(file);
    cb();
  });
};
