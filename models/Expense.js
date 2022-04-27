const mongoose = require('mongoose');
const ExpenseSchema = mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user',
	},
	budget: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'budget',
		required: true,
	},
	narration: {
		type: String,
	},
	amount: {
		type: Number,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

const Expense = mongoose.model('expense', ExpenseSchema);

module.exports = Expense;
