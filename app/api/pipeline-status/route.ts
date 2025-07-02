import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get('taskId');

    if (!taskId) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    const statusUrl = `http://host.docker.internal:5001/run-pipeline-status/${taskId}`;
    const response = await fetch(statusUrl);
    const statusData = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: statusData.detail || 'Failed to get status' }, { status: response.status });
    }

    return NextResponse.json(statusData);
  } catch (error) {
    console.error('Error in pipeline-status route:', error);
    return NextResponse.json({ error: 'Internal server error checking status' }, { status: 500 });
  }
}