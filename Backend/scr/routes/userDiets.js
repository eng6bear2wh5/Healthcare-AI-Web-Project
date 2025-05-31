const express = require('express');
const router  = express.Router();
const UD      = require('../app/models/UserDiet');

// GET all
router.get('/', async (req, res, next) => {
  try { res.json(await UD.find()); } catch(e){ next(e); }
});

// GET by ID
router.get('/:id', async (req, res, next) => {
  try { res.json(await UD.findById(req.params.id)); } catch(e){ next(e); }
});

// GET by user
router.get('/user/:userId', async (req, res, next) => {
  try { res.json(await UD.find({ user_id: req.params.userId })); } catch(e){ next(e); }
});

// POST new (req.body { user_id, date, meals, notes })
router.post('/', async (req, res, next) => {
  try { res.status(201).json(await UD.create(req.body)); } catch(e){ next(e); }
});

// PUT update (body chỉ { meals, notes })
router.put('/:id', async (req, res, next) => {
  try { res.json(await UD.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
  catch(e){ next(e); }
});

// DELETE
router.delete('/:id', async (req, res, next) => {
  try { await UD.findByIdAndDelete(req.params.id); res.json({ success: true }); }
  catch(e){ next(e); }
});

module.exports = router;
