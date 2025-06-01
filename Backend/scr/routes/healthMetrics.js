const express = require('express');
const router = express.Router();
const HM = require('../app/models/HealthMetric');
const { protect, authorize } = require('../middleware/auth');

// GET by user
router.get('/me', protect, authorize('user'), async (req, res, next) => {
  try { res.json(await HM.findOne({ user_id: req.user.id }).sort({ updateAt: -1 }).lean()); } catch (e) { next(e); }
});

// POST new (body { user_id, date, bmi, weight, blood_pressure, heart_rate, … })
router.post('/', protect, authorize('user'), async (req, res, next) => {
  try {
    const data = { ...req.body, user_id: req.user.id };
    res.status(201).json(await HM.create(data));
  } catch (e) { next(e); }
});

// PUT update (body chỉ các số liệu, không user_id/date)
router.put('/', protect, authorize('user'), async (req, res, next) => {
  try {
    const updated = await HM.findOneAndUpdate(
      { user_id: req.user.id }, // ✅ đúng filter
      { ...req.body, user_id: req.user.id }, // cập nhật dữ liệu
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();

    res.json(updated);
  } catch (e) {
    next(e);
  }
});


// DELETE
router.delete('/', protect, authorize('user'), async (req, res, next) => {
  try { await HM.findOneAndDelete({ user_id: req.user.id }).sort({ updateAt: -1 }); res.json({ success: true }); }
  catch (e) { next(e); }
});

// GET all
// router.get('/', async (req, res, next) => {
//   try { res.json(await HM.find()); } catch (e) { next(e); }
// });

// GET single
// router.get('/:id', async (req, res, next) => {
//   try { res.json(await HM.findById(req.params.id)); } catch (e) { next(e); }
// });
module.exports = router;
