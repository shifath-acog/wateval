// app/api/run-default/route.ts
import { NextResponse } from 'next/server';

const FASTAPI_BASE_URL = 'http://host.docker.internal:5001'; // Adjust as confirmed

export async function GET() {
  try {
    const fastapiUrl = new URL('/run-default', FASTAPI_BASE_URL);

    const response = await fetch(fastapiUrl.toString(), {
      method: 'GET',
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`FastAPI responded with status ${response.status}: ${errorBody}`);
      try {
        const errorJson = JSON.parse(errorBody);
        return NextResponse.json(errorJson, { status: response.status });
      } catch (e) {
        return NextResponse.json({ error: `FastAPI error: ${errorBody}` }, { status: response.status });
      }
    }

    // Proxy the stream back to the client
    return new NextResponse(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('Error in Next.js /api/run-default:', error);
    return NextResponse.json({ error: `Server error in Next.js API: ${error.message}` }, { status: 500 });
  }
}