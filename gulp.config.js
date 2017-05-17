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

		defaultPort: 7203,
		// where the app is running from
		nodeServer: 'server.js',

		// the files it shoul be watching
		server: 'server.js'

	};



	return config;
}