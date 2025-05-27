const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  adminName: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
});
module.exports = mongoose.model('ADMINS', AdminSchema);