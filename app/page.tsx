'use client';

import { useState, useEffect, FormEvent } from 'react';
import PipelineForm from '../components/PipelineForm';
import MoleculeViewer from '../components/MoleculeViewer'; 
import SummaryTable from '../components/SummaryTable'; // Adjust import path as needed

export default function Home() {
  const [outputFiles, setOutputFiles] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [progressHistory, setProgressHistory] = useState<string[]>([]);
  const [currentStatus, setCurrentStatus] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [pdbUrl, setPdbUrl] = useState<string | null>(null);
  const [summaryUrl, setSummaryUrl] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setOutputFiles([]);
    setError(null);
    setProgressHistory([]);
    setCurrentStatus(null);
    setTaskId(null);
    setPdbUrl(null);
    setSummaryUrl(null);
    setIsRunning(true);

    try {
      const response = await fetch('/api/run-pipeline', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value);
        const events = text.trim().split('\n\n').filter(event => event);
        for (const event of events) {
          if (event.startsWith('event: end')) {
            console.log('Pipeline stream ended');
            setIsRunning(false);
            if (!error && taskId && currentStatus === 'completed') {
              setProgressHistory((prev) => [...prev, 'Pipeline completed successfully']);
            }
            break;
          } else if (event.startsWith('data: ')) {
            const data = JSON.parse(event.replace('data: ', ''));
            if (data.error) {
              setError(data.error);
              setProgressHistory((prev) => [...prev, `Error: ${data.error}`]);
              setIsRunning(false);
            } else if (data.status) {
              if (!currentStatus || data.status !== currentStatus) {
                const statusMessage = data.status === 'running' ? 'Simulation running' : `Status: ${data.status}`;
                setProgressHistory((prev) => [...prev, statusMessage]);
                setCurrentStatus(data.status);
              }
              setTaskId(data.taskId);
              if (data.status === 'completed' && data.pdb_url) {
                setPdbUrl(data.pdb_url);
                setSummaryUrl(data.summary_url); // Set summary URL when available
                setIsRunning(false);
              } else if (data.status === 'failed') {
                setError(data.error || 'Pipeline failed');
                setIsRunning(false);
              }
            }
          }
        }
      }
    } catch (err) {
      setError(`Pipeline error: ${err instanceof Error ? err.message : String(err)}`);
      setIsRunning(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Wateval Pipeline</h1>
      <PipelineForm onSubmit={handleSubmit} />
      {error && <p className="text-red-600 mt-4">{error}</p>}
      {isRunning && <p className="mt-4">Simulation running...</p>}
      {!isRunning && taskId && pdbUrl && (
        <>
          <h2 className="text-xl font-semibold mt-6">PDB Visualization</h2>
          <MoleculeViewer files={[pdbUrl]} height="500px" width="800px" />
          <h2 className="text-xl font-semibold mt-6">Water Free Energy Summary</h2>
          <SummaryTable summaryUrl={summaryUrl} />
        </>
      )}
    </div>
  );
}