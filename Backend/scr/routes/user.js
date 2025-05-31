// routes/user.js
const express = require('express');
const router  = express.Router();
const User    = require('../app/models/user');
const { protect, authorize } = require('../middleware/auth');

// ==== TEST MODE (chưa có JWT) ====
// Thay YOUR_TEST_USER_ID bằng ObjectId bạn đã chèn vào DB
const testModeFallback = '68144307237289e8d5982c9d';

// GET  /api/user/profile-test?userId=<id>
router.get('/profile-test', async (req, res, next) => {
  try {
    const userId = req.query.userId || testModeFallback;
    const user = await User.findById(userId).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// PUT  /api/user/profile-test?userId=<id>
router.put('/profile-test', async (req, res, next) => {
  try {
    const userId = req.query.userId || testModeFallback;
    const updates = req.body;
    const user = await User.findByIdAndUpdate(userId, updates, { new: true }).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// ==== PRODUCTION MODE (có JWT) ====
router.get('/profile', protect, authorize('user'), async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).lean();
    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.put('/profile', protect, authorize('user'), async (req, res, next) => {
  try {
    if(!req.user.id) console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, upsert: true }).lean();
    res.json(user);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

