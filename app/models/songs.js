const mongoose = require('mongoose');

var songSchema = mongoose.Schema({
	title: String,
	album: String,
	featArtist: String,
	lyrics: String,
	matches: Number
	},
	{ collection: 'lyrics' }
	).index({
		'lyrics' : 'text'
	});

module.exports = mongoose.model('Song', songSchema);

