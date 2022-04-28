const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const History = require('../models/History');

//@route   GET api/v1/history
//@desc    Get all users transaction history
//@access  Private
router.get('/', auth, async (req, res) => {
	try {
		const history = await History.find({ user: req.user.id }).sort({
			date: -1,
		});
		res.json(history);
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ msg: 'Server Error' });
	}
});

module.exports = router;
