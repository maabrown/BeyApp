angular.module('LogoutDirective', []).directive('logout', function($http) {
	
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			element.on('click', function(e) {
				e.preventDefault();
				$http({
					method: 'POST',
					url: '/logout'
				}).then( function successfullCallback(res) {
					
				}, function errorCallback(err) {

				})
			})
		}
	}
})