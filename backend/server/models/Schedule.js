const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ScheduleSchema = new Schema({
	Year: {
		type: Number,
		required: [true, 'Year field is required.']
	},
	Month: {
		type: Number,
		required: [true, 'Month field is required.']
	},
	Date: {
		type: Number,
		required: [true, 'Date field is required.']
	},
	Time: {
		type: String,
		required: [true, 'Time field is required.']
	},
	visibility: {
		type: Number, // 0: personal, 1: group
		required: [true, 'Visibility field is required.']
	},
	name: {
		type: String, // store group/owner name
		required: [true, 'Name field is required.']
    },
    data: {
        type: String,
		required: [true, 'Data field is required.']
	},
	completed: {
		type: Boolean,
		required: [true, 'Completed field is required.']
	}
})

const Schedule = mongoose.model('Schedule', ScheduleSchema)

module.exports = Schedule