const express = require('express');
const router = express.Router();
const Article = require('../app/models/Article');

// Tạo bài báo cho bệnh (Admin dùng)
// routes/articles.js
router.post('/createForDisease', async (req, res) => {
  try {
    // Nhận đúng tên như client đang gửi
    const { article_name, article_link, disease_id } = req.body;

    // Tạo bài báo
    const article = await Article.create({
      article_name,
      article_link,
      disease_id
    });

    res.status(201).json({
      message: 'Bài báo được tạo thành công',
      article_id: article._id
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const articles = await Article.find();
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/by-disease/:disease_id', async (req, res) => {
  try {
    const articles = await Article.find({ disease_id: req.params.disease_id });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Xóa tất cả bài báo của một bệnh (dùng khi cập nhật)
router.delete('/by-disease/:disease_id', async (req, res) => {
  try {
    await Article.deleteMany({ disease_id: req.params.disease_id });
    res.json({ message: 'Các bài báo liên quan đã được xóa thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
