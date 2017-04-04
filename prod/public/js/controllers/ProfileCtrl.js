angular.module('ProfileCtrl', []).controller('ProfileController', function($http, $scope, $routeParams) {
	
	// move this into a service
	$http({
		method: 'GET',
		url: '/api/userData'
	}).then( function successCallback(response) {
		$scope.user = response.data;
	}, function errorCallback(err) {
		throw err;
	})
})