const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const roomRoutes = require('./routes/rooms');
const bookingRoutes = require('./routes/bookings');

const app = express();
const PORT = process.env.PORT || 3030;

app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/hallBooking', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
