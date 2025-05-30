// routes/groupDiseases.js
const express = require('express');
const router = express.Router();
const GroupDisease = require('../app/models/GroupDisease');

// Lấy danh sách tất cả nhóm bệnh
router.get('/', async (req, res) => {
  try {
    const groups = await GroupDisease.find().select('name_group image_url');
    // Luôn revalidate với server, nhưng nếu chưa đổi thì chỉ 304
    // res.set('Cache-Control', 'no-cache');
    // res.json(groups);
    res
      .set('Cache-Control', 'public, max-age=3600') //giây
      .status(200)
      .json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Lấy thông tin nhóm bệnh theo id (cho mục chỉnh sửa)
router.get('/:id', async (req, res) => {
  try {
    const group = await GroupDisease.findById(req.params.id);
    if (!group) return res.status(404).json({ error: 'Không tìm thấy nhóm bệnh' });
    // ở route detail thường bỏ cache hoặc cache ngắn:
    // res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    // res.json(group);
    res
      .set('Cache-Control', 'public, max-age=3600') //giây
      .status(200)
      .json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Thêm nhóm bệnh mới
router.post('/', async (req, res) => {
  try {
    const { name_group, image_url } = req.body;
    const newGroup = new GroupDisease({ name_group, image_url });
    await newGroup.save();
    res.status(201).json({ message: 'Nhóm bệnh đã được thêm', group: newGroup });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cập nhật nhóm bệnh (chỉnh sửa)
router.put('/:id', async (req, res) => {
  try {
    await GroupDisease.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: 'Nhóm bệnh đã được cập nhật thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Xóa nhóm bệnh
router.delete('/:id', async (req, res) => {
  try {
    await GroupDisease.findByIdAndDelete(req.params.id);
    res.json({ message: 'Nhóm bệnh đã được xóa thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;