import { NextRequest, NextResponse } from 'next/server';
import { sendSmsServer } from '@/lib/useSmsSender';
export async function POST(req: NextRequest) {
  try {
    const { to, from = 'TIARACONECT', message } = await req.json();
    return await sendSmsServer({ to, from, message });
  } catch (error) {
    console.error('Error in SMS route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}