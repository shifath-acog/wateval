'use client';

import { useState, useEffect } from 'react';

interface SummaryTableProps {
  summaryUrl: string | null;
}

interface SummaryData {
  Water_Site: string;
  FreeEnergy_in_kcal_mol: number;
  TdS_in_kcal_mol: number;
  Etot_in_kcal_mol: number;
}

export default function SummaryTable({ summaryUrl }: SummaryTableProps) {
  const [data, setData] = useState<SummaryData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!summaryUrl) {
      setData([]);
      setError(null);
      return;
    }

    const fetchSummary = async () => {
      try {
        const response = await fetch(summaryUrl);
        if (!response.ok) throw new Error('Failed to fetch summary file');
        const text = await response.text();
        const lines = text.trim().split('\n');
        if (lines.length <= 1) throw new Error('No data in summary file');

        // Skip header and parse data rows
        const parsedData = lines.slice(1).map(line => {
          const [Water_Site, FreeEnergy_in_kcal_mol, TdS_in_kcal_mol, Etot_in_kcal_mol] = line.trim().split(/\s+/);
          return {
            Water_Site,
            FreeEnergy_in_kcal_mol: parseFloat(FreeEnergy_in_kcal_mol),
            TdS_in_kcal_mol: parseFloat(TdS_in_kcal_mol),
            Etot_in_kcal_mol: parseFloat(Etot_in_kcal_mol),
          };
        });

        setData(parsedData);
        setError(null);
      } catch (err) {
        setError(`Error loading summary: ${err instanceof Error ? err.message : String(err)}`);
        setData([]);
      }
    };

    fetchSummary();
  }, [summaryUrl]);

  if (!summaryUrl) return null;
  if (error) return <p className="text-red-600 mt-4">{error}</p>;

  return (
    <div className="mt-4 overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b">Water Site</th>
            <th className="py-2 px-4 border-b">Free Energy (kcal/mol)</th>
            <th className="py-2 px-4 border-b">TdS (kcal/mol)</th>
            <th className="py-2 px-4 border-b">Etot (kcal/mol)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{row.Water_Site}</td>
              <td className="py-2 px-4 border-b">{row.FreeEnergy_in_kcal_mol.toFixed(2)}</td>
              <td className="py-2 px-4 border-b">{row.TdS_in_kcal_mol.toFixed(2)}</td>
              <td className="py-2 px-4 border-b">{row.Etot_in_kcal_mol.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}