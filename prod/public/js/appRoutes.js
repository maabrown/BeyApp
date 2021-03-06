angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	
	$routeProvider
		.when('/', {
			templateUrl: '/../../views/start.html',
			controller: 'ResultController'
		})

		.when('/results', {
			templateUrl: '/../../views/results.html',
			controller: 'ResultController'
		})

		// this is when the user decides local login, signup, or Google+
		.when('/admin/login', {
			templateUrl: '/../../views/signin.html',
			// I don't think this route needs a controller since we aren't doing any logic on the page
			controller: 'StarterController'
		})

		// local login route
		.when('/admin/auth/local-login', {
			templateUrl: '/../../views/local-login-form.html',
			controller: 'LoginFormController'
		})

		// confirmation that song lyrics were added to DB
		.when('/admin/confirm', {
			templateUrl: '/../../views/confirmation.html',
			controller: 'AddSongFormController'
		})

		// user profile information
		.when('/profile', {
			templateUrl: '/../../views/profile.html',
			controller: 'ProfileController'
		})

		.when('/connect/local', {
			templateUrl: '/../../views/connect-local.html',
			controller: 'SecondarySignupController'
		})
		
		// when users want to signup
		.when('/admin/signup', {
			templateUrl: '/../../views/signup.html',
			controller: 'SignUpFormController'
		})

		// adding songs to DB
		.when('/admin/addSongs', {
			templateUrl: '/../../views/add-songs.html',
			controller: 'AddSongFormController'
		})

		.otherwise( {
			redirectTo: '/'
		})

	$locationProvider.html5Mode({
		enabled: true,
		requireBase: false
	})
	
}])