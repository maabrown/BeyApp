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
			console.log('local was connected');
		}, function errCallback(err) {
			console.log(err);
		})
	}

})