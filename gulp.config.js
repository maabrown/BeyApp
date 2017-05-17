module.exports = function() {

	var codeBase = './prod/public/';
	var codeBaseApp = codeBase + 'js/';
	var temp = '../.tmp/';

	var config = {

		// All JS to lint in the 'vet' task
		alljs: [
			'./server.js'
			// './app/**/*.js',
			// './cred/**/*.js',
			// './prod/public/**/*.js'
		],

		allCSS: [ 
			temp + 'styles.css',
			codeBase + 'growl.css'
		],

		// Temp 
		temp: temp,

		// both of these are for scoping reasons
		// codebase above is only local to the function
		// but by returning the config object you will lose them
		// unless you reference them within the object that you can
		// then use in the gulpfile.js
		codeBase: codeBase,

		codeBaseApp: codeBaseApp,

		// index.html file
		index: codeBase + 'index.html',

		// all JS for the application
		js: [
			codeBase + 'ui-bootstrap-tpls-2.5.0.js',
			codeBaseApp + 'growl.js',
			codeBaseApp + 'controllers/*.js',
			codeBaseApp + 'directives/*.js',
			codeBaseApp + 'factories/*.js',
			codeBaseApp + 'services/*.js',
			codeBaseApp + 'appRoutes.js',
			codeBaseApp + 'app.js'
		],

		// Sass file
		allSass: './styles.scss',

		bower: {
			// use require because that is what wiredep requests in documentation
			json: require('./bower.json'),
			// where are the actual components
			directory: './bower_components/',
			// in the original index.html they would have ../../../bower_components/jQuery/[etc]
			// using ignorePath when it puts those files back on the index.html
			// it will remove the original ../../ so it would just read ../bower_components/[etc]
			ignorePath: '../..'
		}
	};

	config.getWiredepDefaultOptions = function() {
		var options = {
			// find bower JSON
			bowerJson: config.bower.json,
			// where are they located
			directory: config.bower.directory,
			// to tell it to ignore going back to directories
			ignorePath: config.bower.ignorePath
		}

		return options;
	};

	return config;
}