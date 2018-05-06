'use strict';

const PluginError = require('plugin-error');
const through = require('through2');
const po2json = require('po2json');
const path = require('path');

const pluginName = 'gulp-po2json';

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

    try {
      file.contents = Buffer.from(po2json.parse(file.contents, config));
    } catch (err) {
      this.emit('error', new PluginError(pluginName, err));
      return cb();
    }

    const dirname = path.dirname(file.path);
    const basename = path.basename(file.path, '.po');
    file.path = path.join(dirname, basename + '.json');

    this.push(file);
    cb();
  });
};
