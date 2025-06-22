const express = require('express');
const router = express.Router();
const MH = require('../app/models/MedicalHistory');
const { protect, authorize } = require('../middleware/auth');


// GET by current logged-in user (use req.user.id)
router.get('/me', protect, authorize('user'), async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    res.json(await MH.findOne({ user_id: req.user.id }).lean());
  } catch (e) { next(e); }
});

// POST new entry
router.post('/', protect, authorize('user'), async (req, res, next) => {
  try {
    // req.body: { disease_name, diagnosis_date, notes }
    const data = { ...req.body, user_id: req.user.id };
    res.status(201).json(await MH.create(data));
  } catch (e) { next(e); }
});

// PUT update
router.put('/', protect, authorize('user'), async (req, res, next) => {
  try {
    const data = { ...req.body, user_id: req.user.id };
    const ui = await MH.findOneAndUpdate(
      { user_id: req.user.id },
      data,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();
    res.json(ui);
  } catch (err) { next(err); }
});

// DELETE
router.delete('/', protect, authorize('user'), async (req, res, next) => {
  try {
    await MH.findOneAndDelete({ user_id: req.user.id });
    res.json({ success: true });
  } catch (e) { next(e); }
});


module.exports = router;
