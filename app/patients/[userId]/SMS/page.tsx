'use client'
import React, { useState } from 'react';
import useSmsSender from '@/lib/useSmsSender';


const SmsSenderComponent: React.FC = () => {
  const [to, setTo] = useState('');
  const [message, setMessage] = useState('');
  const [from, setFrom] = useState('CONNECT'); // Optional, default value
  const [isLoading, error, sendSMS] = useSmsSender({ to, from, message });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await sendSMS();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Recipient Number" 
          value={to} 
          onChange={(e) => setTo(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          placeholder="Sender" 
          value={from} 
          onChange={(e) => setFrom(e.target.value)} 
        />
        <textarea 
          placeholder="Message" 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          required 
        />
        <button type="submit" disabled={isLoading}>Send SMS</button>
      </form>
      {error && <p>Error sending SMS: {error.message}</p>}
    </div>
  );
};

export default SmsSenderComponent;
