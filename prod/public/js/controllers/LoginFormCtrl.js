angular.module('LoginFormCtrl', []).controller('LoginFormController', ['$http', '$scope', function($http, $scope) {

	$scope.login = function() {

		$http
			.post('/login', {
				email : this.email,
				password : this.password
			})
			.success(function(data) {
				console.log(data);
			})
	}

	$scope.connect = function() {

		$http
			.post('/connect/local', {
				email: this.email,
				password: this.password
			})
			.success(function(data) {
				conosle.log(data);
			})
	}
}])