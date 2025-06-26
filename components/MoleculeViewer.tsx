'use client';
import { useEffect, useRef, useState } from 'react';

// Declare 3Dmol.js global to fix TypeScript error
declare global {
  interface Window {
    $3Dmol: any; // Use 'any' for simplicity; no official types available
  }
}

interface MoleculeViewerProps {
  files: string[]; // Array of file paths (only one PDB expected)
  height?: string; // Viewer height (e.g., "500px")
  width?: string; // Viewer width (e.g., "800px")
}

export default function MoleculeViewer({
  files,
  height = '500px',
  width = '800px',
}: MoleculeViewerProps) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const viewerInstance = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);

  const renderMolecule = async () => {
    if (!files.length || !viewerRef.current || !window.$3Dmol) {
      setError('No PDB file provided or failed to initialize 3Dmol.js');
      return;
    }

    // Use the first file (expected to be the PDB)
    const pdbFile = files[0];
    if (!pdbFile.endsWith('.pdb')) {
      setError('Only PDB files are supported');
      return;
    }

    // Clear previous models
    if (viewerInstance.current) {
      viewerInstance.current.clear();
    } else {
      viewerInstance.current = window.$3Dmol.createViewer(viewerRef.current, {
        backgroundColor: 'white',
      });
    }

    if (!viewerInstance.current || typeof viewerInstance.current.setStyle !== 'function') {
      setError('Failed to initialize 3Dmol.js viewer');
      return;
    }

    try {
      const fetchUrl = `${window.location.origin}${pdbFile}`; // Full URL with origin
      console.log(`Fetching PDB from: ${fetchUrl}`);
      const response = await fetch(fetchUrl, { cache: 'no-store' }); // Prevent caching issues
      if (!response.ok) {
        throw new Error(`Failed to fetch ${fetchUrl}: ${response.status} ${response.statusText}`);
      }
      const data = await response.text();

      // Add PDB model
      const model = viewerInstance.current.addModel(data, 'pdb');
      if (!model) {
        throw new Error('Failed to add PDB model');
      }

      // Set style: Sticks and spheres
      viewerInstance.current.setStyle({}, {
        stick: { radius: 0.1, opacity: 1.0 },
        sphere: { radius: 0.2, opacity: 1.0 },
      });

      viewerInstance.current.zoomTo();
      viewerInstance.current.render();
      setError(null);
    } catch (err: any) {
      console.error(`Error loading PDB:`, err);
      setError(`Failed to load PDB: ${err.message}`);
    }
  };

  useEffect(() => {
    // Load 3Dmol.js dynamically
    const script = document.createElement('script');
    script.src = 'https://3dmol.csb.pitt.edu/build/3Dmol-min.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = async () => {
      await renderMolecule();
    };

    script.onerror = () => {
      console.error('Failed to load 3Dmol.js');
      setError('Failed to load 3Dmol.js library');
    };

    return () => {
      document.body.removeChild(script);
      if (viewerInstance.current) {
        viewerInstance.current.clear();
      }
    };
  }, [files]);

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-md p-4 max-w-4xl mx-auto">
      {error ? (
        <div
          style={{ width, height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          className="bg-gray-50 border border-red-300 rounded-md text-red-600 text-center p-4"
        >
          {error}
        </div>
      ) : (
        <div
          ref={viewerRef}
          style={{ width, height, position: 'relative' }}
          className="border border-gray-200 rounded-md shadow-sm"
        />
      )}
    </div>
  );
}