const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// Book a room
router.post('/', async (req, res) => {
  const { customerName, date, startTime, endTime, roomId } = req.body;
  const newBooking = new Booking({ customerName, date, startTime, endTime, roomId });
  try {
    // Check if room is already booked
    const bookings = await Booking.find({ roomId, date });
    const isBooked = bookings.some(booking => {
      return (
        (startTime >= booking.startTime && startTime < booking.endTime) ||
        (endTime > booking.startTime && endTime <= booking.endTime)
      );
    });

    if (isBooked) {
      return res.status(400).json({ message: 'Room is already booked for the selected time slot.' });
    }

    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// List all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('roomId');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// List all customers with booked data
router.get('/customers', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('roomId');
    const customers = bookings.map(booking => ({
      customerName: booking.customerName,
      roomName: booking.roomId.name,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime
    }));
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// List booking frequency per customer
router.get('/frequency', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('roomId');
    const frequency = bookings.reduce((acc, booking) => {
      if (!acc[booking.customerName]) {
        acc[booking.customerName] = [];
      }
      acc[booking.customerName].push({
        roomName: booking.roomId.name,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
        bookingId: booking._id,
        bookingDate: booking.date,
        bookingStatus: 'Booked'
      });
      return acc;
    }, {});

    res.json(frequency);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
