const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// loads in Google+ authentication
// var configAuth = require('../cred/googleCredentials.js');

module.exports = function(passport) {
	
	// serialize the user for the session - allows for you to check if a user is already checked in
	// by checking to see if req.user exists
	// from Passport docs
	passport.serializeUser( function(user, done) {
		console.log('serialized');
		done( null, user.id);
	});

	passport.deserializeUser( function(id, done) {
		console.log('deserialized');
		User.findById(id, function(err, user) {
			done(err, user);
		});
	})

	// strategies and their configs are supplied via the use()
	// strategies are used to authenticate requests
	// using a named strategy
	passport.use('local-signup', new LocalStrategy(
		// create this object b/c localStrategy usually just takes username and password
		{
			usernameField: 'email',
			passwordField: 'password',
			// allows us to pass the entire request object to the callback
			// allows us to do authentication and authorization in same use()
			passReqToCallback: true
		},

		function(req, email, password, done) {

			// using Node to be async
			// waiting for the form submission and for information to passed to the strategy
			process.nextTick(
				function() {
					
					// checks if person is already logged in via Google
					if (!req.user){	
						// uses Mongoose query style to find user
						User.findOne( {'local.email' : email}, function(err, user) {

							// if there is an error - log it
							if (err) { return done(err)}

							// if we find that the user already exists
							if (user) {
								
								return done(null, { error: 'This email is already taken'});
							}

							else {
								// if no error or user doesn't exist make a new user
								// create new instance of User
								var newUser = new User();
								// email is the parameter that was passed into function - line 36
								newUser.local.email = email;
								// question, why use newUser here rather than User.generateHash(password)?
								newUser.local.password = newUser.generateHash(password);
								// save is Mongoose method
								newUser.save( function(err) {
									if (err) { throw err }
									else {
										
										// this 'done' function is from PassportJS - validation callback
										// passes the user back to passport
										// make sure that this is newUser and not user
										// QUESTION: is this because we have made a new User() rather
										// than passing back the 'user' we passed into the function?
										return done(null, newUser)
									}
								})
							}
						})
					}
					// checks if the person, if logged in, has a local account
					// if they don't, they will do the following code
					else if (!req.user.local.email) {
						var user = req.user;
						user.local.email = email;
						user.local.password = user.generateHash(password);

						user.save( function(err) {
							if (err) { throw err }

							else {
								
								return done(null, user);
							}
						})
					}
					// if they are logged in AND they have a local login, ignore it
					// use PassportJS method of ignoring via done()
					//
					else {
						return done(null, { error : 'You\'re already logged in via local account'});
					}
				}
			)
		}
	))

	// creating another strategy for login
	passport.use('local-login', new LocalStrategy ({
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback: true
	},
	function(req, email, password, done) {

		// standardizes the input
		if (email) email = email.toLowerCase();

			User.findOne({ 'local.email' : email}, function(err, user) {
				if (err) { 
					console.log('this is an err ' + err);
					return done(err); 
				}

				// if user is false (meaning no user) - makes it true and thus performs the code
				if (!user) {
					console.log('this should say no user found');
					// adds the 'error' property to user object that is returned via the done()
					// to route.js
					return done(null, { error: 'No user found'});
				}

				// validPassword is a method on our User object in user.js
				// if password isn't what we have on DB then return error
				if (!user.validPassword(password)) {
					console.log('this should say wrong password');
					return done(null, { error: 'Wrong password'});
				}

				else {
					return done(null, user);
				}
			})
	}))

	// create strategy for Google
	passport.use(new GoogleStrategy({

		// this idenfies the app
		clientID : process.env.GOOGLE_CLIENTID,
		clientSecret : process.env.GOOGLE_CLIENTSECRET,
		callbackURL: process.env.GOOGLE_CLIENTCALLBACK,
		passReqToCallback: true // passes the req to callback
	
	},

	// this function documentation: https://github.com/jaredhanson/passport-google-oauth2
	// req is passed by PassportJS, profile is Google's ID
	// done is the callback used by PassportJS
	function(req, accessToken, refreshToken, profile, done) {

		// if someone is logged in, their information is on req.user via PassportJS
		if (!req.user) {

			User.findOne({ 'google.id': profile.id}, function(err,user) {
				
				// if err on database side, send error
				if (err) { return done(err) }

				// if user exists already in database
				if (user) {

					// there isn't a token with the id
					if (!user.google.token) {
						user.google.token = accessToken;
						user.google.name = profile.displayName;
						user.google.email = profile.emails[0].value;

						user.save(function(err) {
							if (err)
								throw err;
							return done(null, user);
						})
					}

					return done(null, user);
				}
				else {
					var newUser = new User();

					// Using the schema created for model in User.js
					newUser.google.id = profile.id;
					newUser.google.token = accessToken;
					newUser.google.name = profile.displayName;
					newUser.google.email = profile.emails[0].value;

					newUser.save(function(err) {
						if (err) { throw err }
						return done(null, newUser);
					})
				}
			})
		}
		else {

			// 
			var user = req.user;
			// check this profile passed back from Google
			user.google.id = profile.id;
			user.google.token = accessToken;
			// check profile name
			user.google.name = profile.name.givenName;
			user.google.email = profile.emails[0].value;

			user.save(function(err) {
				if (err) { throw err }
				return done(null, user);
			})

		}
	}
	))
}