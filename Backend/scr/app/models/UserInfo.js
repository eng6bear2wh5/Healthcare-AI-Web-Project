const mongoose = require('mongoose');
const schema = mongoose.Schema;
const UserInfoSchema = new schema({
  user_id: { type: schema.Types.ObjectId, ref: 'User', required: true },
  birth_date: { type: Date, required: true },
  height: { type: Number, required: true }, // in cm
  weight: { type: Number, required: true }, // in kg
  sex: { type: String, enum: ['male', 'female', 'other'], required: true },
  diet_type:      { type: String, default: '' },
  activity_level: { type: String, default: '' },
  daily_routine:  { type: String, default: '' },
  blood_type: { type: String, enum: ['A', 'B', 'AB', 'O','A-', 'B-', 'AB-', 'O-','other'], required: true },
}, { timestamps: true });

module.exports = mongoose.model('UserInfo', UserInfoSchema);