angular.module('ResultCtrl', []).controller('ResultController', function($http,$scope, $location, ResultCall) {
	
	$scope.getInformation = function (term) {
		
		//getLyrics is defined as a property of the factory 'ResultCall' defined in ResultService.js - returns a promise
		//because ResultCall is an object we have to use dot notation
		// calling the function using the 'term' passed in from the view ng-submit="getInformation(searchTerm)"
		ResultCall.getLyrics(term)

			// response is the information returned from the function getLyrics()'s line 'return response' after then()
			
			// then() is run only if the promise is kept as written in the getLyrics() method
			.then(function(response) {
				
				// data validation to make sure that the information being returned is an object
				if (typeof response === "object") {
					console.log(response);
					console.log("this is response.data " + response.data)

					var unchangedResponse = response;

					// splice returns an array of the item you removed
					var totalMatches = response['data'].splice(-1, 1);

					// because of closure you need to use $scope.$parent to get the data passed up
					// to then be used on the view that you would like and accessible on the 
					// controller
					// http://stackoverflow.com/questions/21453697/angularjs-access-parent-scope-from-child-controller
					
					$scope.$parent.songs = response.data;
					$scope.$parent.searchTerm = response.config.params.searchTerm;

					// slice returns an array, the array contains an object
					$scope.$parent.totalMatches = totalMatches[0]['totalMatches'];

					// this redirects the app without reloading the page
					$location.path('/results');
				}
				else {
					return error = "There was an error!";
				}
			})
			.catch(function(error) {
				console.log('The erorr is ' + error);
			})
		}

});