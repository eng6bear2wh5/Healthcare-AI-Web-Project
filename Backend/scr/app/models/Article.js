const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  article_name: String,
  article_link: String,
  disease_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'DISEASES',
    required: true
  },
}, {
    timestamps: true 
});

// Index để hỗ trợ tìm theo disease_id
ArticleSchema.index({ disease_id: 1 });
// Compound index nếu sort/list theo createdAt
ArticleSchema.index({ disease_id: 1, createdAt: -1 });

module.exports = mongoose.model('ARTICLES', ArticleSchema);
