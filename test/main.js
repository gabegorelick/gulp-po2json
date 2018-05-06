'use strict';

var po2json = require('po2json');
var gulpPo2json = require('../');
var Vinyl = require('vinyl');
var expect = require('chai').expect;
var fs = require('fs');
var path = require('path');

var createFile = function (contents) {
  var base = path.normalize(__dirname + '/../fixtures');
  return new Vinyl({
    path: path.join(base, 'es.po'),
    base: base,
    cwd: __dirname,
    contents: contents
  });
}

describe('gulp-po2json', function () {
  describe('po2json()', function () {
    it('should match po2json output', function (done) {
      po2json.parseFile(__dirname + '/fixtures/es.po', {stringify:true}, function (err, data) {
        if (err) {
          done(err);
          return;
        }

        fs.readFile(__dirname + '/fixtures/es.po', function (err, esPo) {
          if (err) {
            done(err);
            return;
          }
          gulpPo2json()
            .on('error', done)
            .on('data', function (file) {
              expect(file.isNull()).to.be.false;
              expect(file.contents.toString()).to.equal(data);

              done();
            })
            .write(createFile(esPo));
        })
      });
    });
  })
});
