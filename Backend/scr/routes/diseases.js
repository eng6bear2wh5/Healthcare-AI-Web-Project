// routes/diseases.js
const express = require('express');
const router = express.Router();
const Disease = require('../app/models/Disease');
const Article = require('../app/models/Article');

// Lấy danh sách tất cả bệnh
router.get('/', async (req, res) => {
  try {
    const diseases = await Disease.find().select('name_diseases image_url _id group_diseases');
    // res.set('Cache-Control', 'public, max-age=10');
    // Luôn revalidate với server, nhưng nếu chưa đổi thì chỉ 304
    res.set('Cache-Control', 'no-cache');
    res.json(diseases);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Lấy thông tin bệnh theo tên (bao gồm bài báo liên quan)
router.get('/byName/:name', async (req, res) => {
  try {
    const disease = await Disease.findOne({ name_diseases: req.params.name });
     // Luôn revalidate với server, nhưng nếu chưa đổi thì chỉ 304
    res.set('Cache-Control', 'no-cache');
    if (!disease) return res.status(404).json({ error: 'Không tìm thấy bệnh' });
    const articles = await Article.find({ disease_id: disease._id });
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.json({ ...disease.toObject(), ARTICLES: articles });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Lấy thông tin bệnh theo ID (cho mục chỉnh sửa)
router.get('/id/:id', async (req, res) => {
  try {
    const disease = await Disease.findById(req.params.id).select('name_diseases image_url description_disease details');
     // Luôn revalidate với server, nhưng nếu chưa đổi thì chỉ 304
    res.set('Cache-Control', 'no-cache');
    if (!disease) return res.status(404).json({ error: 'Không tìm thấy bệnh' });
    const articles = await Article.find({ disease_id: disease._id });
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.json({ ...disease.toObject(), ARTICLES: articles });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Tạo mới bệnh (bao gồm nhóm bệnh)
router.post('/', async (req, res) => {
  try {
    const disease = await Disease.create(req.body);
    res.status(201).json({ message: 'Bệnh đã được thêm', diseaseId: disease._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cập nhật (chỉnh sửa) bệnh đã có (bao gồm nhóm bệnh)
router.put('/:id', async (req, res) => {
  try {
    await Disease.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: 'Bệnh đã được cập nhật thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Xóa bệnh
router.delete('/:id', async (req, res) => {
  try {
    await Disease.findByIdAndDelete(req.params.id);
    res.json({ message: 'Bệnh đã được xóa thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
