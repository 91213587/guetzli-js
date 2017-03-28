// Copyright 2017 <chaishushan{AT}gmail.com>. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

const gulp = require('gulp')
const ts = require('gulp-typescript')
const uglify =require('gulp-uglify')
const nodeunit = require('gulp-nodeunit')

const browserify = require('browserify')
const tsify = require('tsify')

const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')

const fs = require('fs')
const child_process = require('child_process')

// ----------------------------------------------------------------------------
// task
// ----------------------------------------------------------------------------

gulp.task('default', ['dist'])

gulp.task('dist', ['build', 'copy-testdata', 'copy-gyp-build', 'copy-cxx-emscripten', 'example'])

gulp.task('build', ['build-gyp'], () => {
	let tsProj = ts.createProject('tsconfig.json')
	return tsProj.src().pipe(tsProj()).pipe(gulp.dest('dist/lib'))
})

gulp.task('build-gyp', (cb) => {
	let s1 = 'build/Release/guetzli.node'
	let s2 = 'build/Debug/guetzli.node'
	if(fs.existsSync(s1) || fs.existsSync(s2)) {
		cb()
		return
	}
	child_process.exec('node-gyp rebuild', function(err) {
		if(err) return cb(err)
		cb()
	})
})

gulp.task('copy-gyp-build', ['build-gyp'], () => {
	return gulp.src(['build/**/*.node']).pipe(gulp.dest('dist/build'))
})

gulp.task('copy-cxx-emscripten', () => {
	return gulp.src([
		'lib/cxx-emscripten/*.js',
		'lib/cxx-emscripten/*.d.ts',
	]).pipe(gulp.dest(
		'dist/lib/cxx-emscripten'
	))
})

gulp.task('example', ['example-copy-html'], () => {
	return browserify({
		basedir: 'example',
		debug: true,
		entries: ['index.ts'],
		cache: {},
		packageCache: {}
	})
	.plugin(tsify)
	.bundle()
	.pipe(source('bundle.min.js'))
	.pipe(buffer())
	.pipe(uglify())
	.pipe(gulp.dest('dist/example'))
})

gulp.task('example-copy-html', () => {
	return gulp.src(['example/*.html']).pipe(gulp.dest('dist/example'))
})

gulp.task('copy-testdata', () => {
	return gulp.src(['testdata/*']).pipe(gulp.dest('dist/testdata'))
})

gulp.task('test', ['dist'], (cb) => {
	gulp.src('dist/lib/test.js').pipe(nodeunit())
});


gulp.task('test-cli', ['dist'], (cb) => {
	const cmd = 'node dist/lib/guetzli-cli.js testdata/bees.png a.out.jpg'
	child_process.exec(cmd, function(err) {
		if(err) return cb(err)
		cb()
	})
})

gulp.task('clean', (cb) => {
	try {
		removeDirectoryList(['build', 'dist'])
		if(fs.existsSync('a.out.jpg')) {
			fs.unlinkSync('a.out.jpg')
		}
		cb()
	} catch(err) {
		cb(err)
	}
})

// ----------------------------------------------------------------------------
// helper function
// ----------------------------------------------------------------------------

function removeDirectoryList(pathList) {
	for(let i = 0; i < pathList.length; i++) {
		removeDirectory(pathList[i])
	}
}

function removeDirectory(path) {
	if(fs.existsSync(path)) {
		fs.readdirSync(path).forEach(function(file, index) {
			let curPath = path + "/" + file;
			if(fs.lstatSync(curPath).isDirectory()) { // recurse
				removeDirectory(curPath);
			} else { // delete file
				fs.unlinkSync(curPath);
			}
		})
		fs.rmdirSync(path);
	}
}

// ----------------------------------------------------------------------------
// END
// ----------------------------------------------------------------------------

