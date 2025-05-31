const express = require('express');
const router  = express.Router();
const HM      = require('../app/models/HealthMetric');

// GET all
router.get('/', async (req, res, next) => {
  try { res.json(await HM.find()); } catch(e){ next(e); }
});

// GET single
router.get('/:id', async (req, res, next) => {
  try { res.json(await HM.findById(req.params.id)); } catch(e){ next(e); }
});

// GET by user
router.get('/user/:userId', async (req, res, next) => {
  try { res.json(await HM.find({ user_id: req.params.userId })); } catch(e){ next(e); }
});

// POST new (body { user_id, date, bmi, weight, blood_pressure, heart_rate, … })
router.post('/', async (req, res, next) => {
  try { res.status(201).json(await HM.create(req.body)); } catch(e){ next(e); }
});

// PUT update (body chỉ các số liệu, không user_id/date)
router.put('/:id', async (req, res, next) => {
  try { res.json(await HM.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
  catch(e){ next(e); }
});

// DELETE
router.delete('/:id', async (req, res, next) => {
  try { await HM.findByIdAndDelete(req.params.id); res.json({ success: true }); }
  catch(e){ next(e); }
});

module.exports = router;
