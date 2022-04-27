const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const Expense = require('../models/Expense');
const Budget = require('../models/Budget');

//@route   GET api/v1/expenses/:budget_id
//@desc    Get all expenses for budgets
//@access  Private
router.get('/:budget_id', auth, async (req, res) => {
	try {
		const expenses = await Expense.find({ budget: req.params.budget_id })
			.populate('budget')
			.sort()
			.lean();
		res.json(expenses);
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ msg: 'Server Error' });
	}
});

//@route   GET api/v1/expenses
//@desc    Get all expenses for a user
//@access  Private
router.get('/', auth, async (req, res) => {
	try {
		const expenses = await Expense.find({ user: req.user.id }).sort({
			date: -1,
		});
		res.json(expenses);
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ msg: 'Server Error' });
	}
});

//@route   POST api/v1/expenses
//@desc    Add new expense
//@access  Private
router.post('/', auth, async (req, res) => {
	const { narration, amount, budget } = req.body;

	try {
		//Get the budget
		let currentBudget = await Budget.findById(budget);

		if (currentBudget.max_spending < amount) {
			return res
				.status(500)
				.json({ msg: `Expense exceeds budget for ${currentBudget.name}` });
		}

		const budgetFields = {};
		budgetFields.max_spending =
			parseInt(currentBudget.max_spending) - parseInt(amount);

		//Update the budget
		currentBudget = await Budget.findByIdAndUpdate(
			budget,
			{ $set: budgetFields },
			{ new: true }
		);

		const newExpense = new Expense({
			narration,
			amount,
			budget,
			user: req.user.id,
		});

		const expense = await newExpense.save();
		res.json({ expense, currentBudget, msg: 'Expense Added' });
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ msg: 'Server Error' });
	}
});

module.exports = router;
