const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MessageSchema = new Schema({
	sender: {
		type: String,
		required: [true, 'Sender field is required.']
	},
	group: {
		type: String,
		required: [true, 'Group field is required.']
	},
	body: {
		type: String,
		required: [true, 'Body field is required.']
	}
})

const Message = mongoose.model('Message', MessageSchema)

module.exports = Message