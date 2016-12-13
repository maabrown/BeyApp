const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const cred = require('./cred/credentials.js');
const exphbs = require('express-handlebars');


var url = 'mongodb://' + cred.username + ':' + cred.password + cred.datab;
var db;
var router = express.Router();
var secRouter = express.Router();

app.engine('handlebars', exphbs({
	layoutsDir: './prod/views/layouts/',
	defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
app.set('views', process.cwd() + '/prod/views/');
app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/prod/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/', router);
app.use('/second', secRouter);

MongoClient.connect(url, (err,database) => {
	if (err) return console.log(err);
	db = database;

	router.use( (req,res,next) => {
		console.log('movement is happening');
		next();
	});

	router.get('/', (req,res) => {
		db.collection('quotes').find().toArray( function(err, results) {
			console.log(results);
			res.render('list', {peeps : results});
		})
	});

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

	secRouter.get('/', (req,res) => {
		console.log('second router working');
	})

})

app.listen(app.get('port'));



