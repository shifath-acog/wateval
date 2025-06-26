
// output-files/route.ts
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const taskId = searchParams.get('taskId');
  const file = searchParams.get('file');

  if (!taskId) {
    return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
  }

  // If 'file' query parameter is present, serve the file
  if (file) {
    try {
      // *** CHANGE THIS LINE ***
      const dataDir = '/app/results'; // Changed from '/app/data' to '/app/results'
      const filePath = path.join(dataDir, decodeURIComponent(file));

      const stat = await fs.stat(filePath);
      if (!stat.isFile()) {
        return NextResponse.json({ error: 'Invalid file path' }, { status: 404 });
      }

      const data = await fs.readFile(filePath);
      const contentType = file.endsWith('.pdb') ? 'chemical/x-pdb' : 'text/plain';
      return new NextResponse(data, {
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `inline; filename="${file}"`,
        },
      });
    } catch (err: any) {
      return NextResponse.json(
        { error: `Failed to fetch file: ${err.message}` },
        { status: 500 }
      );
    }
  }

  // Otherwise, list available files for the task
  try {
    // *** CHANGE THIS LINE ***
    const dataDir = '/app/results'; // Changed from '/app/data' to '/app/results'
    const pdbFile = `${taskId}_md_energy_min.pdb`;
    const summaryFile = `${taskId}_wat_FE_summary.dat`;
    const pdbPath = path.join(dataDir, pdbFile);
    const summaryPath = path.join(dataDir, summaryFile);

    const [pdbExists, summaryExists] = await Promise.all([
      fs.access(pdbPath).then(() => true).catch(() => false),
      fs.access(summaryPath).then(() => true).catch(() => false),
    ]);

    const files = [];
    if (pdbExists) {
      files.push({
        name: pdbFile,
        url: `/api/output-files?taskId=${taskId}&file=${encodeURIComponent(pdbFile)}`,
      });
    }
    if (summaryExists) {
      files.push({
        name: summaryFile,
        url: `/api/output-files?taskId=${taskId}&file=${encodeURIComponent(summaryFile)}`,
      });
    }

    if (files.length === 0) {
      return NextResponse.json({ error: `No files found for task ID ${taskId}` }, { status: 404 });
    }

    return NextResponse.json({ files });
  } catch (err: any) {
    return NextResponse.json(
      { error: `Failed to read output files: ${err.message}` },
      { status: 500 }
    );
  }
}
