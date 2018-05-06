'use strict';

const po2json = require('po2json');
const gulpPo2json = require('../');
const Vinyl = require('vinyl');
const expect = require('chai').expect;
const fs = require('fs');
const path = require('path');

const createFile = function (contents) {
  const base = path.normalize(__dirname + '/../fixtures');
  return new Vinyl({
    path: path.join(base, 'es.po'),
    base: base,
    cwd: __dirname,
    contents: contents
  });
};

describe('gulp-po2json', function () {
  it('should match po2json output', function (done) {
    po2json.parseFile(__dirname + '/fixtures/es.po', {stringify: true}, function (err, data) {
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
      });
    });
  });

  it('should handle po2json errors', function (done) {
    gulpPo2json()
      .on('error', function (err) {
        expect(err).to.be.ok;
        expect(err).to.be.an.instanceOf(Error);
        expect(err.plugin).to.equal('gulp-po2json');
        done();
      })
      .write(new Vinyl({
        path: '/tmp/foo.po',
        contents: Buffer.from('msgid')
      }));
  });
});
