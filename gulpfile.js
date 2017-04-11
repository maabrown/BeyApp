const gulp = require('gulp');
const args = require('yargs').argv;
// const jshint = require('gulp-jshint');
// const jscs = require('gulp-jscs');
// const util = require('gulp-util');
// const gulpPrint = require('gulp-print');
// const gulpIf = require('gulp-if');
const gulpConfig = require('./gulp.config')();

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


gulp.task('sass', function() {
	console.log('Going through Sass');

	return gulp
		.src(gulpConfig.allSass)
		.pipe($.sass())
		.pipe($.autoprefixer( { browsers: ['last 2 versions', ' > 5%']}))
		.pipe(gulp.dest(gulpConfig.temp))
})