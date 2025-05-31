const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true
  },
  password: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  googleId: {
    type: String,
  },
  avatar: {
    type: String,
  },
  provider: { 
    type: String, 
    enum: ['local', 'google'], 
    default: 'local' 
  },
  role: {
    type: String,
    enum: ['user', 'AI', 'admin'], 
    default: "user"
  },
  isVerified: {
    type: Boolean,
    default: false 
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);