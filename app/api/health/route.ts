import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Basic health check
    return NextResponse.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  } catch (error) {
    return NextResponse.json({ 
      status: 'error', 
      error: 'Health check failed' 
    }, { status: 500 });
  }
}
