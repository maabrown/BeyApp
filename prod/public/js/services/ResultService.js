// Using Services returns the instance of the function to the thing that calls it
// https://www.airpair.com/javascript/posts/services-in-angularjs-simplified-with-examples

angular.module('ResultService', []).factory('ResultCall', function($http, $q, $location) {

	// return statement with brackets http://stackoverflow.com/questions/17516522/what-do-returning-curly-braces-mean-in-javascript-ex-return-init-init
	// returns object literal
	// you use curly brackets b/c of JS semicolon insertion http://stackoverflow.com/questions/3641519/why-does-a-results-vary-based-on-curly-brace-placement
	

	return {
		getLyrics: function(searchTerm) {
			console.log('this is the search ' + searchTerm);
			return $http({
						method: 'GET',
						url: '/getLyrics',
						// you can name the parameters anything you want so I named it 'searchTerm'
						params: { "searchTerm" : searchTerm }
					})
						// if successful return the response
						.then(function(response) {
							console.log('this is the response ' + response);
							return response
						})
						// if not successful return the error
						.catch(function(error) {
							// use $q.reject to pass back the error
							console.log('this is error ' + error);
							return $q.reject(error);
						})

		}
	}


})