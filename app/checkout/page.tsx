"use client"

import { useState } from 'react';
import axios from 'axios';

function MyComponent() {
  const [data, setData] = useState(null);

  const handleSubmit = async () => {
    try {
      console.log('hi')
      const apikey = process.env.NEXT_PUBLIC_API_KEY!;
      console.log(apikey)
      const headers = {
        'Authorization': `Bearer ${apikey}`,
        'Content-Type': 'application/json',
      };

      const response = await axios.post('https://api.chpter.co/v1/initiate/mpesa-payment', {
        // ... your existing request data ...
        customer_details: {
   "full_name": "Josh Rafa",
    "location": "Nairobi",
    "phone_number": "254111799290",
   
  },
    
  products: [
    {
      "product_name": "HoodEez",
      "quantity": 1,
      "unit_price": 1,
      "digital_link": "https://example.com/link"

    }
  ],
  amount: {
    "currency": "KES",
    "delivery_fee": 0.00,
    "discount_fee": 0.00,
    "total": 1.00
  },
  callback_details: {
    "notify_customer": true,
    "transaction_reference": "1234",
    "callback_url": "https://eozdpom307nca3.m.pipedream.net"
  }
      }, {
        headers,
      });

      // Handle the response
      setData(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      {/* Your component JSX */}
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default MyComponent;