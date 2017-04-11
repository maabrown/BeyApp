var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');

gulp.task('vet', function() {
	return gulp
		.src([
			'./server.js'
			// './app/**/*.js',
			// './cred/**/*.js',
			// './prod/public/**/*.js'
		])
		.pipe(jscs())
		.pipe(jscs.reporter())
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish', {verbose: true}))
})