angular.module('ResultCtrl', []).controller('ResultController', function($http,$scope, $location, ResultCall) {

	//getInformation = function(term) {
	//	console.log('this is searchTerm ' + term);
		
		//getLyrics is defined as a property of the factory 'ResultCall' defined in ResultService.js - returns a promise
		//because ResultCall is an object we have to use dot notation
	//}

	$scope.getInformation = function (term) {
		ResultCall.getLyrics(term)
			// data is the information returned from the API call
			// then() is run only if the promise is kept
			.then(function(response) {
				

				if (typeof response === "object") {

					
					$scope.$parent.songs = response.data;
					$scope.$parent.tagline = "Hello";
					$location.path('/results');
					console.log('it is getting to typeof');
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