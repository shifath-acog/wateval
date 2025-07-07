import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { taskId: string } }) {
  try {
    const { taskId } = params;
    const { searchParams } = new URL(req.url);
    const option = searchParams.get('option') || 'medium';

    if (!taskId) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    console.log(`Proxying request to http://host.docker.internal:5001/download-custom-results/${taskId}?option=${option}`);
    const downloadUrl = `http://host.docker.internal:5001/download-custom-results/${taskId}?option=${option}`;
    const response = await fetch(downloadUrl);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
      console.error(`FastAPI error: ${errorData.detail}, Status: ${response.status}`);
      return NextResponse.json({ error: errorData.detail || 'Failed to download results' }, { status: response.status });
    }

    const blob = await response.blob();
    return new NextResponse(blob, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': response.headers.get('Content-Disposition') || `attachment; filename=${taskId}_results_${option}.zip`,
      },
    });
  } catch (error) {
    console.error('Error in download proxy:', error);
    return NextResponse.json({ error: 'Internal server error during download' }, { status: 500 });
  }
}