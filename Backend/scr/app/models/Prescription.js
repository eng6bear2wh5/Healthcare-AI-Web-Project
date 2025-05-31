// File: models/Prescription.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const MedicationSchema = new Schema({
  name:         { type: String, required: true },  // tên thuốc
  dosage:       { type: String, required: true },  // liều lượng
  instructions: { type: String, default: '' }      // cách sử dụng
}, { _id: false });

const PrescriptionSchema = new Schema({
  user_id:            { type: Schema.Types.ObjectId, ref: 'User', required: true },
  medical_history_id: { type: Schema.Types.ObjectId, ref: 'MedicalHistory', default: null },
  prescribed_date:    { type: Date, default: Date.now },
  meds:               { type: [MedicationSchema], default: [] }  // danh sách thuốc
}, { timestamps: true });

module.exports = mongoose.model('Prescription', PrescriptionSchema);
