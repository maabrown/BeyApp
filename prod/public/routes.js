module.exports = function(app, router, passport) {

	//THINGS TO FIX - PULL MONGOCLIENT TO THIS OUTER SCOPE AND DEFINE IT SO I DONT 
	// HAVE TO REUSE IT FOR EVERY ROUTE

	// DELETE THIS CODE - just extra middleware
	router.use( (req,res,next) => {
		next();
	});

/*
	
	API ROUTES FOR NON-SIGNED IN USER

*/

	// WHEN USER ENTERS A QUERY
	router.get('/getLyrics', (req,res) => {
		
		MongoClient.connect(url, (err, database) =>  {
			
			if (err) return console.log(error)

			var db = database

			db.collection('lyrics').createIndex( 
				{
					"lyrics" : "text",
				}
			);


		db.collection('lyrics')
			.find(
				{ $text :
					{ $search : req.query.searchTerm}	
				},
				{ "title" : 1, "album" : 1, "lyrics" : 1 }
			)
			.toArray(
				(err, result) => {
					if (err) return console.log(err);
					console.log(result);
					console.log("search Term: " + req.query.searchTerm);

					// figuring out how many times the term is in the lyrics
					// using ES6 for this function
					// result is an array so using forEach to iterate
					// using RegEx (object construction) to search for the term in the result
					// igm are RegEx flags, i - ignore case, g - global match (find all cases), m - multiline
					const regExSearchTerm = new RegExp(req.query.searchTerm, 'igm');
					
					// put this outside of scope of function so it can be continuously updated
					// as forEach is run
					var totalMatches = 0;

					result.forEach( (individResultObj) => {

						// individResultObj['lyrics'] - using bracket notation to get value in object
						// using match() String function to find matches using RegEx: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match
						// match() returns an array of each match
						var matchesArray = individResultObj['lyrics'].match(regExSearchTerm);
						
						// setting a new property on each result that is how many times the word is mentioned in the lyrics
						// using the length property to see how many times it is mentioned
						individResultObj['matches'] = matchesArray.length;

						//
						totalMatches = totalMatches + individResultObj['matches'];
					})
					result.push({ 'totalMatches' : totalMatches});
					return res.json(result);
				}
			)
		})
	})

/*

	ADMIN API ROUTES

*/


	// FILL THIS OUT LATER
	router.get('admin/deleteSong', (req,res) => {

	});


/*

	ADMIN ROUTES FOR USERS

*/
	

	// Login Form - has Google and Local Options
	// router.get('/admin/auth/local-login', function(req, res) {
	// 	// loginMessage is inside passport.js
	// 	res.sendFile(__dirname + '/views/login.html');
	// }) 


	// // Sign Up Form
	// router.get('/admin/signup', function(req, res) {
	// 	res.render(__dirname + '/views/signup.handlebars',
	// 		{ message : req.flash('signupMessage')} 
	// 		);
	// });

	// Processing Form
	// redirects from Passport docs
	// router.post('/admin/signup', passport.authenticate('local-signup', {
	// 	failureRedirect: '/admin/signup',
	// 	successRedirect: '/profile',
	// }) )

	router.post('/admin/signup', function(req,res,next) {
		
		passport.authenticate('local-signup', function(err, user, info) {
			if (err) { return err };

			if (!user) {
				console.log( '!user');
				return res.json( { error : user.error })
			}

			req.logIn(user, function(err) {
				if (err) { return res.json(err) };
				console.log('logIn working');
				return res.json( { redirect: '/profile' });
			})
		})(req,res);
	});

	// see profile - use express router to use function isLoggedIn https://expressjs.com/en/guide/routing.html
	// can pass an array of functions to a route that continue in a waterfall fashion
	// router.get('/profile', isLoggedIn, function (req, res) {
	// 	res.sendFile(__dirname + '/views/profile.html', { user: req.user })
	// })

	router.post('/logout', function(req,res) {
		// req.logout() is provided by passport
		// req.logout ends a session of a user by removing the req.user property
		req.logout();
		// redirects them to homepage
		console.log('is hitting the route');
		return res.json( { redirect: '/' });
	})


	// QUESTION - IS THIS ROUTE STILL NECESSARY? shouldn't i just redirect them to '/auth/google'
	// router.get('/googleLogin', (req,res) => {
	// 	res.render(__dirname + '/views/google-auth.handlebars')
	// })


/*

	ADMIN AUTHENTICATION ROUTES

*/
	// LOCAL AUTHENTICATION
	// login form submission
	// router.post('/admin/auth/local-login', passport.authenticate('local-login', {
	// 	failureRedirect: '/admin/local-login',
	// 	successRedirect: '/profile',
	// }))

	// using a Custom Callback from PassportJS
	router.post('/admin/auth/local-login', function(req,res,next) {

		passport.authenticate('local-login', function(err, user, info) {

			// this is checking what is returned from the passport strategy in passport.js
			if (err) { return res.json(err) }

			// user.error was set via the done() second parameter
			if (user.error) {

				console.log(user);
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
		console.log('getting userData');
		console.log(req.user);
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