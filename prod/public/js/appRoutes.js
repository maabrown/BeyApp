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

		.when('/admin', {
			templateUrl: '/../../views/admin.html',
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
		
		.otherwise( {
			redirectTo: '/'
		})

	$locationProvider.html5Mode({
		enabled: true,
		requireBase: false
	})
	
}])