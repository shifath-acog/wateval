import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const PipelineStatus = ({ taskId }) => {
  const [status, setStatus] = useState(null);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const pollStatus = async () => {
      try {
        const response = await fetch(`/run-pipeline-status/${taskId}`);
        const data = await response.json();
        setStatus(data.status);
        setLogs(data.logs || []);

        if (data.status === 'failed' && data.error) {
          toast.error(`Pipeline failed: ${data.error}`, { autoClose: 5000 });
        } else if (data.status === 'completed') {
          toast.success('Pipeline completed successfully!', { autoClose: 5000 });
        }
      } catch (error) {
        toast.error('Error polling pipeline status', { autoClose: 5000 });
      }

      if (status !== 'completed' && status !== 'failed') {
        setTimeout(pollStatus, 5000); // Poll every 5 seconds
      }
    };

    pollStatus();
  }, [taskId, status]);

  return (
    <div className="mt-4 p-4 border rounded">
      <h3 className="text-lg font-bold">Pipeline Status</h3>
      <p>Status: {status || 'Pending...'}</p>
      {logs.length > 0 && (
        <div className="mt-2">
          <h4 className="text-md font-semibold">Logs:</h4>
          <ul className="list-disc pl-5">
            {logs.map((log, index) => (
              <li key={index} className={log.includes('Error') || log.includes('Exception') ? 'text-red-600' : ''}>
                {log}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PipelineStatus;