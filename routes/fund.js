const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');

const User = require('../models/User');
const History = require('../models/History');

//@route   PUT api/v1/fund
//@desc    Fund wallet
//@access  Private
router.put('/', auth, async (req, res) => {
	const { amount } = req.body;

	try {
		let user = await User.findById(req.user.id);
		//Check if user exists
		if (!user) {
			return res.status(404).json({ msg: 'User not found' });
		}

		const userFields = {};
		userFields.balance = parseInt(user.balance) + parseInt(amount);

		//Update the user
		user = await User.findByIdAndUpdate(
			req.user.id,
			{ $set: userFields },
			{ new: true }
		);

		// Add it to history
		const newHistory = new History({
			user: req.user.id,
			name: 'Funded Wallet',
			type: 'credit',
			amount: parseInt(amount),
		});

		await newHistory.save();

		res.status(200).json({ user, msg: `Wallet Funded with ₦${amount}` });
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ msg: 'Server Error' });
	}
});

module.exports = router;
