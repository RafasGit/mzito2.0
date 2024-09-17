import { NextResponse } from 'next/server';

interface SmsSenderProps {
  to: string;
  from?: string;
  message: string | Date ;
}

interface SmsResponse {
  to: string;
  mnc: string;
  mcc: string;
  balance: string;
  statusCode: string;
  status: string;
  desc: string;
  msgId: string;
  cost: string;
}
 
const API_KEY = process.env.NEXT_PUBLIC_SMS_API_KEY!;
const API_ENDPOINT = process.env.NEXT_PUBLIC_SMS_ENDPOINT!;
const MAX_RETRIES = 3;
const RETRY_DELAY = 3000; // 3 seconds

async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function sendSmsRequest({ to, from, message }: SmsSenderProps): Promise<SmsResponse> {
  const response = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({ to, from, message }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

export async function sendSmsServer({ to, from = 'TIARACONECT', message }: SmsSenderProps): Promise<NextResponse> {
  let attempts = 0;
  let lastError: Error | null = null;

  while (attempts < MAX_RETRIES) {
    try {
      const responseData = await sendSmsRequest({ to, from, message });

      // Log every attempt's result for better debugging
      console.log(`Attempt ${attempts + 1} response:`, responseData);

      // Return early if the SMS was sent successfully
      if (responseData.status === 'SUCCESS') {
        console.log('SMS sent successfully:', responseData);
        return NextResponse.json(responseData, { status: 200 });
      } else {
        console.error(`Attempt ${attempts + 1} failed. Response status: ${responseData.status}`);
        lastError = new Error(`SMS sending failed. Response status: ${responseData.status}`);
      }
    } catch (error) {
      console.error(`Attempt ${attempts + 1} error:`, error);
      lastError = error instanceof Error ? error : new Error(String(error));
    }

    attempts++;
    // Only delay if there's another retry left
    if (attempts < MAX_RETRIES) {
      await delay(RETRY_DELAY);
    }
  }

  // If we exhausted all attempts, return an error response
  console.error('Max retries reached. SMS sending failed.');
  return NextResponse.json({ error: lastError?.message || 'Max retries reached' }, { status: 500 });
}