'use client';

import { useState, useEffect } from 'react';
import PipelineForm from '../components/PipelineForm';
import MoleculeViewer from '../components/MoleculeViewer';
import SummaryTable from '../components/SummaryTable';
import MolecularDynamicsLoader from '../components/MolecularDynamicsLoader'; // Add this import

export default function Home() {
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [pdbUrl, setPdbUrl] = useState<string | null>(null);
  const [summaryUrl, setSummaryUrl] = useState<string | null>(null);

  // On initial load, try to get a pending taskId from localStorage
  const [taskId, setTaskId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('pipelineTaskId');
    }
    return null;
  });

  // This useEffect hook is the core of the polling logic
  useEffect(() => {
    if (!taskId) return; // Don't do anything if there's no task

    let isMounted = true; // Prevent state updates on unmounted component

    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/pipeline-status?taskId=${taskId}`);
        if (!isMounted) return; // Exit if component unmounted while fetching

        if (!response.ok) {
          console.error("Status check failed, will retry.");
          return;
        }

        const data = await response.json();

        if (data.status === 'completed') {
          setPdbUrl(data.pdb_url);
          setSummaryUrl(data.summary_url);
          setIsRunning(false);
          localStorage.removeItem('pipelineTaskId'); // Clean up
        } else if (data.status === 'failed') {
          setError(data.error || 'The pipeline process failed.');
          setIsRunning(false);
          localStorage.removeItem('pipelineTaskId');
        } else {
          setIsRunning(true);
        }
      } catch (err) {
        console.error("Error during polling:", err);
      }
    };

    checkStatus();

    const intervalId = setInterval(() => {
      if (document.hidden) return;
      checkStatus();
    }, 10000);

    if (!isRunning) {
      clearInterval(intervalId);
    }

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [taskId, isRunning]);

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    setTaskId(null);
    setPdbUrl(null);
    setSummaryUrl(null);
    setIsRunning(true);

    try {
      const response = await fetch('/api/start-pipeline', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to start pipeline');
      }

      localStorage.setItem('pipelineTaskId', data.taskId);
      setTaskId(data.taskId);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      setIsRunning(false);
    }
  };

  return (
    <div className="p-6 mt-22">
      {/* Pass isRunning to PipelineForm and always render it */}
      <PipelineForm onSubmit={handleSubmit} isRunning={isRunning} />

      {error && <p className="text-red-600 mt-4">{error}</p>}
      
      
      {isRunning && <MolecularDynamicsLoader />}

      {/* Show results once they are available */}
      {!isRunning && pdbUrl && (
        <>
          <h2 className="text-xl font-semibold mt-6">✅ Results</h2>
          {/* <h1> PDB Visualization </h1> */}
        
          {/* <h1> Summary Table </h1> */}
          <SummaryTable summaryUrl={summaryUrl} />
         
        </>
      )}
    </div>
  );
}