const express = require('express');
const router  = express.Router();
const P       = require('../app/models/Prescription');

// GET all
router.get('/', async (req, res, next) => {
  try { res.json(await P.find()); } catch(e){ next(e); }
});

// GET by ID
router.get('/:id', async (req, res, next) => {
  try { res.json(await P.findById(req.params.id)); } catch(e){ next(e); }
});

// GET by user
router.get('/user/:userId', async (req, res, next) => {
  try { res.json(await P.find({ user_id: req.params.userId })); } catch(e){ next(e); }
});

// POST (body chỉ có { user_id, medical_history_id, prescribed_date, notes })
router.post('/', async (req, res, next) => {
  try { res.status(201).json(await P.create(req.body)); } catch(e){ next(e); }
});

// PUT (body chỉ có { prescribed_date, notes })
router.put('/:id', async (req, res, next) => {
  try { res.json(await P.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
  catch(e){ next(e); }
});

// DELETE
router.delete('/:id', async (req, res, next) => {
  try { await P.findByIdAndDelete(req.params.id); res.json({ success: true }); }
  catch(e){ next(e); }
});

module.exports = router;
