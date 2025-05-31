const express = require('express');
const router  = express.Router();
const MH      = require('../app/models/MedicalHistory');

// GET all (admin)
router.get('/', async (req, res, next) => {
  try {
    res.json(await MH.find());
  } catch(e){ next(e); }
});

// GET by ID (admin)
router.get('/:id', async (req, res, next) => {
  try {
    res.json(await MH.findById(req.params.id));
  } catch(e){ next(e); }
});

// GET by user
router.get('/user/:userId', async (req, res, next) => {
  try {
    res.json(await MH.find({ user_id: req.params.userId }));
  } catch(e){ next(e); }
});

// POST new entry (Test/Prod JS sẽ pass đúng user_id nội bộ, không qua form)
router.post('/', async (req, res, next) => {
  try {
    // req.body: { user_id, disease_name, diagnosis_date, notes }
    res.status(201).json(await MH.create(req.body));
  } catch(e){ next(e); }
});

// PUT update
router.put('/:id', async (req, res, next) => {
  try {
    // req.body chỉ chứa { disease_name, diagnosis_date, notes } – KHÔNG user_id
    res.json(await MH.findByIdAndUpdate(req.params.id, req.body, { new: true }));
  } catch(e){ next(e); }
});

// DELETE
router.delete('/:id', async (req, res, next) => {
  try {
    await MH.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch(e){ next(e); }
});

module.exports = router;
