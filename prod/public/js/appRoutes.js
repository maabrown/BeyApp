angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	
	$routeProvider
		.when('/', {
			templateUrl: '/../../views/start.html',
			controller: 'StarterController'
		})

		.when('/example', {
			templateUrl: '/../../views/home.html',
			controller: 'MainController'
		})

		.when('/nerds', {
			templateUrl: '/../../views/nerd.html',
			controller: 'NerdController'
		})

		.when('/results', {
			templateUrl: '/../../views/results.html',
			controller: 'ResultController'
		})
		
		.otherwise( {
			redirectTo: '/'
		})

	$locationProvider.html5Mode({
		enabled: true,
		requireBase: false
	})
	
}])