angular.module('ResultTabs', []).directive('resultTabs', function() {
	return {
		restrict: 'E',
		templateUrl: '../../views/result-tabs.html',
		controller: 'ResultController'
	}
})