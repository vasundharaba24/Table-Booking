'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './book-table.css';

export default function BookTablePage() {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    guests: '',
  });

  const [availableSlots, setAvailableSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

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
      const response = await fetch(`http://localhost:4000/api/availability?date=${selectedDate}`);
      if (!response.ok) {
        throw new Error('Error fetching availability');
      }

      const data = await response.json();
      setAvailableSlots(data.slots || []); // Default to an empty array if `slots` is undefined
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/api/book-table', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        router.push(
          `/success?name=${encodeURIComponent(formData.name)}&date=${encodeURIComponent(formData.date)}&time=${encodeURIComponent(formData.time)}`
        );
      } else {
        alert(data.message || 'Slot not available. Please choose another.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to book the table.');
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
          <button type="submit" className="submit-btn">
            Book Table
          </button>
        </form>
      </div>
    </div>
  );
}