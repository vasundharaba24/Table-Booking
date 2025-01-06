'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Correct use of `useRouter` from `next/navigation`
import './book-table.css';

export default function BookTablePage() {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    guests: '',
    email: '',
  });

  const [availableSlots, setAvailableSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const router = useRouter(); // useRouter for navigation after successful booking

  // Ensure this runs only on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch available slots when the date changes
  useEffect(() => {
    if (formData.date && isClient) {
      fetchAvailableSlots(formData.date);
    }
  }, [formData.date, isClient]);

  const fetchAvailableSlots = async (selectedDate) => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://table-booking-fty4j4kuz-vasundharaba24s-projects.vercel.app/availability?date=${selectedDate}`);
      if (!response.ok) {
        throw new Error('Error fetching availability');
      }
      const data = await response.json();

      // Assuming backend returns both available and reserved slots
      const reservedSlots = data.reserved || [];
      const available = data.slots.filter(slot => !reservedSlots.includes(slot));
      setAvailableSlots(available);
    } catch (error) {
      console.error('Error fetching slots:', error);
      alert('Failed to load available slots.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const requestVerificationCode = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address.');
      return;
    }
    try {
      const response = await fetch('https://table-booking-fty4j4kuz-vasundharaba24s-projects.vercel.app/send-verification-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      console.log('Verification code sent:', result.message);
      alert('Verification code sent to your email!');
    } catch (error) {
      console.error('Error sending verification code:', error.message);
      alert('Failed to send verification code.');
    }
  };

  const verifyCode = async () => {
    if (!verificationCode) {
      alert('Please enter the verification code.');
      return;
    }

    try {
      const response = await fetch('https://table-booking-fty4j4kuz-vasundharaba24s-projects.vercel.app/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          verificationCode,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Invalid verification code.');
      }

      alert('Email verified successfully!');
      setIsVerified(true); // Enable the booking process after verification
    } catch (error) {
      console.error('Error verifying code:', error);
      alert('Could not verify the code.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isVerified) {
      alert('Please verify your email before booking.');
      return;
    }

    try {
      const response = await fetch('https://table-booking-fty4j4kuz-vasundharaba24s-projects.vercel.app/book-table', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Slot not available. Please choose another.');
      }

      const data = await response.json();

      // Send confirmation email after successful booking
      await sendConfirmationEmail(formData.email, formData.date, formData.time);

      // Generate a toast for success
      alert(data.message || 'Table booked successfully! Confirmation email sent.');

      // Redirect to homepage on successful booking
      router.push('/');
    } catch (error) {
      console.error('Error booking table:', error);
      alert('Failed to book the table.');
    }
  };

  const sendConfirmationEmail = async (email, date, time) => {
    try {
      const response = await fetch('https://table-booking-fty4j4kuz-vasundharaba24s-projects.vercel.app/send-confirmation-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, date, time }),
      });

      const result = await response.json();
      console.log('Email sent successfully:', result);
    } catch (error) {
      console.error('Error sending confirmation email:', error.message); // Log detailed error message
    }
  };

  return (
    <div className="book-table-container">
      <div className="overlay"></div>
      <div className="book-table-content">
        <h1>Book a Table</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="input-field"
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="input-field"
          />
          {isLoading ? (
            <p>Loading available slots...</p>
          ) : (
            <select
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              className="input-field"
            >
              <option value="" disabled>
                Select a time slot
              </option>
              {availableSlots.length > 0 ? (
                availableSlots.map((slot, index) => (
                  <option key={index} value={slot}>
                    {slot}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No slots available
                </option>
              )}
            </select>
          )}
          <input
            type="number"
            name="guests"
            placeholder="Number of Guests"
            value={formData.guests}
            onChange={handleChange}
            required
            className="input-field"
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="input-field"
          />
          <button type="button" onClick={requestVerificationCode} className="submit-btn">
            Get Verification Code
          </button>
          <input
            type="text"
            placeholder="Enter Verification Code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
            className="input-field"
          />
          <button type="button" onClick={verifyCode} className="submit-btn">
            Verify Email
          </button>
          <button type="submit" className="submit-btn">
            Book Table
          </button>
        </form>
      </div>
    </div>
  );
}
