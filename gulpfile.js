// Copyright 2017 <chaishushan{AT}gmail.com>. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

const gulp = require('gulp')
const ts = require('gulp-typescript')
const uglify =require('gulp-uglify')

const browserify = require('browserify')
const tsify = require('tsify')

const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')

gulp.task('default', ['dist', 'example'])

gulp.task('dist', ['build', 'build-copy-type'])

gulp.task('build', () => {
	let tsProj = ts.createProject('tsconfig.json')
	return tsProj.src().pipe(tsProj()).js.pipe(gulp.dest('dist'))
})

gulp.task('example', ['example-copy-html'], () => {
	return browserify({
		basedir: 'src/example',
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

gulp.task('build-copy-type', ['build'], () => {
	return gulp.src(['src/js/*.d.ts']).pipe(gulp.dest('dist'))
})

gulp.task('example-copy-html', () => {
	return gulp.src(['src/example/*.html']).pipe(gulp.dest('dist/example'))
})

