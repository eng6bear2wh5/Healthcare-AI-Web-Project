// app/models/BloodDonationEvent.js
const mongoose = require('mongoose');

const BloodDonationEventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  date: {
    type: String, 
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String, // Lưu URL hoặc chuỗi base64
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  address: { // Thêm trường address 
    type: String, 
    required: true,
  },
  addressLink: {
    type: String,
    required: true,
  },
}, {
  timestamps: true // Tự động thêm createdAt và updatedAt
});

module.exports = mongoose.model('BLOOD_DONATION_EVENT', BloodDonationEventSchema);