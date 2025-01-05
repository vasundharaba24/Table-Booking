'use client';

import { useRouter } from 'next/navigation';
import './homepage.css';

export default function HomePage() {
  const router = useRouter();

  const handleBookTable = () => {
    window.location.href = '/book-table'; // Redirect to backend URL
  };

  return (
    <div className="container">
      <div className="overlay"></div>
      <div className="content">
        <h1>Welcome to Cafe De Paris</h1>
        <button onClick={handleBookTable} className="button">
          Book Table
        </button>
      </div>
    </div>
  );
}
