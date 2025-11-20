const mongoose = require('mongoose');

const pickupSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    coordinates: {
      lat: { type: Number, required: false },
      lng: { type: Number, required: false },
    },
  },
  wasteType: {
    type: String,
    enum: ['plastic', 'paper', 'glass', 'metal', 'organic', 'electronic', 'other'],
    required: true,
  },
  quantity: {
    type: String,
    enum: ['small', 'medium', 'large'],
    required: true,
  },
  description: String,
  images: [String],
  status: {
    type: String,
    enum: ['pending', 'assigned', 'in-progress', 'completed', 'cancelled'],
    default: 'pending',
  },
  assignedCollector: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  scheduledDate: {
    type: Date,
    required: true,
  },
  completedDate: Date,
  estimatedDuration: Number, // in minutes
  actualDuration: Number, // in minutes
  rating: {
    score: { type: Number, min: 1, max: 5 },
    comment: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Pickup', pickupSchema);
