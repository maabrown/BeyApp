angular.module('HttpFactory', [])

//Angular documentation for $http Interceptors: https://docs.angularjs.org/api/ng/service/$http
.factory('httpResponseInterceptor', ['$q', '$location', 'growl', function($q, $location, growl) {

	// follows the pattern for an Angular $http Interceptor (https://docs.angularjs.org/api/ng/service/$http)
	return {

		// is called upon receiving a reponse
		response: function(response) {
			if (typeof response.data === 'object') {
				console.log('interceptor is working');

				// redirect property is given by the isLoggedInAjax method and API calls via res.json in routes.js
				if (response.data.redirect) {
					// use Angular to change the URL
					$location.path(response.data.redirect)

					// use OR operator, returns empty object or wraps response in a $q Promise object
					// when would you get $q.when?
					return response || $q.when(response);
				}
				else if (response.data.error) {
					// use growl to display message
					console.log('this is data.error ' + response.data.error);
					growl.error(response.data.error);
				}
			}
			return response || $q.when(response);
		}
	}
}])

// Angular documentation for Module config methods https://docs.angularjs.org/guide/module
.config(['$httpProvider', function($httpProvider) {

	// registering the httpResponse interceptor with the $httpProvider
	// $httpProvider.interceptors is an array thus use the push() method
	$httpProvider.interceptors.push('httpResponseInterceptor');
}])