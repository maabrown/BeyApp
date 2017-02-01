angular.module('MainCtrl', []).controller('MainController', function($http, $scope) {

	$http({
		method: 'GET',
		url: '/search'
	})
		.then(function(response,err) {
			$scope.songs = response.data;
			if (err) {
				console.log(err);
			}
		})
});