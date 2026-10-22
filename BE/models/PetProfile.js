const mongoose = require('mongoose');

const petProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Dog', 'Cat', 'Bird', 'Other']
  },
  breed: {
    type: String,
  },
  age: {
    type: Number,
  },
  weight: {
    type: Number,
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('PetProfile', petProfileSchema);
