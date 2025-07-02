import React from 'react';

const MolecularDynamicsLoader = () => {
  return (
    <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg border border-blue-200">
      <div className="flex flex-col items-center space-y-4">
        {/* Animated molecule representation */}
        <div className="relative w-24 h-24">
          {/* Central protein core */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
          
          {/* Orbiting particles representing water molecules and ligands */}
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '4s' }}>
            <div className="w-3 h-3 bg-cyan-400 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2"></div>
            <div className="w-2 h-2 bg-red-400 rounded-full absolute bottom-0 left-1/2 transform -translate-x-1/2"></div>
          </div>
          
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }}>
            <div className="w-2 h-2 bg-green-400 rounded-full absolute left-0 top-1/2 transform -translate-y-1/2"></div>
            <div className="w-3 h-3 bg-purple-400 rounded-full absolute right-0 top-1/2 transform -translate-y-1/2"></div>
          </div>
          
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '5s' }}>
            <div className="w-2 h-2 bg-yellow-400 rounded-full absolute top-2 right-2"></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full absolute bottom-2 left-2"></div>
          </div>
        </div>
        

        
        {/* Status text with animated typing effect */}
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-gray-800">
            🧬 Calculating Binding Free Energies
          </h3>
          <p className="text-sm text-gray-600 max-w-md">
            Running OpenMM simulation to analyze water site interactions in your protein-ligand system...
          </p>
          <p className="text-xs text-blue-600 font-medium">
            ⚡ You can safely close this page and return later
          </p>
        </div>
        
        
      </div>
    </div>
  );
};

export default MolecularDynamicsLoader;