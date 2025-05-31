const mongoose = require('mongoose');
const { Schema } = mongoose;
const PersonalTrackerSchema = new Schema({
  user_id:            { type: Schema.Types.ObjectId, ref: 'User', required: true },
  scheduled_notify:   { type: String, default: null },
  medical_history_id: { type: Schema.Types.ObjectId, ref: 'MedicalHistory', default: null },
  prescription_id:    { type: Schema.Types.ObjectId, ref: 'Prescription', default: null },
  user_diet_id:       { type: Schema.Types.ObjectId, ref: 'UserDiet', default: null },
  health_metrics_id:  { type: Schema.Types.ObjectId, ref: 'HealthMetric', default: null }
}, { timestamps: true });
module.exports = mongoose.model('PersonalTracker', PersonalTrackerSchema);