const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const Expense = require('../models/Expense');

//@route   GET api/v1/expenses/:budget_id
//@desc    Get all expenses for budgets
//@access  Private
router.get('/:budget_id', auth, async (req, res) => {
	try {
		const expenses = await Expense.find({ budget: req.params.id }).sort();
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
		const newExpense = new Expense({
			narration,
			amount,
			budget,
		});

		const expense = await newExpense.save();
		res.json({ expense, msg: 'Expense Added' });
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ msg: 'Server Error' });
	}
});

module.exports = router;
