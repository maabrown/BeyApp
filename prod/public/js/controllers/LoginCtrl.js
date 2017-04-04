angular.module('LoginCtrl', []).controller('LoginFormController', function($http, $scope) {

	$scope.login = function(user) {

		$http({
			url: '/admin/auth/local-login',
			method: 'POST',
			data: {
				email: user.email,
				password: user.password
			}
		})
		.then( function successCallback(response) {
			console.log(response);
		}, function errorCallback(err) {
			console.log(err);
		})
	}
})