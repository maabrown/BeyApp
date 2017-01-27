angular.module('ResultCtrl', []).controller('ResultController', function($http,$scope, ResultCall) {
	
	var getInformation = function() {

		// getLyrics is defined as a property of the factory 'ResultCall' defined in ResultService.js - returns a promise
		// because ResultCall is an object we have to use dot notation
		ResultCall.getLyrics()
			// data is the information returned from the API call
			// then() is run only if the promise is kept
			.then(function(data) {

				if (typeof data === "object") {
					$scope.songs = data;
				}
				else {
					$scope.error = "There was an error!";
				}

			})
			.catch(function(error) {
				console.log('The erorr is ' + error);
			})
	}	
});