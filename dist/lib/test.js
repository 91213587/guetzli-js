// Copyright 2017 <chaishushan{AT}gmail.com>. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.
"use strict";
exports.__esModule = true;
// npm install nodeunit -g
var image = require("./image");
var guetzli = require("./guetzli");
var helper = require("./helper");
var assert = require("assert");
var fs = require("fs");
var path = require("path");
exports.testVersion = function (t) {
    t.ok(guetzli.version == '1.0.1');
    t.ok(/^\d+\.\d+\.\d+$/.test(guetzli.version));
    t.done();
};
exports.testIsPngFilename = function (t) {
    t.ok(helper.isPngFilename('.png'));
    t.ok(helper.isPngFilename('.PNG'));
    t.ok(helper.isPngFilename('.PnG'));
    t.ok(helper.isPngFilename('1.png'));
    t.ok(helper.isPngFilename('1.PNG'));
    t.ok(helper.isPngFilename('1.pNG'));
    t.ifError(helper.isPngFilename('png'));
    t.ifError(helper.isPngFilename('1.jpg'));
    t.done();
};
exports.testIsJpegFilename = function (t) {
    t.ok(helper.isJpegFilename('.jpg'));
    t.ok(helper.isJpegFilename('.jPG'));
    t.ok(helper.isJpegFilename('.jpeg'));
    t.ok(helper.isJpegFilename('.jpEg'));
    t.ok(helper.isJpegFilename('.jpg'));
    t.ok(helper.isJpegFilename('1.jpeg'));
    t.done();
};
exports.testLoadImage_png = function (t) {
    var testdir = path.join(path.dirname(fs.realpathSync(__filename)), '../testdata');
    var m = helper.loadImage(testdir + '/bees.png'); // 444x258
    t.ok(isValidImage(m));
    t.ok(m.width == 444);
    t.ok(m.height == 258);
    t.done();
};
exports.testLoadImage_jpeg = function (t) {
    var testdir = path.join(path.dirname(fs.realpathSync(__filename)), '../testdata');
    var m = helper.loadImage(testdir + '/lena.jpg');
    t.ok(isValidImage(m));
    t.done();
};
exports.testGuetzliEncode = function (t) {
    var testdir = path.join(path.dirname(fs.realpathSync(__filename)), '../testdata');
    // 1. load png
    var m1 = helper.loadImage(testdir + '/bees.png');
    // 2. guetzli encode
    var jepgData = guetzli.encodeImage(m1);
    // 3. decode jpeg
    var m2 = helper.decodeJpg(jepgData);
    // 4. compare image
    var diff = averageDelta(m1, m2);
    t.ok(diff < 20, 'diff = ' + diff);
    t.done();
};
function isValidImage(m) {
    return m.width > 0 && m.height > 0 && m.channels > 0 && m.pix.length > 0;
}
// averageDelta returns the average delta in RGB space. The two images must
// have the same bounds.
function averageDelta(m0, m1) {
    assert(m0.width == m1.width);
    assert(m0.height == m1.height);
    assert(m0.channels == m1.channels);
    var sum = 0, n = 0;
    for (var y = 0; y < m0.height; y++) {
        for (var x = 0; x < m0.width; x++) {
            for (var k = 0; k < m0.channels && k < 3; k++) {
                var c0 = image.colorAt(m0, x, y, k);
                var c1 = image.colorAt(m1, x, y, k);
                sum += delta(c0, c1);
                n++;
            }
        }
    }
    return sum / n;
}
function delta(a, b) {
    return (a > b) ? (a - b) : (b - a);
}
