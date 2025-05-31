const express = require('express');
const router = express.Router();
const UD = require('../app/models/UserDiet');
const { protect, authorize } = require('../middleware/auth');

// GET by user
router.get('/me', protect, authorize('user'), async (req, res, next) => {
  try { res.json(await UD.findOne({ user_id: req.user.id }).sort({ updateAt: -1 }).lean()); } catch (e) { next(e); }
});

// POST new (req.body { user_id, date, meals, notes })
router.post('/', protect, authorize('user'), async (req, res, next) => {
  try {
    const data = { ...req.body, user_id: req.user.id };
    res.status(201).json(await UD.create(data));
  } catch (e) { next(e); }
});

// PUT update (body chỉ { meals, notes })
router.put('/', protect, authorize('user'), async (req, res, next) => {
  try { res.json(await UD.findOneAndUpdate(req.user.id, { ...req.body, user_id: req.user.id }, { new: true, upsert: true, setDefaultsOnInsert: true }).sort({ updateAt: -1 }).lean()); }
  catch (e) { next(e); }
});

// DELETE
router.delete('/', protect, authorize('user'), async (req, res, next) => {
  try { await UD.findOneAndDelete({user_id: req.user.id}).sort({ updateAt: -1 }); res.json({ success: true }); }
  catch (e) { next(e); }
});

// GET all
// router.get('/', async (req, res, next) => {
//   try { res.json(await UD.find()); } catch(e){ next(e); }
// });

// GET by ID
// router.get('/:id', async (req, res, next) => {
//   try { res.json(await UD.findById(req.params.id)); } catch(e){ next(e); }
// });
module.exports = router;
