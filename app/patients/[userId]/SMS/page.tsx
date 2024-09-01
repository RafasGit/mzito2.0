 'use client'

import { useState } from 'react';
import useSmsSender from '@/lib/useSmsSender';
export default function Home() {
  const [isLoading, error, sendSMS] = useSmsSender({
    endpoint: 'https://api2.tiaraconnect.io/api/messaging/sendsms',
    apiKey: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI0MzciLCJvaWQiOjQzNywidWlkIjoiY2Y5YTVhMzQtZTY5Zi00ZWRhLWEzMDctODgxNGY3ZDk4Mjk1IiwiYXBpZCI6MzcyLCJpYXQiOjE3MjQ5MjM1NzUsImV4cCI6MjA2NDkyMzU3NX0.WvQhx_CxAAErh6VopJFuk59IHSDGTnIDUPFWAAMNkFcLCGSsjJX1aoLoZ23Ytw9IoQrJgVvmW1XGd5hw9mUtrw',
    to: '254111799290', // Replace with actual phone number
    message: 'Test SMS',
  });

  return (
    <div>
      <h1>SMS Sender</h1>
      <button onClick={() => sendSMS()} disabled={isLoading}>
        {isLoading ? 'Sending...' : 'Send SMS'}
      </button>
      {error && <p>Error: {error.message}</p>}
    </div>
  );
}
