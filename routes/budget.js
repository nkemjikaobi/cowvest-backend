const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const Budget = require('../models/Budget');
const User = require('../models/User');
const History = require('../models/History');

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
		let user = await User.findById(req.user.id);

		if (user.balance < max_spending) {
			return res.status(500).json({ msg: 'Insufficient Funds' });
		}

		const userFields = {};
		userFields.balance = parseInt(user.balance) - parseInt(max_spending);

		const newBudget = new Budget({
			name,
			max_spending,
			start_price: max_spending,
			start_date,
			end_date,
			hasExpired,
			user: req.user.id,
		});

		const budget = await newBudget.save();

		//Update the user
		user = await User.findByIdAndUpdate(
			req.user.id,
			{ $set: userFields },
			{ new: true }
		);

		// Add it to history
		const newHistory = new History({
			user: req.user.id,
			name: `Created budget for ${name}`,
			type: 'debit',
			amount: parseInt(max_spending),
		});

		await newHistory.save();

		res.json({ budget, user, msg: 'Budget Created' });
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
		res.json({ id: req.params.id, msg: 'Budget Removed ' });
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ msg: 'Server Error' });
	}
});

module.exports = router;
