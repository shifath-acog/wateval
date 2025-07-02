'use client';

import { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, AlertCircle, FileText, TrendingUp, TrendingDown } from 'lucide-react';

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
  // Dummy data for preview
  const dummyData: SummaryData[] = [
    { Water_Site: "WAT_001", FreeEnergy_in_kcal_mol: -8.45, TdS_in_kcal_mol: -12.30, Etot_in_kcal_mol: -20.75 },
    { Water_Site: "WAT_002", FreeEnergy_in_kcal_mol: -6.12, TdS_in_kcal_mol: -8.90, Etot_in_kcal_mol: -15.02 },
    { Water_Site: "WAT_003", FreeEnergy_in_kcal_mol: -3.78, TdS_in_kcal_mol: -5.60, Etot_in_kcal_mol: -9.38 },
    { Water_Site: "WAT_004", FreeEnergy_in_kcal_mol: -2.34, TdS_in_kcal_mol: -4.20, Etot_in_kcal_mol: -6.54 },
    { Water_Site: "WAT_005", FreeEnergy_in_kcal_mol: -1.85, TdS_in_kcal_mol: -3.10, Etot_in_kcal_mol: -4.95 },
    { Water_Site: "WAT_006", FreeEnergy_in_kcal_mol: -0.92, TdS_in_kcal_mol: -2.45, Etot_in_kcal_mol: -3.37 },
    { Water_Site: "WAT_007", FreeEnergy_in_kcal_mol: 1.23, TdS_in_kcal_mol: 2.80, Etot_in_kcal_mol: 4.03 },
    { Water_Site: "WAT_008", FreeEnergy_in_kcal_mol: 2.67, TdS_in_kcal_mol: 4.15, Etot_in_kcal_mol: 6.82 },
    { Water_Site: "WAT_009", FreeEnergy_in_kcal_mol: 4.56, TdS_in_kcal_mol: 6.30, Etot_in_kcal_mol: 10.86 },
    { Water_Site: "WAT_010", FreeEnergy_in_kcal_mol: 7.89, TdS_in_kcal_mol: 9.45, Etot_in_kcal_mol: 17.34 }
  ];

  const [data, setData] = useState<SummaryData[]>(dummyData);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  useEffect(() => {
    if (!summaryUrl) {
      setData(dummyData);
      setError(null);
      return;
    }

    const fetchSummary = async () => {
      setLoading(true);
      try {
        const response = await fetch(summaryUrl);
        if (!response.ok) throw new Error('Failed to fetch summary file');
        const text = await response.text();
        const lines = text.trim().split('\n');
        if (lines.length <= 1) throw new Error('No data in summary file');

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
        setData(dummyData); // Fallback to dummy data on error
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [summaryUrl]);

  const handleSort = () => {
    let sortedData = [...data];
    if (sortOrder === 'asc') {
      sortedData.sort((a, b) => b.FreeEnergy_in_kcal_mol - a.FreeEnergy_in_kcal_mol);
      setSortOrder('desc');
    } else {
      sortedData.sort((a, b) => a.FreeEnergy_in_kcal_mol - b.FreeEnergy_in_kcal_mol);
      setSortOrder('asc');
    }
    setData(sortedData);
  };

  const getEnergyColor = (value: number) => {
    if (value < -5) return 'text-green-700 bg-green-50';
    if (value < 0) return 'text-blue-700 bg-blue-50';
    if (value < 5) return 'text-orange-700 bg-orange-50';
    return 'text-red-700 bg-red-50';
  };

  const getEnergyTrend = (value: number) => {
    if (value < 0) return <TrendingDown className="w-4 h-4 text-green-600" />;
    return <TrendingUp className="w-4 h-4 text-red-600" />;
  };

  if (!summaryUrl) {
    // Show preview with dummy data when no URL is provided
    // Component will still render with the dummy data initialized above
  }

  if (error) {
    return (
      <div className="mt-6 p-6 bg-red-50 border-l-4 border-red-400 rounded-lg shadow-sm">
        <div className="flex items-center">
          <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
          <p className="text-red-800 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mt-6 p-8 text-center">
        <div className="inline-flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Loading summary data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-6 p-6 mr-6 ml-6 bg-gray-50 rounded-xl shadow-md">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black">Binding Free Energies of Water Sites</h1>
      </div>

      {/* Enhanced Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">
                  Water Site
                </th>
                <th 
                  className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200 select-none"
                  onClick={handleSort}
                >
                  <div className="flex items-center space-x-2">
                    <span>Free Energy</span>
                    <span className="text-xs text-gray-500">(kcal/mol)</span>
                    <div className="flex flex-col">
                      <ChevronUp className={`w-3 h-3 ${sortOrder === 'asc' ? 'text-blue-600' : 'text-gray-300'}`} />
                      <ChevronDown className={`w-3 h-3 -mt-1 ${sortOrder === 'desc' ? 'text-blue-600' : 'text-gray-300'}`} />
                    </div>
                  </div>
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">
                  <div>
                    <span>T×Entropy</span>
                    <span className="text-xs text-gray-500 block">(kcal/mol)</span>
                  </div>
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">
                  <div>
                    <span>Energy/Enthalpy</span>
                    <span className="text-xs text-gray-500 block">(kcal/mol)</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((row, index) => (
                <tr 
                  key={index} 
                  className={`transition-all duration-200 ${
                    hoveredRow === index 
                      ? 'bg-blue-50 shadow-md transform scale-[1.01]' 
                      : 'hover:bg-gray-50'
                  }`}
                  onMouseEnter={() => setHoveredRow(index)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="font-medium text-gray-900">{row.Water_Site}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-lg font-semibold text-sm ${getEnergyColor(row.FreeEnergy_in_kcal_mol)}`}>
                        {row.FreeEnergy_in_kcal_mol.toFixed(2)}
                      </span>
                      {getEnergyTrend(row.FreeEnergy_in_kcal_mol)}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-700 font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      {row.TdS_in_kcal_mol.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-700 font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      {row.Etot_in_kcal_mol.toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {data.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No data available</p>
          </div>
        )}
      </div>
    </div>
  );
}