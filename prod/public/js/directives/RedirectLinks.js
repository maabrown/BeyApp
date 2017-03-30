angular.module('RedirectLinks', []).directive('redirect', function() {
	return {
		restrict: 'A',
		link: function(scope, element, attr) {
				element.on('click', function(e) {
					e.preventDefault();
					window.location = attr.href;
				})	
		}
	}
})