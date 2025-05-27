const mongoose = require('mongoose');

const DiseaseSchema = new mongoose.Schema({
  name_diseases: String,
  description_disease: String,
  details: String,
  image_url: String,
  // Tham chiếu đến collection GROUP_DISEASES (MongoDB sử dụng _id, bạn có thể lưu như thế này)
  group_diseases: { type: mongoose.Schema.Types.ObjectId, ref: 'GROUP_DISEASES' },
});

module.exports = mongoose.model('DISEASES', DiseaseSchema);
