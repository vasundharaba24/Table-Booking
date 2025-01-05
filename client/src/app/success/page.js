'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const name = searchParams.get('name');
  const date = searchParams.get('date');
  const time = searchParams.get('time');

  useEffect(() => {
    // Redirect to the homepage after 20 seconds
    const timer = setTimeout(() => {
      router.push('/');
    }, 10000); // 20 seconds

    // Cleanup the timer if the component unmounts before timeout
    return () => clearTimeout(timer);
  }, [router]);

  return (
  <Suspense fallback={<div>Loading...</div>}>
    
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Table Booking Successful!</h1>
      <p>Thank you, <strong>{name}</strong>, for booking a table with us!</p>
      <p>Your reservation is on <strong>{date}</strong> at <strong>{time}</strong>.</p>
      <p>You will be redirected to the homepage in 10 seconds...</p>
    </div>
  
</Suspense>
  );
}
