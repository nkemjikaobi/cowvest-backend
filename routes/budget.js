const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const Budget = require('../models/Budget');

//@route   GET api/v1/budgets
//@desc    Get all users budgets
//@access  Private
router.get('/', auth, async (req, res) => {
	try {
		const budgets = await Budget.find({ user: req.user.id }).sort({
			date: -1,
		});
		res.json(budgets);
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ msg: 'Server Error' });
	}
});

//@route   POST api/v1/budgets
//@desc    Add new budget
//@access  Private
router.post('/', auth, async (req, res) => {
	const { name, max_spending, start_date, end_date, hasExpired } = req.body;
	try {
		const newBudget = new Budget({
			name,
			max_spending,
			start_date,
			end_date,
			hasExpired,
			user: req.user.id,
		});

		const budget = await newBudget.save();
		res.json(budget);
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ msg: 'Server Error' });
	}
});

//@route   delete api/v1/budgets/:id
//@desc    Delete users budgets
//@access  Private
router.delete('/:id', auth, async (req, res) => {
	try {
		let budget = await Budget.findById(req.params.id);

		//Check if budget has expired
		if (!budget.hasExpired) {
			return res.status(400).status.json({ msg: 'Budget is still active' });
		}
		//Check if budget exists
		if (!budget) {
			return res.status(404).status.json({ msg: 'Budget not found' });
		}

		//Check that user owns the budget
		if (budget.user.toString() !== req.user.id) {
			return res.status(401).json({ msg: 'Not Authorized' });
		}

		//Delete the budget
		await Budget.findByIdAndRemove(req.params.id);
		res.json({ msg: 'Budget Removed ' });
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ msg: 'Server Error' });
	}
});

module.exports = router;
