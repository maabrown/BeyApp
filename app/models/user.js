const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
	local	: {
		email		: String,
		password	: String
	},
	google	: {
		id			: String,
		token		: String,
		email		: String,
		name		: String
	},
	permission : {
		add			: String,
		delete		: String
	}
	},
	{ collection: 'Users'} 
	);

// create hash, returns a hash that you save into DB
userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

// checking the hash, returns true or false
userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);