const express = require('express');
const app = express();
//  pulls information from HTML POST
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const cred = require('./cred/credentials.js');
const exphbs = require('express-handlebars');
// delete highlighter
const highlighter = require('keyword-highlighter');
// passport for authentication
var passport = require('passport');
// passing sesion flashdata messages
var flash = require('connect-flash');
// request logger middleware
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');

// signs into the database
var url = 'mongodb://' + cred.username + ':' + cred.password + cred.datab;

var db;

mongoose.connect(url);
var mongooseDB = mongoose.connection;
mongooseDB.once('open', function () {
	console.log('opened');

})



// registers filename 'handlebars', and calls the exphb variable from above
// and passes in the parmeters when it get a file with the extention
app.engine('handlebars', exphbs({
	layoutsDir: './prod/public/views'
}));

// sets defaul engine to 'handlebars' which then triggers the app.engine line
app.set('view engine', 'handlebars');

// sets directory for application's views
app.set('views', process.cwd() + '/prod/public/views/');

// sets the port value 
// process.env is the environment variable which can change depending 
// on if it is on Heroku or on your local computer
app.set('port', process.env.PORT || 3000);

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


// Moved all my session information and flash before I defined my routers
// setting session secret - used to create the hash for cryptography
app.use(session({ secret: 'thisIsRealLife'}))

app.use(passport.initialize());

// persistent login sessions
app.use(passport.session());

// uses flash-messages
app.use(flash());

//sets up 'router' Express router for this application
var router = express.Router();

//sets up 'adminRouter' Express router for this application
var adminRouter = express.Router();

// when you get / use the router registered above
app.use('/', router);

// when you get /admin use the AdminRouter registered above
app.use('/admin', adminRouter);


// MongoDB connection doesn't have to hold the routers
// MongoClient.connect(url, (err,database) => {
	
// 	if (err) return console.log(err);
// 	db = database;

// 	db.collection('lyrics').createIndex( 
// 		{
// 			"lyrics" : "text",
// 		}
// 	);
// });

// pass-in passport module to passport JS file
require('./cred/passport')(passport);

require('./prod/public/routes.js')(app, router, adminRouter, url, MongoClient, passport);



// start app after getting the 'port' variable
app.listen(app.get('port'));
console.log('Magic at ' + app.get('port'));


