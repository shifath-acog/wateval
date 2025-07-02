//run-pipeline/route.ts
import { NextResponse } from 'next/server';

export const runtime = 'nodejs'; // Ensure Node.js runtime for streaming support

export async function POST(req: Request) {
  const formData = await req.formData();
  const pipelineUrl = new URL('http://host.docker.internal:5001/run-pipeline-start');
  console.log('Starting pipeline, proxying to:', pipelineUrl.toString());

  const pipelineResponse = await fetch(pipelineUrl.toString(), {
    method: 'POST',
    body: formData,
  });

  if (!pipelineResponse.ok) {
    return NextResponse.json(
      { error: `Failed to start pipeline: ${pipelineResponse.statusText}` },
      { status: pipelineResponse.status }
    );
  }

  const data = await pipelineResponse.json();
  const taskId = data.task_id;
  console.log('Pipeline started, task_id:', taskId);

  const stream = new ReadableStream({
    async start(controller) {
      try {
        while (true) {
          const statusController = new AbortController();
          const statusTimeout = setTimeout(() => statusController.abort(), 300000); // 5-minute timeout per attempt

          try {
            const statusResponse = await fetch(
              `http://host.docker.internal:5001/run-pipeline-status/${taskId}`,
              { signal: statusController.signal }
            );
            clearTimeout(statusTimeout);

            if (!statusResponse.ok) {
              controller.enqueue(
                `data: ${JSON.stringify({ error: `Status check failed: ${statusResponse.statusText}`, taskId })}\n\n`
              );
              break;
            }

            const status = await statusResponse.json();
            console.log('Current status from pipeline-runner:', status); // Debugging line

            const payload: any = { status: status.status, taskId };
            if (status.pdb_url) payload.pdb_url = status.pdb_url;
            if (status.summary_url) payload.summary_url = status.summary_url;
            if (status.error) payload.error = status.error; // Include error if present

            controller.enqueue(
              `data: ${JSON.stringify(payload)}\n\n`
            );

            if (status.status === 'completed' || status.status === 'failed') {
              controller.enqueue(
                `event: end\ndata: ${JSON.stringify({ status: status.status, taskId, pdb_url: status.pdb_url || null, summary_url: status.summary_url || null, error: status.error || null })}\n\n`
              );
              break;
            }

            await new Promise((resolve) => setTimeout(resolve, 2000)); // Reduced to 2 seconds for faster updates
          } catch (err) {
            clearTimeout(statusTimeout);
            const message = err instanceof Error ? err.message : String(err);
            console.error(`Status check failed: ${message}, retrying in 2 seconds...`);

            if (err instanceof Error && err.name === 'AbortError') {
              controller.enqueue(
                `data: ${JSON.stringify({ warning: `Status check timed out after 5 minutes, retrying...`, taskId })}\n\n`
              );
            }
            await new Promise((resolve) => setTimeout(resolve, 2000)); // Retry after 2 seconds
          }
        }
      } catch (err) {
        controller.enqueue(
          `data: ${JSON.stringify({ error: `Pipeline error: ${err instanceof Error ? err.message : String(err)}`, taskId })}\n\n`
        );
        controller.enqueue(`event: end\ndata: ${JSON.stringify({ status: 'failed', taskId })}\n\n`);
      } finally {
        controller.close();
      }
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}