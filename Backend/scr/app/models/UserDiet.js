const mongoose = require('mongoose');
const { Schema } = mongoose;
const MealSchema = new Schema({ type: String, food_items: [String], total_calories: Number }, { _id: false });
const UserDietSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date:    { type: Date, required: true },
  meals:   [MealSchema],
  notes:   { type: String, default: '' }
}, { timestamps: true });
module.exports = mongoose.model('UserDiet', UserDietSchema);
