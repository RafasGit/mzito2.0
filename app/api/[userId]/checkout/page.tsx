"use client"

import { useState } from 'react';
import axios from 'axios';
import { getAppointment } from '@/lib/actions/appointment.actions';
import { NextRequest, NextResponse } from 'next/server';


export function MyComponent({ searchParams, params: { userId } }: SearchParamProps) {
  const [data, setData] = useState(null);

   const appoind= getAppointment(userId)
      console.log(appoind)

  const handleSubmit = async () => {
    try {

     
      
      const api_key = process.env.NEXT_PUBLIC_API_KEY!; // Replace with your actual API key
    
      const requestBody = {
        customer_details: {
          full_name: "Josh Rafa",
          location: "Nairobi",
          phone_number: "254111799290",
          email: "josh@chpter.co"
        },
        products: [
          {
            product_name: "HoodEez",
            quantity: 1,
            unit_price: 1,
            digital_link: ""
          }
        ],
        amount: {
          currency: "KES",
          delivery_fee: 0.00,
          discount_fee: 0.00,
          total: 1.00
        },
        callback_details: {
          transaction_reference: "1234",
          callback_url: "https://eozdpom307nca3.m.pipedream.net"
        }
      };
  
      const authHeader = {
        'Api-Key': api_key
      };
  
      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.chpter.co/v1/initiate/mpesa-payment',
        headers: authHeader,
        data: requestBody
      };
  
      const response = await axios(config);
  
      // Handle the response
      setData(response.data);
      }
      
      // Handle the errors
     catch (error) {
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