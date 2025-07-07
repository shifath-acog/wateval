import React from 'react';

const page = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 mt-14">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Water Thermodynamics Pipeline</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            End-to-end automated setup for computing absolute binding free energies (ABFEs) of water sites in protein-ligand systems
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        
        {/* Description Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="w-3 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full mr-4"></div>
            <h2 className="text-3xl font-bold text-gray-800">Description</h2>
          </div>
          <div className="prose prose-lg prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed">
              The pipeline is an end-to-end automated setup to compute <strong className="text-indigo-600">absolute binding free energies (ABFEs) of water sites in protein-ligand systems</strong>. Broadly, the key steps in the process are: (i) OpenMM-based Molecular Dynamics (MD) simulation of the input 'protein-ligand system with water molecules', followed by (ii) SSTMap-based GIST calculation on the MD trajectory. It is configured using a <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded">setting.yml</code> file and is managed with a <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded">Makefile</code>.
            </p>
          </div>
        </div>

        {/* Key Inputs */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="w-3 h-8 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full mr-4"></div>
            <h3 className="text-2xl font-bold text-gray-800">Key (mandatory) inputs to the pipeline</h3>
          </div>
          <div className="space-y-4">
            <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
              <p className="text-gray-700">The pipeline accepts either a PDB ID or a PDB file of a holo protein system as input.</p>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
              <p className="text-gray-700">As crystal structures tend to have more than one chain or multiple ligands at different locations in the same chain or other ions/molecules also labelled as ligands, it is highly recommended that the user provides details of 'Chain ID', 'Residue ID', and 'Residue name' for protein, ligand, and water molecules, to be considered by the pipeline.</p>
            </div>
            <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg">
              <p className="text-gray-700">The water sites of interest for ABFE calculations (essentially the water molecules at the sites or locations in the input complex) can be specified either by detecting the ones present within a user-set distance from the ligand (focusing on the protein-ligand interfacial region) or by supplying the 'Chain ID' and 'Residue ID' labels for the sites of user's interest.</p>
            </div>
          </div>
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Refer to the 'Configuration' section below for the complete list of inputs in <code className="bg-yellow-100 text-yellow-900 px-2 py-1 rounded">setting.yml</code>.
            </p>
          </div>
        </div>

        {/* Key Outputs */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="w-3 h-8 bg-gradient-to-b from-amber-500 to-orange-600 rounded-full mr-4"></div>
            <h3 className="text-2xl font-bold text-gray-800">Key outputs from the pipeline</h3>
          </div>
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
            <p className="text-gray-700">
              The ABFE of each water site of interest, along with enthalpy and entropy break-up, is saved in <code className="bg-amber-100 text-amber-900 px-2 py-1 rounded">wat_FE_summary.dat</code>.
            </p>
          </div>
        </div>

        {/* Prerequisites */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="w-3 h-8 bg-gradient-to-b from-red-500 to-pink-600 rounded-full mr-4"></div>
            <h2 className="text-3xl font-bold text-gray-800">Prerequisites to run the pipeline</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
              <p className="text-gray-700">Docker and Docker-compose must be installed on your computing system.</p>
            </div>
            <div className="bg-pink-50 border-l-4 border-pink-400 p-4 rounded-r-lg">
              <p className="text-gray-700">Necessary permissions to run Docker commands.</p>
            </div>
          </div>
        </div>

        {/* Folder Structure */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="w-3 h-8 bg-gradient-to-b from-teal-500 to-cyan-600 rounded-full mr-4"></div>
            <h2 className="text-3xl font-bold text-gray-800">Folder structure</h2>
          </div>
          <div className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
            <pre className="text-green-400 text-sm font-mono">
{`├── System_Prep
│   ├── split_sys.py
│   └── prep_sys.py
├── GIST_calc
│   ├── gistpp.sh
│   └── sstmap_gist.py 
├── MD_sim
│   ├── openmm_md.py
│   └── wrap_traj.py
├── api
│   ├── api.py
│   └── Dockerfile
├── examples
├── setting.yml
├── README.md
├── documentation.pdf
├── api.py
├── docker-compose.yml
├── Dockerfile
├── Makefile
└── main.py`}
            </pre>
          </div>
        </div>

        {/* Configuration */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="w-3 h-8 bg-gradient-to-b from-violet-500 to-purple-600 rounded-full mr-4"></div>
            <h2 className="text-3xl font-bold text-gray-800">Configuration</h2>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            The <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded">setting.yml</code> file contains the following parameters to be set by the user:
          </h3>
          
          <div className="space-y-6">
            {/* Input Files */}
            <div className="border-l-4 border-violet-400 pl-4">
              <h4 className="font-semibold text-gray-800 mb-2">Input Files (Choose one):</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-violet-50 p-4 rounded-lg">
                  <strong className="text-violet-700">pdb_id</strong>: PDB ID of the protein-ligand system (e.g., "1MWE")
                </div>
                <div className="bg-violet-50 p-4 rounded-lg">
                  <strong className="text-violet-700">pdb_file</strong>: Path to the PDB file (e.g., "/app/1mwe.pdb")
                </div>
              </div>
            </div>

            {/* System Components */}
            <div className="border-l-4 border-blue-400 pl-4">
              <h4 className="font-semibold text-gray-800 mb-2">System Components:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <strong className="text-blue-700">prot_chain_id</strong>: Chain ID of the protein (e.g., "A")
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <strong className="text-blue-700">lig_chain_id</strong>: Chain ID of the ligand (e.g., "A")
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <strong className="text-blue-700">lig_resid</strong>: Residue ID of the ligand (e.g., 1)
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <strong className="text-blue-700">lig_resname</strong>: Residue name of the ligand (e.g., "SIA")
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <strong className="text-blue-700">wat_chain_id</strong>: Chain ID of all water sites (e.g., "A")
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <strong className="text-blue-700">wat_resname</strong>: Residue name of all water sites (e.g., "HOH")
                </div>
              </div>
            </div>

            {/* Water Site Selection */}
            <div className="border-l-4 border-green-400 pl-4">
              <h4 className="font-semibold text-gray-800 mb-2">Water Site Selection (Choose one):</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <strong className="text-green-700">wat_sel_dist</strong>: Distance in Angstrom for water site selection (e.g., 5)
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <strong className="text-green-700">wat_sites</strong>: List of specific water sites (e.g., [A1326, A1327])
                </div>
              </div>
            </div>

            {/* Simulation Parameters */}
            <div className="border-l-4 border-orange-400 pl-4">
              <h4 className="font-semibold text-gray-800 mb-2">Key Simulation Parameters:</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-orange-50 p-4 rounded-lg">
                  <strong className="text-orange-700">output_folder</strong>: Directory for output files
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <strong className="text-orange-700">temperature</strong>: Simulation temperature (default: 300K)
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <strong className="text-orange-700">pressure</strong>: Simulation pressure (default: 1.0 bar)
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <strong className="text-orange-700">prod_steps</strong>: Production MD steps (default: 10000000)
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <strong className="text-orange-700">equil_steps</strong>: Equilibration steps (default: 500000)
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <strong className="text-orange-700">md_time_step</strong>: MD time step (default: 0.002 ps)
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> All water sites labelled with <strong>wat_chain_id</strong> and <strong>wat_resname</strong> are retained during system preparation and MD run. However, ABFE calculations are performed only for specific sites of interest.
            </p>
          </div>
        </div>

        {/* Usage */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="w-3 h-8 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full mr-4"></div>
            <h2 className="text-3xl font-bold text-gray-800">Usage</h2>
          </div>
          
          <div className="space-y-6">
            <div className="bg-emerald-50 border-l-4 border-emerald-400 p-6 rounded-r-lg">
              <h3 className="text-xl font-semibold text-emerald-800 mb-4">Building the pipeline:</h3>
              <p className="text-gray-700 mb-4">One time build of the necessary docker images containing OpenMM and SSTMap:</p>
              <div className="bg-gray-900 rounded-lg p-4">
                <code className="text-green-400 font-mono">make build-image</code>
              </div>
            </div>

            <div className="bg-teal-50 border-l-4 border-teal-400 p-6 rounded-r-lg">
              <h3 className="text-xl font-semibold text-teal-800 mb-4">Starting and stopping the pipeline:</h3>
              <p className="text-gray-700 mb-4">After editing the <code className="bg-teal-100 text-teal-900 px-2 py-1 rounded">setting.yml</code> file, run:</p>
              <div className="bg-gray-900 rounded-lg p-4 mb-4">
                <code className="text-green-400 font-mono">make start-pipeline</code>
              </div>
              <p className="text-gray-700 mb-4">To remove running containers:</p>
              <div className="bg-gray-900 rounded-lg p-4">
                <code className="text-green-400 font-mono">make stop-pipeline</code>
              </div>
            </div>
          </div>
        </div>

        {/* Output */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="w-3 h-8 bg-gradient-to-b from-cyan-500 to-blue-600 rounded-full mr-4"></div>
            <h2 className="text-3xl font-bold text-gray-800">Output</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-cyan-50 border-l-4 border-cyan-400 p-4 rounded-r-lg">
              <p className="text-gray-700">All OpenMM MD simulation files are saved in the folder specified by the <strong>output_folder</strong> parameter.</p>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
              <p className="text-gray-700">All GIST files from SSTMap are saved in the <code className="bg-blue-100 text-blue-900 px-2 py-1 rounded">SSTMap_GIST</code> sub-folder.</p>
            </div>
          </div>
        </div>

        {/* Documentation */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="w-3 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full mr-4"></div>
            <h2 className="text-3xl font-bold text-gray-800">Documentation</h2>
          </div>
          <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded-r-lg">
            <p className="text-gray-700">
              A detailed description of the pipeline's protocol and its output is available in the enclosed <code className="bg-indigo-100 text-indigo-900 px-2 py-1 rounded">documentation.pdf</code> file.
            </p>
          </div>
        </div>

        {/* Examples */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="w-3 h-8 bg-gradient-to-b from-pink-500 to-rose-600 rounded-full mr-4"></div>
            <h2 className="text-3xl font-bold text-gray-800">Examples</h2>
          </div>
          <p className="text-gray-700 mb-6">
            The <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded">examples</code> folder contains representative pipeline inputs and outputs for four different use cases:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-pink-50 border-l-4 border-pink-400 p-4 rounded-r-lg">
              <h4 className="font-semibold text-pink-800 mb-2">PDB IDs as input</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Specified water sites</li>
                <li>• Detected water sites</li>
              </ul>
            </div>
            <div className="bg-rose-50 border-l-4 border-rose-400 p-4 rounded-r-lg">
              <h4 className="font-semibold text-rose-800 mb-2">PDB files as input</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Specified water sites</li>
                <li>• Detected water sites</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Example MD runs were carried out for only 100 ps equilibration and 500 ps production to keep the examples folder lightweight for downloading.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default page;