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
    
    const articles = await Article.find()
      .sort({ updatedAt: -1, createdAt: -1 }) 
      .select('article_name article_link disease_id updatedAt createdAt'); 
    res.set('Cache-Control', 'no-cache');
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /articles/by-title/:title
router.get('/by-title/:title', async (req, res) => {
  try {
    const article = await Article.findOne({ article_name: req.params.title }).select('article_name article_link disease_id updatedAt');
    if (!article) {
      return res.status(404).json({ error: 'Không tìm thấy bài báo với title đã cung cấp.' });
    }
    res.json(article);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /articles/by-disease/:disease_id
router.get('/by-disease/:disease_id', async (req, res) => {
  try {
    const articles = await Article.find({ disease_id: req.params.disease_id }).select('article_name article_link updatedAt');
    res.set('Cache-Control', 'no-cache');
    res.json(articles);
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

// GET /articles/latest-distinct
// Lấy 6 bài báo mới nhất, mỗi bài thuộc một bệnh khác nhau
router.get('/latest-distinct', async (req, res) => {
  try {
    const latestArticles = await Article.aggregate([
      { $sort: { updatedAt: -1 } },
      {
        $group: {
          _id: '$disease_id', // Gom nhóm theo ID của bệnh
          latestArticle: { $first: '$$ROOT' } 
        }
      },
      { $limit: 6 },
      { $replaceRoot: { newRoot: '$latestArticle' } },
      { $sort: { updatedAt: -1 } }
    ]);

    res.set('Cache-Control', 'no-cache');
    res.json(latestArticles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;


