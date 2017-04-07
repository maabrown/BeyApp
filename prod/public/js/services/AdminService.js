// AdminService is what you put in app.js
// AdminMethods is what is called in AdminCtrl.js
// $http method is used for API call
// $q is used to return promise

angular.module('AdminService', []).factory('AdminMethods', function($http, $q, $location) {

	// you return an object that will have multiple methods on it

	return {
		postLyrics: function(formData) {
			console.log(formData);
			// formData.songLyrics = formData.songLyrics.replace(/(\\r|\\n)/g, "<br>");
			
			return $http({
				method: 'POST',
				url: '/admin/addSong',
				params: { "songTitle" : formData.songTitle,
						 "albumTitle" : formData.albumTitle,
						 "songLyrics" : formData.songLyrics,
						 "featArtist" : formData.featArtist
				}
			})
				.then(function(response) {
					console.log('post worked');
					return response;
				})
				.catch( function(err) {
					console.log(err);
					// returns the err but could be moved along a chain if I
					// want to clean up errors later
					return $q.reject(err);
				})
		}
	}
})