const mongoose = require('mongoose');

const GroupDiseaseSchema = new mongoose.Schema({
  name_group: String,
  image_url: String,
});

module.exports = mongoose.model('GROUP_DISEASES', GroupDiseaseSchema);
