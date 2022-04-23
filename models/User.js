const mongoose = require('mongoose');
const UserSchema = mongoose.Schema({
	first_name: {
		type: String,
		required: true,
	},
	balance: {
		type: Number,
		default: 0,
	},
	last_name: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

const User = mongoose.model('user', UserSchema);

module.exports = User;
