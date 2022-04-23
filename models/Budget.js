const mongoose = require('mongoose');
const BudgetSchema = mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'users',
	},
	name: {
		type: String,
		required: true,
	},
	max_spending: {
		type: Number,
		required: true,
	},
	start_date: {
		type: Date,
		required: true,
	},
	end_date: {
		type: Date,
		required: true,
	},
	hasExpired: {
		type: Boolean,
		default: false,
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

const Budget = mongoose.model('budget', BudgetSchema);

module.exports = Budget;
