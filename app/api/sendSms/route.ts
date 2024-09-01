import { NextRequest, NextResponse } from 'next/server';

interface SmsRequest {
  to: string;
  from?: string;
  message: string;
}

const API_KEY = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI0MzciLCJvaWQiOjQzNywidWlkIjoiY2Y5YTVhMzQtZTY5Zi00ZWRhLWEzMDctODgxNGY3ZDk4Mjk1IiwiYXBpZCI6MzcyLCJpYXQiOjE3MjQ5MjM1NzUsImV4cCI6MjA2NDkyMzU3NX0.WvQhx_CxAAErh6VopJFuk59IHSDGTnIDUPFWAAMNkFcLCGSsjJX1aoLoZ23Ytw9IoQrJgVvmW1XGd5hw9mUtrw'
const API_ENDPOINT = 'https://api2.tiaraconnect.io/api/messaging/sendsms'; // Replace with your actual API endpoint


export async function POST(req: NextRequest) {
  try {
    const { to, from = 'CONNECT', message }: SmsRequest = await req.json();

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({ to, from, message }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: responseData }, { status: response.status });
    }

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}