module.exports = function() {

	var codeBase = './prod/public/';
	var codeBaseApp = codeBase + 'js/';

	var config = {

		// All JS to vet
		alljs: [
			'./server.js'
			// './app/**/*.js',
			// './cred/**/*.js',
			// './prod/public/**/*.js'
		],

		// Temp 
		temp: './.tmp/',

		codeBase: codeBase,

		codeBaseApp: codeBaseApp,

		// index.html file
		index: codeBase + 'index.html',

		js: [
			codeBaseApp + 'app.js',
			codeBaseApp + '**/*.js'
		],

		// Sass file
		allSass: './styles.scss',

		bower: {
			// use require because that is what wiredep requests in documentation
			json: require('./bower.json'),
			directory: 'bower_components',
			// this path is from index.html to this file
			// so from index.html to this file it is ../../gulp.config.js
			ignorePath: '../..'
		}
	};

	config.getWiredepDefaultOptions = function() {
		var options = {
			bowerJson: config.bower.json,
			directory: config.bower.directory,
			ignorePath: config.bower.ignorePath
		}

		return options
	};

	return config;
}