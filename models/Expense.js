const mongoose = require('mongoose');
const ExpenseSchema = mongoose.Schema({
	budget: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'budgets',
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
