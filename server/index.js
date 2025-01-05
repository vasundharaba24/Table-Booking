const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory data storage for bookings
let bookings = {};

// Mock available time slots for each day
const availableTimeSlots = [
  '12:00 PM',
  '12:30 PM',
  '1:00 PM',
  '1:30 PM',
  '2:00 PM',
  '7:00 PM',
  '7:30 PM',
  '8:00 PM',
  '8:30 PM',
  '9:00 PM',
];

// Function to get available time slots for a specific date
const getAvailableSlotsForDate = (date) => {
  const bookedSlots = getBookedSlotsForDate(date);
  return availableTimeSlots.filter((slot) => !bookedSlots.includes(slot));
};

// Function to get the booked slots for a specific date
const getBookedSlotsForDate = (date) => {
  if (!bookings[date]) return [];
  return bookings[date].map((booking) => booking.time);
};

// Route to check availability for a given date
app.get('/api/availability', (req, res) => {
  const { date } = req.query;
  
  if (!date) {
    return res.status(400).json({ message: 'Date is required.' });
  }

  const availableSlots = getAvailableSlotsForDate(date);

  if (availableSlots.length === 0) {
    return res.status(404).json({ message: 'No available slots for this date.' });
  }

  return res.status(200).json({ slots: availableSlots });
});

// Route to book a table for a specific date and time
app.post('/api/book-table', (req, res) => {
  const { name, date, time, guests } = req.body;

  if (!name || !date || !time || !guests) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const bookedSlots = getBookedSlotsForDate(date);
  if (bookedSlots.includes(time)) {
    return res.status(400).json({ message: 'This time slot is already booked.' });
  }

  // Add booking to in-memory storage
  if (!bookings[date]) {
    bookings[date] = [];
  }
  bookings[date].push({ name, date, time, guests });

  // Respond back with success message
  return res.status(200).json({ message: 'Table booked successfully!' });
});

// Route to display the success message and redirect after booking
app.get('/success', (req, res) => {
  const { name, date, time, guests } = req.query;
  if (!name || !date || !time || !guests) {
    return res.status(400).json({ message: 'Missing required information.' });
  }

  // Display the booking confirmation message
  const bookingConfirmation = {
    name,
    date,
    time,
    guests,
    message: 'Table successfully booked for ${name} at ${time} on ${date} for ${guests} guests'
  };

  res.status(200).json(bookingConfirmation);
});

// Start the server
app.listen(PORT, () => {
  console.log('Server is running on port ${PORT}');
});