const Song = require('../../app/models/songs.js');

module.exports = function(app, router, passport) {

	// DELETE THIS CODE - just extra middleware
	router.use( (req,res,next) => {
		next();
	});

/*
	
	API ROUTES FOR NON-SIGNED IN USER

*/

	router.get('/getLyrics', (req,res) => {
		
		Song.find( {
			$text : {
				$search : req.query.searchTerm
			}
		}, function(err, docs) {
			if (err) { console.log(err)};

			// figuring out how many times the term is in the lyrics
			// using ES6 for this function
			// result is an array so using forEach to iterate
			// using RegEx (object construction) to search for the term in the result
			// igm are RegEx flags, i - ignore case, g - global match (find all cases), m - multiline
			const regExSearchTerm = new RegExp(req.query.searchTerm, 'igm');
			
			// put this outside of scope of function so it can be continuously updated
			// as forEach is run
			var totalMatches = 0;

			docs.forEach( (individResultObj) => {

				// individResultObj['lyrics'] - using bracket notation to get value in object
				// using match() String function to find matches using RegEx: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match
				// match() returns an array of each match
				var matchesArray = individResultObj['lyrics'].match(regExSearchTerm);
				
				// setting a new property on each result that is how many times the word is mentioned in the lyrics
				// using the length property to see how many times it is mentioned
				individResultObj['matches'] =  matchesArray.length;

				//
				totalMatches = totalMatches + individResultObj['matches'];
			})
			docs.push({ 'totalMatches' : totalMatches});
			
			return res.json(docs);
		})
	})


/*

	ADMIN API ROUTES

*/
	router.post('/admin/addSong', isLoggedInAjax, (req,res, next) => {
		
		Song.create( {
			title: req.query.songTitle,
			album: req.query.albumTitle,
			featArtist: req.query.featArtist,
			lyrics: req.query.songLyrics
		}, function(err, addedDocument) {
			if (err) { console.log(err)}
			if (addedDocument) {
				
				return res.json({ 
					redirect: '/admin/confirm', 
					addedSongTitle: req.query.songTitle,
					addedSongAlbum: req.query.albumTitle
				})
			}
		})
	})


	// FILL THIS OUT LATER
	router.get('/admin/deleteSong', isLoggedInAjax, (req,res, next) => {

	});


/*

	ADMIN ROUTES FOR USERS

*/

	router.post('/admin/signup', function(req,res,next) {
		
		passport.authenticate('local-signup', function(err, user, info) {
			if (err) { return err };

			if (!user) {
				console.log( '!user');
				return res.json( { error : user.error })
			}

			req.logIn(user, function(err) {
				if (err) { return res.json(err) };
				
				return res.json( { redirect: '/profile' });
			})
		})(req,res);
	});

	router.post('/logout', function(req,res) {
		// req.logout() is provided by passport
		// req.logout ends a session of a user by removing the req.user property
		req.logout();
		// redirects them to homepage
		
		return res.json( { redirect: '/' });
	})

/*

	ADMIN AUTHENTICATION ROUTES

*/

	// using a Custom Callback from PassportJS
	router.post('/admin/auth/local-login', function(req,res,next) {

		passport.authenticate('local-login', function(err, user, info) {

			// this is checking what is returned from the passport strategy in passport.js
			if (err) { return res.json(err) }

			// user.error was set via the done() second parameter
			if (user.error) {

				
				// using res.json() we then set an error property on response.data which our HttpFactory will catch
				// and use Growl to show it
				return res.json( {error : user.error})
			}

			// logIn is from PassportJS
			req.logIn(user, function(err) {
				if (err) {
					return res.json(err);
				}
				return res.json( { redirect: '/profile'} )
			})
		})(req,res);

	})

	// GOOGLE AUTHENTICATION
	// scope is provided by Google
	// we determine what scope and service we want from Google - here we only want
	// basic profile information and user email
	// this route sends them to Google auth - where they see consent screen and give app access
	// to their information
	// nothing happens inside this 'get' route because it is just for authentication
	// source: https://cloud.google.com/nodejs/getting-started/authenticate-users
	router.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile']}
	))

	// processing the authorization response
	router.get('/auth/google/callback', passport.authenticate('google', {
		successRedirect: '/profile',
		failureRedirect: '/'
	}))



/*

	ADMIN AUTHORIZATION AND CONNECTION ROUTES

*/

	// //LOCAL AUTHORIZATION AND CONNECTION
	// router.get('/connect/local', function(req,res) {
	// 	res.render(__dirname + '/connect-local.handlebars', { message : req.flash('loginMessage') })
	// })

	router.post('/connect/local', function(req,res, next) {
		passport.authenticate('local-signup', function(err, user, info) {
			if (err) {
				return res.json(err);
			}

			if (user.error) {
				return res.json( { error: user.error} );
			}

			req.logIn(user, function(err) {
				if (err) {
					return res.json(err);
				}
				return res.json( { redirect: '/profile'})
			}) 
		})(req,res);
	});

	// GOOGLE AUTHORIZATION AND CONNECTION
	router.get('/connect/google', passport.authorize('google', { scope: ['profile', 'email']}))

	router.get('/connect/google/callback', passport.authorize('google', {
		successRedirect: '/',
		failureRedirect: '/connect/google'
	}))


	router.get('/api/userData', isLoggedInAjax, function(req,res) {
		return res.json(req.user);
	})


	// this function is used to check authentication: http://stackoverflow.com/questions/38820251/what-is-req-isauthenticated-passportjs
	// req.isAuthenticated returns 'true' if logged in - from PassportJS
	function isLoggedIn(req,res,next) {

		if ( req.isAuthenticated() ) {
			return next();
		}
		else {
			res.redirect('/');
		}
	}

	// because this request is made in angular by the ProfileController the response
	// has to be return as JSON to be used by our httpFactory
	function isLoggedInAjax(req,res,next) {
		
		// if not authenticated
		if (!req.isAuthenticated()) {
			return res.json( { redirect: '/login'} );
		}
		else {
			next();
		}
	}

/*
	
	 UNLINK ACCOUNTS

*/

	router.get('/unlink/local', function(req,res) {
		var user = req.user;
		user.local.email = undefined;
		user.local.password = undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});

	router.get('/unlink/google', function(req, res) {
		var user = req.user;
		user.google.token = undefined;
		user.google.name = undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});

/*

	THE CATCH ALL ELSE ROUTE

*/

	// '*' means all other routes
	router.get('*', function(req,res) {

		res.sendFile(__dirname + '/index.html')
	})
};