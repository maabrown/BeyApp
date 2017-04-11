module.exports = function() {

	var config = {

		// All JS to vet
		alljs: [
			'./server.js'
			// './app/**/*.js',
			// './cred/**/*.js',
			// './prod/public/**/*.js'
		],

		// Temp 
		temp: './dev',

		// Sass file
		allSass: './styles.scss'
	}

	return config;
}