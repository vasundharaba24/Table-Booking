const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory data storage
let bookings = {};
let verificationCodes = {}; // Store verification codes mapped to emails
let emailVerified = {}; // Store email verification status

// Mock available time slots
const availableTimeSlots = [
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
  '2:00 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM',
];

// Nodemailer transporter configuration with App Password
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  logger: true,  // Enable nodemailer logging
  debug: true,  // Detailed logging
});

// Get available slots for a specific date
const getAvailableSlotsForDate = (date) => {
  const bookedSlots = getBookedSlotsForDate(date);
  return availableTimeSlots.filter((slot) => !bookedSlots.includes(slot));
};

// Get booked slots for a specific date
const getBookedSlotsForDate = (date) => {
  if (!bookings[date]) return [];
  return bookings[date].map((booking) => booking.time);
};

// Route to fetch availability
app.get('/api/availability', (req, res) => {
  const { date } = req.query;
  if (!date) {
    return res.status(400).json({ message: 'Date is required.' });
  }

  const availableSlots = getAvailableSlotsForDate(date);
  if (availableSlots.length === 0) {
    return res.status(404).json({ message: 'No available slots for this date.' });
  }

  res.status(200).json({ slots: availableSlots });
});

// Route to send verification code
app.post('/api/send-verification-code', async (req, res) => {
  const { email } = req.body;

  if (!email || !/^[\w.%+-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    return res.status(400).json({ message: 'Invalid email address. Please provide a valid email.' });
  }

  // Generate 6-digit verification code
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  verificationCodes[email] = verificationCode;

  // Send email with the verification code
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your Verification Code',
    text: `Your verification code is: ${verificationCode}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Verification code sent to your email.' });
  } catch (error) {
    console.error('Error sending verification email:', error);
    res.status(500).json({ message: 'Failed to send verification code.' });
  }
});

// Route to verify the email code
app.post('/api/verify-code', (req, res) => {
  const { email, verificationCode } = req.body;

  if (!email || !verificationCode) {
    return res.status(400).json({ message: 'Both email and verification code are required.' });
  }

  // Check if the verification code matches
  if (verificationCodes[email] === verificationCode) {
    emailVerified[email] = true; // Mark email as verified
    delete verificationCodes[email]; // Remove the verification code
    return res.status(200).json({ message: 'Email verified successfully.' });
  }

  res.status(400).json({ message: 'Invalid verification code.' });
});

// Route to book a table
app.post('/api/book-table', async (req, res) => {
  const { name, date, time, guests, email } = req.body;

  if (!name || !date || !time || !guests || !email) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // Check email format
  if (!/^[\w.%+-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    return res.status(400).json({ message: 'Invalid email address. Please provide a valid email.' });
  }

  // Verify the email before booking the table
  if (!emailVerified[email]) {
    return res.status(400).json({ message: 'Email not verified. Please verify your email first.' });
  }

  // Check if the time slot is available for the specified date
  const bookedSlots = getBookedSlotsForDate(date);
  if (bookedSlots.includes(time)) {
    return res.status(400).json({ message: 'This time slot is already booked.' });
  }

  // Save the booking
  if (!bookings[date]) {
    bookings[date] = [];
  }
  bookings[date].push({ name, date, time, guests, email });

  // Send a booking confirmation email
  const confirmationMailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Booking Confirmation',
    text: `Dear ${name},\n\nYour table has been successfully booked!\n\nDetails:\nName: ${name}\nDate: ${date}\nTime: ${time}\nGuests: ${guests}\n\nThank you for booking with us!\n\nBest Regards,\nRestaurant Team`,
  };

  try {
    // Send the email and wait until it's successful
    await transporter.sendMail(confirmationMailOptions);
    // Only return success after email is successfully sent
    res.status(200).json({ message: 'Table booked successfully! A confirmation email has been sent.' });
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    // Return an error response if email sending fails
    res.status(500).json({ message: 'Booking confirmed, but failed to send the confirmation email. Please try again later.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
