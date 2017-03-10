module.exports = function(app, router, adminRouter, url, MongoClient, passport) {

	//THINGS TO FIX - PULL MONGOCLIENT TO THIS OUTER SCOPE AND DEFINE IT SO I DONT 
	// HAVE TO REUSE IT FOR EVERY ROUTE

	router.use( (req,res,next) => {
		next();
	});

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

	// login form
	router.get('/login', function(req, res) {
		// loginMessage is inside passport.js
		res.render(__dirname + '/views/login.handlebars' 
			// { message : req.flash('loginMessage')}
			);
	}) 

	// sign up form
	router.get('/signup', function(req, res) {
		res.render(__dirname + '/views/signup.handlebars',
			{ message : req.flash('signupMessage')} 
			);
	});

	// process form
	// redirects from Passport docs
	router.post('/signup', passport.authenticate('local-signup', {
		failureRedirect: '/signup',
		successRedirect: '/',
		// allows for flash messages
		failureFlash : true
	}) )


	// router.post('/signup', passport.authenticate('local-signup'),
	// 	function(req, res) {
	// 		console.log(res);
	// 	}
	// )

	// see profile - use express router to use function isLoggedIn https://expressjs.com/en/guide/routing.html
	// can pass an array of functions to a route that continue in a waterfall fashion
	router.get('/profile', isLoggedIn, function (req, res) {
		res.render('profile.html', { user: req.user })
	})

	router.get('logout', function(req,res) {
		// req.logout() is provided by passport
		// req.logout ends a session of a user by removing the req.user property
		req.logout();
		// redirects them to homepage
		res.redirect('/');
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

	// router.post('/quotes', (req,res) => {
	// 	db.collection('quotes').save(req.body, (err, result) => {
	// 		if (err) return console.log(err);
	// 	})
	// 	console.log(req.body);

	// });

	// router.put('/quotes', (req,res) => {
	// 	db.collection('quotes').findOneAndUpdate(
	// 		{ "name" : "bey"},
	// 		{ "$set" : { "quote" : req.body.quote}},
	// 		{ "sort" : {"_id" : -1 }},
	// 		(err, result) => {
	// 			if (err) return res.send(err)
	// 			res.send(result)
	// 		}
	// 	)
	// })

	// router.delete('/quotes', (req,res) => {
	// 	db.collection('quotes').findOneAndDelete(
	// 		{ "name" : req.body.name },
	// 		(err, result) => {
	// 			if (err) return res.send(err)
	// 			res.send('It is done')
	// 		}
	// 	)
	// })

	adminRouter.post('/', (req,res) => {
		console.log('get adminRouter PUT method');
		var lyrics = req.body.lyrics;
		// var findRegEx = /[A-Z]+/g;
		// var replaceRegEx = "\n$&";
		// var formattedLyrics = lyrics.replace(findRegEx, replaceRegEx);
		console.log(req.query.songTitle);
		console.log(req.query.albumTitle);
		console.log(req.query.songLyrics);
		console.log(req.query.featArtist);
		db.collection('lyrics').insertOne( 
			{
			"title" : req.query.songTitle,
			"album" : req.query.albumTitle,
			"featArtist" : req.query.featArtist,
			"lyrics" : req.query.songLyrics
			},
			(err, result) => {
				if (err) return res.send(err)
				res.send(result)
			}
		)
	})

	adminRouter.delete('/', (req,res) => {
		
	})

	// '*' means all other routes
	router.get('*', function(req,res) {

		// could i make this ('./index.html')?
		res.sendFile(__dirname + './index.html')
	})
};