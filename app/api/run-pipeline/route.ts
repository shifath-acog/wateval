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
        while (true) { // Poll indefinitely until completed or failed
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
                `data: ${JSON.stringify({ error: `Status check failed: ${statusResponse.statusText}` })}\n\n`
              );
              break;
            }

            const status = await statusResponse.json();
            console.log('Current status from pipeline-runner:', status); // Debugging line

            // Pass the pdb_url and summary_url directly if available, along with taskId and status
            const payload: any = { status: status.status, taskId };
            if (status.pdb_url) {
              payload.pdb_url = status.pdb_url;
            }
            if (status.summary_url) {
              payload.summary_url = status.summary_url;
            }
            if (status.error) {
              payload.error = status.error;
            }

            controller.enqueue(
              `data: ${JSON.stringify(payload)}\n\n`
            );

            if (status.status === 'completed' || status.status === 'failed') {
              // Send end event with both urls
              controller.enqueue(`event: end\ndata: ${JSON.stringify({ status: status.status, taskId, pdb_url: status.pdb_url || null, summary_url: status.summary_url || null })}\n\n`);
              break;
            }

            await new Promise((resolve) => setTimeout(resolve, 5000)); // 5 sec poll interval
          } catch (err) {
            clearTimeout(statusTimeout);
            const message = err instanceof Error ? err.message : String(err);
            console.error(`Status check failed: ${message}, retrying in 5 seconds...`);

            if (typeof err === 'object' && err !== null && 'name' in err && (err as { name: string }).name === 'AbortError') {
              controller.enqueue(
                `data: ${JSON.stringify({ warning: `Status check timed out after 5 minutes, retrying...`, taskId })}\n\n`
              );
            }
            await new Promise((resolve) => setTimeout(resolve, 5000)); // Retry after 5 seconds
          }
        }
      } catch (err) {
        controller.enqueue(
          `data: ${JSON.stringify({ error: `Pipeline error: ${err instanceof Error ? err.message : String(err)}` })}\n\n`
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