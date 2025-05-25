const mongoose = require('mongoose');

const drugSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    default: null
  },
  slug: {
    type: String,
    trim: true,
    default: null
  },
  url: {
    type: String,
    trim: true,
    default: null
  },
  form_and_dosage: {
    type: String,
    trim: true,
    default: null
  },
  drug_class_and_effect: {
    type: String,
    trim: true,
    default: null
  },
  indications: {
    type: String,
    trim: true,
    default: null
  },
  contraindications: {
    type: String,
    trim: true,
    default: null
  },
  precautions: {
    type: String,
    trim: true,
    default: null
  },
  side_effects: {
    type: String,
    trim: true,
    default: null
  },
  dosage_and_administration: {
    type: String,
    trim: true,
    default: null
  },
  usage_notes: {
    type: String,
    trim: true,
    default: null
  },
  references: {
    type: String,
    trim: true,
    default: null
  }
});

const Drug = mongoose.model('Drug', drugSchema, 'drugs'); 

module.exports = Drug;