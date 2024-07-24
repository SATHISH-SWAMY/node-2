const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: String,
  seats: Number,
  amenities: [String],
  pricePerHour: Number,
});

module.exports = mongoose.model('Room', roomSchema);
