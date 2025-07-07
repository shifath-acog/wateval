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
import PipelineInputs from '../components/PipelineInputs'; // Import the new component

export default function Home() {
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [pdbUrl, setPdbUrl] = useState<string | null>(null);
  const [summaryUrl, setSummaryUrl] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>('medium');

  // Effect to load taskId and results from localStorage on initial render
  useEffect(() => {
    const storedTaskId = localStorage.getItem('pipelineTaskId');
    if (storedTaskId) {
      setTaskId(storedTaskId);
      const storedPdbUrl = localStorage.getItem('pipelinePdbUrl');
      const storedSummaryUrl = localStorage.getItem('pipelineSummaryUrl');
      if (storedPdbUrl && storedSummaryUrl) {
        setPdbUrl(storedPdbUrl);
        setSummaryUrl(storedSummaryUrl);
        setIsRunning(false);
      }
    }
  }, []);

  // Effect for polling the pipeline status
  useEffect(() => {
    if (!taskId || pdbUrl) return;

    let isMounted = true;
    setIsRunning(true);

    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/pipeline-status?taskId=${taskId}`);
        if (!isMounted) return;

        if (!response.ok) {
          console.error('Status check failed, will retry.');
          return;
        }

        const data = await response.json();

        if (data.status === 'completed') {
          setPdbUrl(data.pdb_url);
          setSummaryUrl(data.summary_url);
          setIsRunning(false);
          localStorage.setItem('pipelinePdbUrl', data.pdb_url);
          localStorage.setItem('pipelineSummaryUrl', data.summary_url);
        } else if (data.status === 'failed') {
          setError(data.error || 'The pipeline process failed.');
          setIsRunning(false);
          localStorage.removeItem('pipelineTaskId');
          setTaskId(null);
        }
      } catch (err) {
        console.error('Error during polling:', err);
        if (isMounted) {
          setError('Failed to get pipeline status.');
          setIsRunning(false);
        }
      }
    };

    checkStatus();
    const intervalId = setInterval(checkStatus, 10000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [taskId, pdbUrl]);

  // Centralized function to clear all job data
  const handleClear = useCallback(() => {
    localStorage.removeItem('pipelineTaskId');
    localStorage.removeItem('pipelinePdbUrl');
    localStorage.removeItem('pipelineSummaryUrl');
    setTaskId(null);
    setPdbUrl(null);
    setSummaryUrl(null);
    setError(null);
    setIsRunning(false);
  }, []);

  const handleSubmit = async (formData: FormData) => {
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

      // Store the form data in localStorage
      const formEntries = Object.fromEntries(formData.entries());
      localStorage.setItem(`pipelineInputs_${data.taskId}`, JSON.stringify(formEntries));

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
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
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

  if (pdbUrl && !isRunning) {
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
          <div>
            <Card className="max-w-4xl mx-auto shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">Download Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Label htmlFor="download-option" className="text-sm font-medium mb-2 block">
                  Package Size
                </Label>
                <div className="flex flex-row items-end gap-2">
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
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Preparing...
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* PipelineInputs */}
          <div>
            <PipelineInputs taskId={taskId} />
          </div>
          {/* Summary Table */}
          <div>
            <SummaryTable summaryUrl={summaryUrl} />
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 mt-22">
      <div className="max-w mx-auto space-y-6">
        <PipelineForm onSubmit={handleSubmit} isRunning={isRunning} />
        {error && <p className="text-red-600 mt-4">{error}</p>}
        {isRunning && <MolecularDynamicsLoader />}
      </div>
    </div>
  );
}