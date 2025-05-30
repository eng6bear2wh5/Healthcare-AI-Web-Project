const mongoose = require('mongoose');

const GroupDiseaseSchema = new mongoose.Schema({
  name_group: String,
  image_url: String,
});
// Nếu hay tìm theo name_group:
GroupDiseaseSchema.index({ name_group: 1 });

module.exports = mongoose.model('GROUP_DISEASES', GroupDiseaseSchema);
