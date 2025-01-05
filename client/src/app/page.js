'use client';

import { useRouter } from 'next/navigation';
import './homepage.css'; // Import the CSS file

export default function HomePage() {
  const router = useRouter();

  const handleBookTable = () => {
    router.push('/book-table'); // Navigate to the book table page
  };

  return (
    <div className="container">
      {/* Overlay */}
      <div className="overlay"></div>

      {/* Content */}
      <div className="content">
        <h1>Welcome to Cafe De Paris</h1>
        <Link href="/book-table" classname="button">Book Table</Link>

      </div>
    </div>
  );
}
