const mongoose = require('mongoose');
const { Schema } = mongoose;

const BloodPressureSchema = new Schema({
  systolic: Number,
  diastolic: Number,
}, { _id: false });

const CholesterolSchema = new Schema({
  ldl: Number,
  hdl: Number,
}, { _id: false });

const LiverEnzymesSchema = new Schema({
  sgpt: Number,
  sgot: Number,
}, { _id: false });

const KidneyIndexSchema = new Schema({
  creatinine: Number,
  eGFR: Number,
}, { _id: false });

const WeeklyHealthDataSchema = new Schema({
  week: { type: Number, required: true },
  bmi: Number,
  blood_pressure: BloodPressureSchema,
  heart_rate: Number,
  blood_glucose: Number,
  body_fat: Number,
  cholesterol: CholesterolSchema,
  liver_enzymes: LiverEnzymesSchema,
  kidney_index: KidneyIndexSchema,
}, { _id: false });

const HealthMetricSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  weekly_data: [WeeklyHealthDataSchema],
}, { timestamps: true });

module.exports = mongoose.model('HealthMetric', HealthMetricSchema);
