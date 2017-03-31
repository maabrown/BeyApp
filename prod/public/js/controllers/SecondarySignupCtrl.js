angular.module('SecondarySignupCtrl', []).controller('SecondarySignupController', ['$http', '$scope', '$routeParams', function($http, $scope, $routeParams) {

	// put into a service
	$http.get('/api/userData')
		.success(function(data) {
			$scope.user = data;
		})
}])