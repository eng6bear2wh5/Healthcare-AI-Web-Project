const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  article_name: String,
  article_link: String,
  disease_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'DISEASES',
    required: true
  },
});

module.exports = mongoose.model('ARTICLES', ArticleSchema);
