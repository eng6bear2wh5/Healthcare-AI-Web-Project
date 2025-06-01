// routes/articles.js
const express = require('express');
const router = express.Router();
const Article = require('../app/models/Article');

// Tạo bài báo cho bệnh (Admin dùng)
router.post('/createForDisease', async (req, res) => {
  try {
    const { article_name, article_link, disease_id } = req.body;
    const article = await Article.create({ article_name, article_link, disease_id });
    res.status(201).json({
      message: 'Bài báo được tạo thành công',
      article_id: article._id
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /articles
router.get('/', async (req, res) => {
  try {
    const articles = await Article.find().select('article_name article_link disease_id');
    // Luôn revalidate với server, nhưng nếu chưa đổi thì chỉ 304
    res.set('Cache-Control', 'no-cache');
    res.json(articles);
    // Cache client 5 phút, và Express sẽ tự generate ETag
    // res
    //   .set('Cache-Control', 'public, max-age=3600') //giây
    //   .status(200)
    //   .json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /articles/by-disease/:disease_id
router.get('/by-disease/:disease_id', async (req, res) => {
  try {
    const articles = await Article.find({ disease_id: req.params.disease_id }).select('article_name article_link');
    // Luôn revalidate với server, nhưng nếu chưa đổi thì chỉ 304
    res.set('Cache-Control', 'no-cache');
    res.json(articles);
    // res
    //   .set('Cache-Control', 'public, max-age=3600') //giây
    //   .status(200)
    //   .json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Xóa tất cả bài báo của một bệnh (Admin dùng khi cập nhật)
router.delete('/by-disease/:disease_id', async (req, res) => {
  try {
    await Article.deleteMany({ disease_id: req.params.disease_id });
    res.json({ message: 'Các bài báo liên quan đã được xóa thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
