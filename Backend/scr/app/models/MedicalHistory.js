const mongoose = require('mongoose');
const { Schema } = mongoose;

const MedicalHistorySchema = new Schema({
  user_id:        { type: Schema.Types.ObjectId, ref: 'User', required: true },
  disease_name:   { type: String, required: true },    
  diagnosis_date: { type: Date,   default: null },
  notes:          { type: String, default: '' },
  drugs:          { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model('MedicalHistory', MedicalHistorySchema);
