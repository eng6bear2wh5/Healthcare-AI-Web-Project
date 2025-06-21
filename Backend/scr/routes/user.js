// routes/user.js
const express = require('express');
const router  = express.Router();
const User    = require('../app/models/user');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('user'), async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).lean();
    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.put('/', protect, authorize('user'), async (req, res, next) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, upsert: true, setDefaultsOnInsert: true }).lean();
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// DELETE
router.delete('/', protect, authorize('user'), async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ success: true });
  } catch (e) { next(e); }
});

module.exports = router;

