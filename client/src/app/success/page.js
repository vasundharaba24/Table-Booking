import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SuccessPage({ name, date, time }) {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the homepage after 10 seconds
    const timer = setTimeout(() => {
      router.push('/');
    }, 10000); // 10 seconds

    // Cleanup the timer if the component unmounts before timeout
    return () => clearTimeout(timer);
  }, [router]);

  if (!name || !date || !time) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h1>Loading...</h1>
        <p>We couldn't retrieve the reservation details. Please try again later.</p>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Table Booking Successful!</h1>
      <p>Thank you, <strong>{name}</strong>, for booking a table with us!</p>
      <p>Your reservation is on <strong>{date}</strong> at <strong>{time}</strong>.</p>
      <p>You will be redirected to the homepage in 10 seconds...</p>
    </div>
  );
}

// Server-side function to fetch query parameters
export async function getServerSideProps(context) {
  const { query } = context;
  const { name, date, time } = query;

  return {
    props: {
      name: name || null,
      date: date || null,
      time: time || null
    }
  };
}
