'use client';

import { useRouter } from 'next/navigation';
import './homepage.css'; // Import the CSS file

export default function HomePage() {
  const router = useRouter();

  const handleBookTable = () => {
    router.push('https://table-booking-fty4j4kuz-vasundharaba24s-projects.vercel.app/book-table'); // Navigate to the book table page
  };

  return (
    <div className="container">
      {/* Overlay */}
      <div className="overlay"></div>

      {/* Content */}
      <div className="content">
        <h1>Welcome to Cafe De Paris</h1>
        <button onClick={handleBookTable} className="button">
          Book Table
        </button>
      </div>
    </div>
  );
}
