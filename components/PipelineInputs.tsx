import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PipelineInputsProps {
  taskId: string | null;
}

export default function PipelineInputs({ taskId }: PipelineInputsProps) {
  const storedInputs = taskId ? localStorage.getItem(`pipelineInputs_${taskId}`) : null;

  if (!storedInputs) {
    return null; // Don't render if no inputs are stored
  }

  const inputs = JSON.parse(storedInputs);

return (
  <Card className="w-full max-w-6xl mx-auto shadow-xl my-16">
    <CardHeader>
      <CardTitle className="text-2xl font-bold">Submitted Pipeline Parameters</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {Object.entries(inputs).map(([key, value]) => (
          <div key={key}>
            <p className="text-sm font-medium capitalize">{key.replace(/_/g, ' ')}</p>
            <p className="text-sm text-gray-600">{value !== null && value !== undefined ? value.toString() : 'N/A'}</p>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);
}