const express = require('express');
const router = express.Router();
const P = require('../app/models/Prescription');
const { protect, authorize } = require('../middleware/auth');

// GET by user
router.get('/me', protect, authorize('user'), async (req, res, next) => {
  try { res.json(await P.findOne({ user_id: req.user.id }).sort({ updateAt: -1 }).lean()); } catch (e) { next(e); }
});

// POST (body chỉ có { user_id, medical_history_id, prescribed_date, notes })
router.post('/', protect, authorize('user'), async (req, res, next) => {
  try {
    const data = { ...req.body, user_id: req.user.id };
    res.status(201).json(await P.create(data));
  } catch (e) { next(e); }
});

// PUT (body chỉ có { prescribed_date, notes })
router.put('/', protect, authorize('user'), async (req, res, next) => {
  try {
    const data = { ...req.body, user_id: req.user.id };
    const ui = await P.findOneAndUpdate(
      { user_id: req.user.id },
      data,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).sort({ updateAt: -1 }).lean();
    res.json(ui);
  } catch (err) { next(err); }
});

// DELETE
router.delete('/', protect, authorize('user'), async (req, res, next) => {
  try { await P.findOneAndDelete({ user_id: req.user.id}).sort({ updateAt: -1 }); res.json({ success: true }); }
  catch (e) { next(e); }
});

// GET all
// router.get('/', async (req, res, next) => {
//   try { res.json(await P.find()); } catch (e) { next(e); }
// });

// // GET by ID
// router.get('/:id', async (req, res, next) => {
//   try { res.json(await P.findById(req.params.id)); } catch (e) { next(e); }
// });
module.exports = router;
