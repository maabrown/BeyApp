angular.module('ResultTabs', []).directive('resultTabs', function() {
	return {
		restrict: 'A',
		templateUrl: '../../views/result-tabs.html',
		controller: 'ResultCtrl'
	}
})