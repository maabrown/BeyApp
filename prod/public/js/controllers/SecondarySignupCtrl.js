angular.module('SecondarySignupCtrl', []).controller('SecondarySignupController', function($http, $scope, $routeParams) {

	$scope.submission = function(user) {

		$http({
			method: 'POST',
			url: '/connect/local',
			data: {
				email : user.email,
				password : user.password
			}
		})
		.then( function successCallback(res) {

		}, function errCallback(err) {
			console.log(error)
		})
	}

})