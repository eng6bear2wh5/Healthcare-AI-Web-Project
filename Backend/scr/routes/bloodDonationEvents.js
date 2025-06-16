// routes/bloodDonationEvents.js
const express = require('express');
const router = express.Router();
const BloodDonationEvent = require('../app/models/BloodDonationEvent');

// GET /api/blood-donation-events: Lấy tất cả các sự kiện hiến máu
router.get('/', async (req, res) => {
  try {
    // Sắp xếp theo ngày tạo giảm dần để sự kiện mới nhất lên đầu
    const events = await BloodDonationEvent.find().sort({ createdAt: -1 });
    res.set('Cache-Control', 'no-cache');
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Không thể lấy dữ liệu sự kiện: ' + err.message });
  }
});

// (Tùy chọn) 
// POST: Tạo sự kiện mới
router.post('/', async (req, res) => {
  try {
    const newEvent = new BloodDonationEvent(req.body);
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch(err) {
    res.status(400).json({ error: 'Tạo sự kiện thất bại: ' + err.message });
  }
});

module.exports = router;