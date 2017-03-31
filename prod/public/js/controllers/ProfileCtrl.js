angular.module('ProfileCtrl', []).controller('ProfileController', ['$http', '$scope', '$routeParams', function($http, $scope, $routeParams) {

	// move this into a service
	$http.get('/api/userData')
		.success(function(data) {
			$scope.user = data; // puts the user data on the Angular scope
		})
}])