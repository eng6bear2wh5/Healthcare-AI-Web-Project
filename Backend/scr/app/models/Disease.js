const mongoose = require('mongoose');

const DiseaseSchema = new mongoose.Schema({
  name_diseases: String,
  description_disease: String,
  details: String,
  image_url: String,
  // Tham chiếu đến collection GROUP_DISEASES (MongoDB sử dụng _id)
  group_diseases: { type: mongoose.Schema.Types.ObjectId, ref: 'GROUP_DISEASES' },
});
// Index để tìm nhanh theo tên bệnh
DiseaseSchema.index({ name_diseases: 1 });
// Index để filter theo group
DiseaseSchema.index({ group_diseases: 1 });

module.exports = mongoose.model('DISEASES', DiseaseSchema);
