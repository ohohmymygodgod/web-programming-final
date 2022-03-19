const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
	username: {
		type: String,
		required: [true, 'Username field is required.']
	},
	password: {
		type: String,
		required: [true, 'Password field is required.']
	},
	group: {
		type: String
	},
	token: {
		type: String,
		required: [true, 'Token field is required.']
	}
})

const User = mongoose.model('User', UserSchema)

module.exports = User