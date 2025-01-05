'use client';

import { useRouter } from 'next/navigation';
import './homepage.css'; // Import the CSS file

export default function HomePage() {
  const router = useRouter();

  const handleBookTable = () => {
    router.push('https://vercel.com/vasundharaba24s-projects/table-booking/5nstZu8bpGpUKwCBzJYDyM9UWQ9q/book-table'); // Navigate to the book table page
  };

  return (
    <div className="container">
      {/* Overlay */}
      <div className="overlay"></div>

      {/* Content */}
      <div className="content">
        <h1>Welcome to Cafe De Paris</h1>
        <Link classname="button">Book Table</Link>

      </div>
    </div>
  );
}
