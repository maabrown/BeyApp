const express = require('express');
const app = express();
//  pulls information from HTML POST
const bodyParser = require('body-parser');
// /const MongoClient = require('mongodb').MongoClient;
const cred = require('./cred/credentials.js');
// delete highlighter
const highlighter = require('keyword-highlighter');
// passport for authentication
var passport = require('passport');
// request logger middleware
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const path = require('path');

// signs into the database
var url = 'mongodb://' + cred.username + ':' + cred.password + cred.datab;


// var url2 = 'mongodb://' + process.env.USERNAME + ':' + process.env.PASSWORD + process.env.DATAB;

mongoose.connect(url);
var mongooseDB = mongoose.connection;
mongooseDB.once('open', function () {
	console.log('opened');
})

// sets the port value 
// process.env is the environment variable which can change depending 
// on if it is on Heroku or on your local computer
app.set('port', process.env.PORT || 8080);

// serves static conent for the app from the public directory
// so prod/public/index.html is /index.html for the app
app.use(express.static(__dirname + '/prod/public'));

// parses application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// parses application/json
app.use(bodyParser.json());

// read cookies (needed for auth)
app.use(cookieParser());

// log every request to the console
app.use(morgan('dev'));

// setting session secret - used to create the hash for cryptography
app.use(session({ secret: cred.secret }))

app.use(passport.initialize());

// persistent login sessions
app.use(passport.session());

//sets up 'router' Express router for this application
var router = express.Router();

// when you get / use the router registered above
app.use('/', router);

// pass-in passport module to passport JS file
require('./app/passport.js')(passport);

require('./prod/public/routes.js')(app, router, passport);

// start app after getting the 'port' variable
app.listen(app.get('port'));
console.log('Magic at ' + app.get('port'));