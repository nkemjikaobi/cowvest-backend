const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

const User = require('../models/User');

//@route   PUT api/v1/fund
//@desc    Fund wallet
//@access  Private
router.put('/', auth, async (req, res) => {
	const { amount } = req.body;

	const userFields = {};
	userFields.balance = amount;

	try {
		let user = await User.findById(req.params.id);
		//Check if user exists
		if (!user) {
			return res.status(404).json({ msg: 'User not found' });
		}

		//Update the user
		user = await User.findByIdAndUpdate(
			req.params.id,
			{ $set: userFields },
			{ new: true }
		);
		res.json(user);
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ msg: 'Server Error' });
	}
});

module.exports = router;
