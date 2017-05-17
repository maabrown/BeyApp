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
var port = process.env.PORT || gulpConfig.defaultPort;
const browserSync = require('browser-Sync');

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
		.pipe($.plumber())
		.pipe($.sass())
		.pipe($.autoprefixer( { browsers: ['last 2 versions', '> 5%']}))
		.pipe(gulp.dest(gulpConfig.codeBase))
})

// use callback
gulp.task('clean-styles', function() {
	$.util.log('cleaning files');
	var files = gulpConfig.temp + '**/*.css';
	$.util.log(files);
	return clean(files);
})

gulp.task('sass-watcher', function() {
	gulp.watch(gulpConfig.allSass, ['sass']);
})

// works for all files except our CSS
gulp.task('wiredep', function() {
	console.log('wiredep - inserting bower css js and app js');
	// .stream is a config of wiredep that allows for it to be used in gulp stream below
	var wiredep = require('wiredep').stream;

	return gulp
		// go get index.html file which has <-- bower:css -->
		.src(gulpConfig.index)
		// call gulp-inject, look up files in gulpConfig.js
		.pipe($.inject(gulp.src(gulpConfig.js), {relative: true}))
		// gulp is going to inject both of these on the page - bower first and then gulp-inject
		.pipe(gulp.dest(gulpConfig.codeBase))
})

// create inject because we don't want 'sass' task to run everytime we have a change in our bower.json
// run wiredep and sass tasks first
gulp.task('inject', ['wiredep', 'sass'], function() {
	console.log()

	return gulp
		// grab index.html - which has <-- inject -->
		.src(gulpConfig.index)
		// look up css based on gulpConfig object
		.pipe($.inject(gulp.src(gulpConfig.allCSS), {relative: true}))
		// inject css into index.html
		.pipe(gulp.dest(gulpConfig.codeBase))
})

gulp.task('serve-dev', ['inject'], function() {
	var isDev = true;

	var nodeOptions = {
		// path to server.js
		script: gulpConfig.nodeServer,
		delayTime: 1,
		env: {
			'PORT': port,
			'NODE_ENV': isDev ? 'dev' : 'build' 
		},
		watch: [gulpConfig.server]

	}

	return $.nodemon(nodeOptions)
		// ev is the file changed
		.on('restart', ['vet'], function(ev) {
			$.util.log('restarted')
			// gives server enough time to restart itself
			setTimeout(function() {
				$.util.log('reloading now..')
				browserSync.reload()
			}, gulpConfig.reloadDelay)
		})
		.on('start', function() {
			$.util.log('nodemon has started')
			startBrowserSync()
		})
		.on('crash', function() {
			console.log('crashed')
		})
		.on('exit', function() {
			console.log('exit')
		})
})

function clean(path) {
	console.log('Cleaning')
	return del(path, { force: true});
}

function errorLogger(error) {
	console.log('** Start of Error **')
	console.log(error);
	console.log('** End of Error **')
	this.emit('end');
}

function changeEvent(event) {

}

function startBrowserSync() {

	// checks if browsersync is running
	if (browserSync.active) {
		return;
	}

	$.util.log(' using port ' + port);

	gulp.watch([gulpConfig.allSass], ['sass']).on('change', function(event) {
		$.util.log(event);
	})

	var options = {
		// what are your proxying
		proxy: 'localhost:' + port,
		// where do you want browserSync to serve the files
		port: 3000,

		files: [gulpConfig.codeBase + '**/*', gulpConfig.temp + '**/*'],

		// track parts of browser in multiple screens
		ghostMode: {
			clicks: true,
			forms: true,
			scroll: true
		},
		// once inject changes, injects just that file that changed rather than full reload
		injectChanges: true,
		// log file changegs
		logFileChanges: true,

		logLevel: 'debug',

		logPrefix: 'gulp-patterns',

		notify: true,

		reloadDelay: 0
	}

	browserSync(options);
}