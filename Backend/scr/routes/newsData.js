const express = require('express');
const router = express.Router();
const GroupDisease = require('../app/models/GroupDisease');
const Disease = require('../app/models/Disease');
const Article = require('../app/models/Article');

// API tổng hợp dữ liệu cho trang News
router.get('/news-data', async (req, res) => {
  try {
    const [groups, diseases, articles] = await Promise.all([
      GroupDisease.find().select('name_group _id image_url'),
      Disease.find().select('name_diseases group_diseases _id image_url'),
      Article.find().select('article_name article_link disease_id')
    ]);
    res.set('Cache-Control', 'public, max-age=600');
    res.json({ groups, diseases, articles });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;