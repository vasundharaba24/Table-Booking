'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // State to check if search parameters are ready
  const [isParamsReady, setIsParamsReady] = useState(false);
  
  const name = searchParams.get('name');
  const date = searchParams.get('date');
  const time = searchParams.get('time');

  // Ensure search parameters are available before rendering
  useEffect(() => {
    if (name && date && time) {
      setIsParamsReady(true);
    }
  }, [name, date, time]);

  useEffect(() => {
    // Redirect to the homepage after 10 seconds once the parameters are available
    if (isParamsReady) {
      const timer = setTimeout(() => {
        router.push('/');
      }, 10000); // 10 seconds

      // Cleanup the timer if the component unmounts before timeout
      return () => clearTimeout(timer);
    }
  }, [isParamsReady, router]);

  if (!isParamsReady) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h1>Loading...</h1>
        <p>Please wait while we prepare your reservation details...</p>
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
