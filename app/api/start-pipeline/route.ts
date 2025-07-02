import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const pipelineUrl = 'http://host.docker.internal:5001/run-pipeline-start';

    const response = await fetch(pipelineUrl, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.detail || 'Failed to start pipeline' }, { status: response.status });
    }

    return NextResponse.json({ taskId: data.task_id });
  } catch (error) {
    console.error('Error in start-pipeline route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}