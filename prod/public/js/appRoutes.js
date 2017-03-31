angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	
	$routeProvider
		.when('/', {
			templateUrl: '/../../views/start.html',
			controller: 'StarterController'
		})

		.when('/results', {
			templateUrl: '/../../views/results.html',
			controller: 'ResultController'
		})

		.when('/admin/login', {
			templateUrl: '/../../views/signin.html',
			controller: 'AdminController'
		})

		.when('/admin/confirm', {
			templateUrl: '/../../views/confirmation.html',
			controller: 'AdminController'
		})

		.when('/search', {
			templateUrl: '/../../views/search.html',
			controller: 'ResultController'
		})

		.when('/profile', {
			templateUrl: '/../../views/profile.html',
			controller: 'ProfileController'
		})

		.when('/connect/local', {
			templateUrl: '/../../views/connect-local.html',
			controller: 'SecondarySignupController'
		})
		
		.when('/signup', {
			templateUrl: '/../../views/signup.html',
			controller: 'SignupController'
		})

		.when('/login', {
			templateUrl: '/../../views/login.html',
			controller: 'LoginController'
		})

		.otherwise( {
			redirectTo: '/'
		})

	$locationProvider.html5Mode({
		enabled: true,
		requireBase: false
	})
	
}])