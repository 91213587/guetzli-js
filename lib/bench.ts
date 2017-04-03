// Copyright 2017 <chaishushan{AT}gmail.com>. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import guetzli = require('./guetzli')
import Benchmark = require('benchmark')

let b = new Benchmark.Suite()

b.add('RegExp.test', function() {
	/o/.test('Hello World!');
})
b.add('String.indexOf', function() {
	'Hello World!'.indexOf('o') > -1
})

b.run({ 'async': true })
