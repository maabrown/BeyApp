angular.module('ResultCtrl', []).controller('ResultController', function($http,$scope, $sce, $location, ResultCall) {

	$scope.buildToggle = function() {
		$(function() {
		    $('.highlightCheckbox').bootstrapToggle({
		    	width: '45%',
		    	// on: 'Highlight Words',
		    	// off: 'Unhighlight Words'
		    	style: 'highlightToggleStyle'
		    });
		  })
		console.log('click works');
	}

	$scope.toggleClick = function() {
		$(function() {
			console.log($('.highlightCheckbox').prop('checked'))
			console.log($('.highlightCheckbox'))
			console.log()

			if ($('.highlightCheckbox').prop('checked')) {
				var context = document.querySelectorAll('div.songLyricsDiv');
				console.log(context);
				var instance = new Mark(context);
				instance.mark($scope.$parent.searchTerm);
			} else {
				console.log('false');
				var context = document.querySelectorAll('div.songLyricsDiv')
				var instance = new Mark(context);
				instance.unmark();
			}

		})
		console.log('licked')
	}

	$scope.highlight = function() {
		
		console.log(context);
		// var highlightOptions = {
		// 	"exclude" : ["#songTitleDiv"]
		// };

		
		instance.mark("love");
	}

	$scope.unhighlight = function() {

	}

	$scope.albumNames = ['Dangerously In Love', 'BDay','I Am...Sasha Fierce', '4', 'Beyonce', 'Lemonade' ]
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


					// splice returns an array of the item you removed
					var totalMatches = response['data'].splice(-1, 1);

					// because of closure you need to use $scope.$parent to get the data passed up
					// to then be used on the view that you would like and accessible on the 
					// controller
					// http://stackoverflow.com/questions/21453697/angularjs-access-parent-scope-from-child-controller
					console.log(response.data);
					$scope.$parent.songs = response.data;
					$scope.$parent.searchTerm = response.config.params.searchTerm;
					$scope.$parent.dangerouslyArray = [];
					$scope.$parent.bdayArray = [];
					$scope.$parent.sashaArray = [];
					$scope.$parent.fourArray = [];
					$scope.$parent.beyonceArray = [];
					$scope.$parent.lemonadeArray = [];

					response.data.forEach( function(element, index, array) {

						if (element.album === "Dangerously in Love") {
							element.lyrics = element.lyrics.replace(/(?:\r\n|\r|\n)/g, '<br />');							
							element.lyrics = $sce.trustAsHtml(element.lyrics);
							$scope.$parent.dangerouslyArray.push(element);
						}
						else if (element.album === "BDay") {
							element.lyrics = element.lyrics.replace(/(?:\r\n|\r|\n)/g, '<br />');							
							element.lyrics = $sce.trustAsHtml(element.lyrics);
							$scope.$parent.bdayArray.push(element);
						}
						else if (element.album === "I Am...Sasha Fierce"){
							element.lyrics = element.lyrics.replace(/(?:\r\n|\r|\n)/g, '<br />');							
							element.lyrics = $sce.trustAsHtml(element.lyrics);
							$scope.$parent.sashaArray.push(element);
						}
						else if (element.album == "4") {
							element.lyrics = element.lyrics.replace(/(?:\r\n|\r|\n)/g, '<br />');							
							element.lyrics = $sce.trustAsHtml(element.lyrics);
							$scope.$parent.fourArray.push(element);
						}
						else if (element.album === "Beyonce") {
							element.lyrics = element.lyrics.replace(/(?:\r\n|\r|\n)/g, '<br />');							
							element.lyrics = $sce.trustAsHtml(element.lyrics);
							$scope.$parent.beyonceArray.push(element);

						}
						else if (element.album === "Lemonade") {
							
							element.lyrics = element.lyrics.replace(/(?:\r\n|\r|\n)/g, '<br />');							
							element.lyrics = $sce.trustAsHtml(element.lyrics);
							$scope.$parent.lemonadeArray.push(element);
						}
					});

						$scope.$parent.numOfDangerousSongs = $scope.$parent.dangerouslyArray.length;
						$scope.$parent.numOfBdaySongs = $scope.$parent.bdayArray.length;
						$scope.$parent.numOfSashaSongs = $scope.$parent.sashaArray.length;
						$scope.$parent.numOfFourSongs = $scope.$parent.fourArray.length;
						$scope.$parent.numOfBeyonceSongs = $scope.$parent.beyonceArray.length;						
						$scope.$parent.numOfLemonadeSongs = $scope.$parent.lemonadeArray.length;

					// slice returns an array, the array contains an object
					$scope.$parent.totalMatches = totalMatches[0]['totalMatches'];

					$scope.totalMatches = totalMatches[0]['totalMatches'];

					console.log($scope.$parent.lemonadeArray);

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