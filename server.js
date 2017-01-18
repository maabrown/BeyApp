const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const cred = require('./cred/credentials.js');
const exphbs = require('express-handlebars');
const highlighter = require('keyword-highlighter');

// signs into the database
var url = 'mongodb://' + cred.username + ':' + cred.password + cred.datab;

var db;

//sets up 'router' Express router for this application
var router = express.Router();

//sets up 'adminRouter' Express router for this application
var adminRouter = express.Router();

// registers filename 'handlebars', and calls the exphb variable from above
// and passes in the parmeters when it get a file with the extention
app.engine('handlebars', exphbs({
	layoutsDir: './prod/views/layouts/',
	defaultLayout: 'main'
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
app.use(express.static(__dirname + '/prod/public'));

// parses application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// parses application/json
app.use(bodyParser.json());

// when you get / use the router registered above
app.use('/', router);

// when you get /admin use the AdminRouter registered above
app.use('/admin', adminRouter);


MongoClient.connect(url, (err,database) => {
	if (err) return console.log(err);
	db = database;

	db.collection('lyrics').createIndex( 
		{
			"lyrics" : "text",
		}
	);

	router.use( (req,res,next) => {
		
		console.log('movement is happening');
		next();
	});

	// router.get('/', (req,res) => {
	// 	db.collection('quotes').find().toArray( function(err, results) {
	// 		console.log(results);
	// 	res.render('index');
	// 	})
	// });

	// router.get('/', (req,res) => {
	// 	res.render('search');
	// });

	router.get('/search', (req,res) => {
		// console.log(req.body.searchTerm)
		console.log('it has hit search');
		
		db.collection('lyrics')
		.find(
				{ $text : 
					{ $search : 'pray' }
				},
				{ "title" : 1, "album" : 1 }
			)
		.toArray(
			(err, result) => {
				if (err) return res.send(err)
				res.send(result);		
			}
		)
	})

	router.get('/lyrics', (req,res) => {
		console.log(req.query.searchTerm);
		db.collection('lyrics')
		.find(
				{ $text : 
					{ $search : req.query.searchTerm }
				},
				{ "title" : 1, "album" : 1, "lyrics" : 1}
			)
		.toArray(
			(err, result) => {
				console.log('getting toArray');
				console.log(result[0]);
				const regExSearchTerm = new RegExp(req.query.searchTerm, 'igm');
				const regExReplaceHTML = new RegExp("\/n", 'igm')
				var matchesArray = [];
				result.forEach( (element) => {
					console.log(element["lyrics"]);
					console.log(typeof element["lyrics"]);
					matchesArray = element["lyrics"].match(regExSearchTerm);
					console.log(regExSearchTerm);
					console.log(matchesArray);
					console.log(matchesArray.length);
					element["matches"] = matchesArray.length;
				});
				if (err) return res.send(err)
				// res.send(result);
				console.log(req.query.searchTerm);
				var term = req.query.searchTerm.toString();
				res.render('results', { searchTerm : term , handlebarVariable : result, })
			}
		)
	})

	router.post('/quotes', (req,res) => {
		db.collection('quotes').save(req.body, (err, result) => {
			if (err) return console.log(err);
		})
		console.log(req.body);

	});

	router.put('/quotes', (req,res) => {
		db.collection('quotes').findOneAndUpdate(
			{ "name" : "bey"},
			{ "$set" : { "quote" : req.body.quote}},
			{ "sort" : {"_id" : -1 }},
			(err, result) => {
				if (err) return res.send(err)
				res.send(result)
			}
		)
	})

	router.delete('/quotes', (req,res) => {
		db.collection('quotes').findOneAndDelete(
			{ "name" : req.body.name },
			(err, result) => {
				if (err) return res.send(err)
				res.send('It is done')
			}
		)
	})

	adminRouter.get('/', (req, res) => {
		console.log('second router working');
		res.render('admin');
	})

	adminRouter.post('/', (req,res) => {
		console.log('get adminRouter PUT method');
		var lyrics = req.body.lyrics;
		// var findRegEx = /[A-Z]+/g;
		// var replaceRegEx = "\n$&";
		// var formattedLyrics = lyrics.replace(findRegEx, replaceRegEx);
		console.log(lyrics);
		db.collection('lyrics').insertOne( 
			{
			"title" : req.body.title,
			"album" : req.body.album,
			"featArtist" : req.body.featArtist,
			"lyrics" : req.body.lyrics
			},
			(err, result) => {
				if (err) return res.send(err)
				res.render('index', { songs : req })
			}
		)
	})

	// '*' means all other routes
	router.get('*', function(req,res) {
		res.sendFile(__dirname + '/prod/public/index.html')
	})
})



// start app after getting the 'port' variable
app.listen(app.get('port'));
console.log('Magic at ' + app.get('port'));


