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

// GET /articles/latest-distinct
// Lấy 6 bài báo mới nhất, mỗi bài thuộc một bệnh khác nhau
router.get('/latest-distinct', async (req, res) => {
  try {
    const latestArticles = await Article.aggregate([
      // Sắp xếp TẤT CẢ bài báo theo ngày cập nhật giảm dần
      { $sort: { updatedAt: -1 } },

      // Gom nhóm theo disease_id và chỉ lấy bài báo ĐẦU TIÊN (tức là mới nhất) của mỗi nhóm
      {
        $group: {
          _id: '$disease_id', // Gom nhóm theo ID của bệnh
          latestArticle: { $first: '$$ROOT' } // $$ROOT tham chiếu đến toàn bộ document. $first lấy document đầu tiên trong nhóm đã sắp xếp.
        }
      },

      // Giới hạn kết quả chỉ lấy 6 nhóm (tức 6 bệnh khác nhau)
      { $limit: 6 },

      // Thay thế cấu trúc document gom nhóm bằng chính document bài báo
      { $replaceRoot: { newRoot: '$latestArticle' } },
      
      //  Sắp xếp lại 6 bài báo cuối cùng để đảm bảo bài mới nhất tuyệt đối vẫn nằm trên cùng
      { $sort: { updatedAt: -1 } }
    ]);

    res.set('Cache-Control', 'no-cache');
    res.json(latestArticles);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;


