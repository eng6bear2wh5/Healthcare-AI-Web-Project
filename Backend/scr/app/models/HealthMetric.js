const mongoose = require('mongoose');
const { Schema } = mongoose;
const BloodPressureSchema = new Schema({ systolic: Number, diastolic: Number }, { _id: false });
const LiverEnzymesSchema  = new Schema({ sgpt: Number, sgot: Number }, { _id: false });
const HealthMetricSchema = new Schema({
  user_id:         { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date:            { type: Date, required: true },
  bmi:             Number,
  cholesterol_ldl: Number,
  cholesterol_hdl: Number,
  blood_pressure:  BloodPressureSchema,
  heart_rate:      Number,
  blood_glucose:   Number,
  urine:           String,
  liver_enzymes:   LiverEnzymesSchema
}, { timestamps: true });
module.exports = mongoose.model('HealthMetric', HealthMetricSchema);