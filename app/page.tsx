'use client';

import { useState, useEffect, useCallback } from 'react';
import PipelineForm from '../components/PipelineForm';
import SummaryTable from '../components/SummaryTable';
import MolecularDynamicsLoader from '../components/MolecularDynamicsLoader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Download, XCircle } from 'lucide-react';
import PipelineInputs from '../components/PipelineInputs';

export default function Home() {
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [pdbUrl, setPdbUrl] = useState<string | null>(null);
  const [summaryUrl, setSummaryUrl] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>('medium');

  // --- 1. Initial Load Effect ---
  // On component mount, this tries to load an existing job from localStorage.
  useEffect(() => {
    const storedTaskId = localStorage.getItem('pipelineTaskId');
    if (storedTaskId) {
      setTaskId(storedTaskId);
      const storedPdbUrl = localStorage.getItem('pipelinePdbUrl');
      const storedSummaryUrl = localStorage.getItem('pipelineSummaryUrl');
      // If results are also stored, display them immediately.
      if (storedPdbUrl && storedSummaryUrl) {
        setPdbUrl(storedPdbUrl);
        setSummaryUrl(storedSummaryUrl);
        setIsRunning(false);
      } else {
        // If only a taskId exists, we assume the job is still running.
        setIsRunning(true);
      }
    }
  }, []);

  // --- 2. Polling Effect ---
  // This effect runs whenever there is a taskId but no results (pdbUrl).
  useEffect(() => {
    // We only poll if there's a task ID and we are in a "running" state.
    if (!taskId || !isRunning) {
        return;
    }

    let isMounted = true;
    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/pipeline-status?taskId=${taskId}`);
        if (!isMounted) return;

        if (!response.ok) {
          console.error('Status check failed:', response.statusText);
          if (response.status === 404) {
            setError('Task not found on the server. Clearing job.');
            handleClear(); // Task is invalid, so clear it.
          }
          return;
        }

        const data = await response.json();
        if (data.status === 'completed') {
          // On completion, set results, stop running, and save results to localStorage.
          setPdbUrl(data.pdb_url);
          setSummaryUrl(data.summary_url);
          setIsRunning(false);
          localStorage.setItem('pipelinePdbUrl', data.pdb_url);
          localStorage.setItem('pipelineSummaryUrl', data.summary_url);
        } else if (data.status === 'failed') {
          // On failure, set error, stop running, and clear everything.
          setError(data.error || 'The pipeline process failed.');
          setIsRunning(false);
          handleClear();
        }
        // If status is 'running' or 'pending', the effect does nothing and waits for the next interval.
      } catch (err) {
        console.error('Error during polling:', err);
        if (isMounted) {
          setError('Failed to get pipeline status.');
          setIsRunning(false);
        }
      }
    };

    checkStatus(); // Check immediately on start.
    const intervalId = setInterval(checkStatus, 10000);

    // Cleanup function to stop polling when the component unmounts or dependencies change.
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [taskId, isRunning]); // Dependencies that trigger the polling logic.

  // --- 3. Centralized Cleanup Function ---
  // A single, reliable function to clear all state and localStorage data.
  const handleClear = useCallback(() => {
    localStorage.removeItem('pipelineTaskId');
    localStorage.removeItem('pipelinePdbUrl');
    localStorage.removeItem('pipelineSummaryUrl');
    // Also clear any saved inputs
    if (taskId) {
        localStorage.removeItem(`pipelineInputs_${taskId}`);
    }
    setTaskId(null);
    setPdbUrl(null);
    setSummaryUrl(null);
    setError(null);
    setIsRunning(false);
  }, [taskId]); // Depend on taskId to clear the correct input storage.

  // --- 4. New Job Submission ---
  // Handles the submission of a new pipeline.
  const handleSubmit = async (formData: FormData) => {
    // CRITICAL: Clear any previous job data first.
    handleClear();
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

      // Save the inputs used for this specific job.
      const formEntries = Object.fromEntries(formData.entries());
      localStorage.setItem(`pipelineInputs_${data.taskId}`, JSON.stringify(formEntries));
      
      // Save the new task ID to start the polling process.
      localStorage.setItem('pipelineTaskId', data.taskId);
      setTaskId(data.taskId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      setIsRunning(false);
    }
  };

  const handleDownload = (option: string) => {
    if (!taskId) return;
    setIsDownloading(true);
    fetch(`/api/download-custom-results/${taskId}?option=${option}`, { method: 'GET' })
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.blob();
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${taskId}_results_${option}.zip`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch(err => {
        console.error('Download error:', err);
        setError(`Download error: ${err.message}`);
      })
      .finally(() => {
        setIsDownloading(false);
      });
  };

  // --- 5. Conditional Rendering ---
  // If results are available (pdbUrl is set), show the results view.
  if (pdbUrl) {
    return (
      <div className="min-h-screen bg-gray-50/50 p-6 mt-22">
        <div className="max-w-6xl mx-auto space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">✅ Results Ready</CardTitle>
              <Button variant="outline" size="sm" onClick={handleClear}>
                <XCircle className="mr-2 h-4 w-4" /> Start New Job
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Download Card */}
              <Card className="max-w-4xl mx-auto shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold">Download Results</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Label htmlFor="download-option" className="text-sm font-medium mb-2 block">
                      Package Size
                    </Label>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2">
                      <div className="flex-1">
                        <Select
                          disabled={isDownloading}
                          value={selectedOption}
                          onValueChange={setSelectedOption}
                        >
                          <SelectTrigger id="download-option">
                            <SelectValue placeholder="Select package size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Light • Without MD trajectories</SelectItem>
                            <SelectItem value="medium">Medium • With the wrapped production run trajectory alone (recommended)</SelectItem>
                            <SelectItem value="heavy">Heavy • With all MD trajectories (Heavy in size)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        onClick={() => handleDownload(selectedOption)}
                        className="min-w-[180px]"
                        disabled={isDownloading}
                      >
                        {isDownloading ? (
                          <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Preparing...</>
                        ) : (
                          <><Download className="mr-2 h-4 w-4" />Download</>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              {/* PipelineInputs */}
              <PipelineInputs taskId={taskId} />
              {/* Summary Table */}
              <SummaryTable summaryUrl={summaryUrl} />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Otherwise, show the main form or the loader.
  return (
    <div className="min-h-screen bg-gray-50/50 p-6 mt-22">
      <div className="max-w mx-auto space-y-6">
        <PipelineForm onSubmit={handleSubmit} isRunning={isRunning} />
        {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
        {isRunning && <MolecularDynamicsLoader />}
      </div>
    </div>
  );
}