// app/layout.js
import './globals.css';

export const metadata = {
  title: 'Restaurant Booking',
  description: 'Book your table online!',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
