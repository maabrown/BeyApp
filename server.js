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
		next();
	});

	router.get('/getLyrics', (req,res) => {
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
		res.sendFile(__dirname + '/prod/public/index.html')
	})
})



// start app after getting the 'port' variable
app.listen(app.get('port'));
console.log('Magic at ' + app.get('port'));


