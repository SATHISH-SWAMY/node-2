const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const Booking = require('../models/Booking');

// Create a new room
router.post('/', async (req, res) => {
  const { name, seats, amenities, pricePerHour } = req.body;
  const newRoom = new Room({ name, seats, amenities, pricePerHour });
  try {
    const savedRoom = await newRoom.save();
    res.status(201).json(savedRoom);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// List all rooms
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// List room details with bookings
router.get('/:roomId/bookings', async (req, res) => {
  const { roomId } = req.params;
  try {
    const room = await Room.findById(roomId);
    const bookings = await Booking.find({ roomId });
    res.json({ room, bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
