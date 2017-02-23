angular.module('AdminCtrl', []).controller('AdminController', function($scope, $http, $location, AdminMethods) {

	// $scope will allow us to get info from the view and use it here in our controller
	// you can call this anything you want other than formData - just has to match your
	// ng-model name that you use in the view

	$scope.addLyrics = function(formData) {

		AdminMethods.postLyrics(formData)

			.then( function(response) {
				$scope.$parent.songTitle = response.config.params.songTitle;
				$scope.$parent.albumTitle = response.config.params.albumTitle;
				$location.path('/admin/confirm')
			})

			.catch( function(err) {
				console.log(err);
			})
	}
})