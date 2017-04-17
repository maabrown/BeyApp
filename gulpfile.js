const gulp = require('gulp');
const args = require('yargs').argv;
// const jshint = require('gulp-jshint');
// const jscs = require('gulp-jscs');
// const util = require('gulp-util');
// const gulpPrint = require('gulp-print');
// const gulpIf = require('gulp-if');
const gulpConfig = require('./gulp.config')();
const del = require('del');
const path = require('path');

const $ = require('gulp-load-plugins')({lazy: true});

gulp.task('vet', function() {
	console.log('Going through vet');

	return gulp
		.src(gulpConfig.alljs)
		// Uses gulpIf to check condition
		// Uses args to check if passed --verbose
			// gulp vet --verbose (will print all files passed in)
		// Logs all files piped in
		.pipe($.if(args.verbose, $.print()))
		// Checks JS code for formatting
		.pipe($.jscs())
		.pipe($.jscs.reporter())
		// Detects errors and problems in JS
		.pipe($.jshint())
		.pipe($.jshint.reporter('jshint-stylish', {verbose: true}))
})


gulp.task('sass', ['clean-styles'], function() {
	console.log('Going through Sass');

	return gulp
		.src(gulpConfig.allSass)
		.pipe($.sass())
		.on('error', errorLogger)
		.pipe($.autoprefixer( { browsers: ['last 2 versions', '> 5%']}))
		.pipe(gulp.dest(gulpConfig.temp))
})

// use callback
gulp.task('clean-styles', function() {
	var files = gulpConfig.temp + '**/*.css';
	$.util.log(files);
	return clean(files);
})

gulp.task('sass-watcher', function() {
	gulp.watch(gulpConfig.allSass, ['sass']);
})

function clean(path) {
	console.log('Cleaning')
	return del(path);
}

function errorLogger(error) {
	console.log('** Start of Error **')
	console.log(error);
	console.log('** End of Error **')
	this.emit('end');
}