angular.module('SignUpFormCtrl', []).controller('SignUpFormController', function($http, $scope) {

	$scope.submission = function(user) {

		$http({
			url: '/admin/signup',
			method: 'POST',
			data: {
				email: user.email,
				password: user.password
			}
		})
		.then( function successCallback(response) {

		}, function errorCallback(err) {
			console.log(err)
		})
	}
})