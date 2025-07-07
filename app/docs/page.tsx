import React from 'react';

const Page = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 mt-14">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">'Water Thermodynamics' Pipeline</h1>
          <div className="flex flex-wrap items-center gap-6 text-lg text-gray-600">
            <span className="font-semibold">Documentation: Version 1</span>
            <span className="text-gray-400">•</span>
            <span>June 17, 2025</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        
        {/* Pipeline Description */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="w-3 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full mr-4"></div>
            <h2 className="text-3xl font-bold text-gray-800">Pipeline Description</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            The pipeline is an end-to-end automated setup to compute <strong className="text-indigo-600">'absolute binding free energies (ABFEs) of water sites in protein-ligand systems'</strong>. Broadly, the key steps in the process are: (i) OpenMM-based Molecular Dynamics (MD) simulation of the input 'protein-ligand system with water molecules', followed by (ii) SSTMap-based GIST calculation on the MD trajectory.
          </p>
        </div>

        {/* Protocol */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="w-3 h-8 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full mr-4"></div>
            <h2 className="text-3xl font-bold text-gray-800">Protocol</h2>
          </div>

          {/* Step 1: System preparation */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold mr-3">1</span>
              System preparation
            </h3>
            
            <div className="space-y-6">
              {/* 1a */}
              <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-r-lg">
                <h4 className="text-lg font-semibold text-green-800 mb-4">1a. Processing protein and all water molecules in the input 'holo' structure</h4>
                <div className="space-y-3">
                  <div className="bg-white p-4 rounded-lg border border-green-200">
                    <p className="text-gray-700">The protein and all the water molecules are extracted using Biopython based on the inputs in 'setting.yml'.</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-green-200">
                    <p className="text-gray-700">If a crystal structure is provided as input by specifying its PDB ID, PDBFixer finds the missing residues and fills them. It also adds Hydrogens to protein and the water molecules' Oxygen atoms.</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-green-200">
                    <p className="text-gray-700">Heteroatoms other than ligand and water molecules in the crystal structure are ignored.</p>
                  </div>
                </div>
                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800 font-semibold mb-2">Note:</p>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• PDBFixer only fills the missing residues in protein to ensure continuity of the 3D structure. It does not perform homology modeling of the added residues.</li>
                    <li>• If a PDB file is provided as input, the user must apriori fill the missing protein residues.</li>
                  </ul>
                </div>
              </div>

              {/* 1b */}
              <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
                <h4 className="text-lg font-semibold text-blue-800 mb-4">1b. Processing ligand in the input 'holo' structure</h4>
                <div className="space-y-3">
                  <div className="bg-white p-4 rounded-lg border border-blue-200">
                    <p className="text-gray-700">The ligand file is downloaded from the RCSB database in SDF format.</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-blue-200">
                    <p className="text-gray-700">OpenBabel adds Hydrogens appropriately assigning the pH-dependent protonation states.</p>
                  </div>
                </div>
              </div>

              {/* 1c */}
              <div className="bg-purple-50 border-l-4 border-purple-400 p-6 rounded-r-lg">
                <h4 className="text-lg font-semibold text-purple-800 mb-4">1c. Energy minimization</h4>
                <div className="bg-white p-4 rounded-lg border border-purple-200">
                  <p className="text-gray-700">The complex of protein, ligand, and water molecules is energy minimized in the vacuum (gas) phase employing OpenMM to prepare it for the subsequent molecular dynamics simulation.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright Notice */}
          <div className="bg-gray-100 border-l-4 border-gray-400 p-4 rounded-r-lg mb-8">
            <p className="text-sm text-gray-600 font-mono">
              Proprietary and confidential.<br />
              Copyright © 2017-25 Aganitha. All rights reserved.
            </p>
          </div>

          {/* Step 2: MD simulation */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold mr-3">2</span>
              Molecular Dynamics (MD) simulation
            </h3>
            
            <div className="space-y-6">
              {/* 2a */}
              <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
                <h4 className="text-lg font-semibold text-blue-800 mb-4">2a. Solvation and force field assignment</h4>
                <div className="space-y-3">
                  <div className="bg-white p-4 rounded-lg border border-blue-200">
                    <p className="text-gray-700">The prepared complex is centered in a periodic box of dimensions determined based on the user-specified padding distance in 'setting.yml' (default: 1.0 nm).</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-blue-200">
                    <p className="text-gray-700">It is solvated with water molecules. Counterions are added to set a user-specified physiological salt concentration in 'setting.yml' (default: 0.15 mol/L), and to ensure charge neutralization of the system.</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-blue-200">
                    <p className="text-gray-700 mb-3">The system components are represented with below force fields by default:</p>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <strong className="text-blue-800">Protein:</strong> AMBER ff14SB
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <strong className="text-blue-800">Ligand:</strong> OpenFF-2.2.0
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <strong className="text-blue-800">Ligand partial charges:</strong> AM1-BCC
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <strong className="text-blue-800">Water:</strong> TIP3P
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2b */}
              <div className="bg-teal-50 border-l-4 border-teal-400 p-6 rounded-r-lg">
                <h4 className="text-lg font-semibold text-teal-800 mb-4">2b. MD simulation procedure</h4>
                <div className="bg-white p-4 rounded-lg border border-teal-200 mb-4">
                  <p className="text-gray-700 mb-3">The full system is subjected to the following steps one-by-one:</p>
                  <div className="space-y-2">
                    <div className="bg-teal-50 p-3 rounded-lg">
                      <strong className="text-teal-800">1.</strong> Energy minimization
                    </div>
                    <div className="bg-teal-50 p-3 rounded-lg">
                      <strong className="text-teal-800">2.</strong> NVT equilibration and NPT equilibration – position restraints applied on heavy atoms of protein backbone, ligand, and water molecules
                    </div>
                    <div className="bg-teal-50 p-3 rounded-lg">
                      <strong className="text-teal-800">3.</strong> NVT production – position restraints applied on heavy atoms of protein backbone and ligand
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-yellow-800 font-semibold mb-2">Note:</p>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• MD parameters (time step, steps, intervals, temperature, pressure, force constants) can be set in 'setting.yml'</li>
                    <li>• During NVT equilibration, temperature is slowly ramped from 5 K to 300 K during the first 60% of the run</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-lg border border-teal-200">
                  <p className="text-gray-700">The NVT production trajectory is wrapped employing MDTraj.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: ABFE Calculations */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-bold mr-3">3</span>
              Calculating ABFEs of water sites
            </h3>
            
            <div className="space-y-6">
              {/* 3a */}
              <div className="bg-purple-50 border-l-4 border-purple-400 p-6 rounded-r-lg">
                <h4 className="text-lg font-semibold text-purple-800 mb-4">3a. GIST calculation</h4>
                <div className="space-y-3">
                  <div className="bg-white p-4 rounded-lg border border-purple-200">
                    <p className="text-gray-700">The 'run_gist' module of SSTMap is executed on the wrapped MD trajectory for GIST calculation.</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-purple-200">
                    <p className="text-gray-700">The GIST grid is centered on the ligand's center-of-mass and its dimensions are determined considering the user-defined padding distance of 10 Å around the ligand coordinates. This padding distance generally ensures the GIST grid includes the protein-ligand interfacial region containing the water sites of interest.</p>
                  </div>
                </div>
              </div>

              {/* Copyright Notice */}
              <div className="bg-gray-100 border-l-4 border-gray-400 p-4 rounded-r-lg">
                <p className="text-sm text-gray-600 font-mono">
                  Proprietary and confidential.<br />
                  Copyright © 2017-25 Aganitha. All rights reserved.
                </p>
              </div>

              {/* 3b */}
              <div className="bg-orange-50 border-l-4 border-orange-400 p-6 rounded-r-lg">
                <h4 className="text-lg font-semibold text-orange-800 mb-4">3b. Post-processing of GIST output</h4>
                <div className="space-y-3">
                  <div className="bg-white p-4 rounded-lg border border-orange-200">
                    <p className="text-gray-700">The water sites of interest for ABFE calculations are identified either from 'wat_sel_dist' or 'wat_sites' inputs in 'setting.yml'.</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-orange-200">
                    <p className="text-gray-700">The SSTMap GIST output is processed using GISTPP to sum up enthalpy (or energy) and T*entropy contributions over all voxels in the sphere of radius 2.5 Å around a water site's Oxygen atom to calculate the ABFE of that site.</p>
                  </div>
                </div>
                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800 font-semibold mb-2">Note:</p>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• Crystal structure water locations have uncertainty, and Hydrogens are typically not resolved</li>
                    <li>• Water coordinates are taken from post-energy minimization PDB ('md_energy_min.pdb') for more accurate positioning</li>
                    <li>• Calculated ABFE is associated with the site location, not the specific water molecule, as displacement can occur during simulation</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Files Generated */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="w-3 h-8 bg-gradient-to-b from-amber-500 to-orange-600 rounded-full mr-4"></div>
            <h2 className="text-3xl font-bold text-gray-800">Files generated during the pipeline</h2>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> The details provided here are representative examples, considering the case in which "1MWE" PDB ID is supplied as the input.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-4 font-semibold text-gray-800 border-b">File Name</th>
                  <th className="text-left p-4 font-semibold text-gray-800 border-b">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-mono text-blue-600">1MWE.pdb</td>
                  <td className="p-4 text-gray-700">PDB file of the holo complex either downloaded from RCSB or provided by the user</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-mono text-blue-600">prot_A_wat_A.pdb</td>
                  <td className="p-4 text-gray-700">Protein & crystal waters extracted from the input complex, using the user-specified 'chain ID' (e.g., "A")</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-mono text-blue-600">lig_A_1_SIA.pdb</td>
                  <td className="p-4 text-gray-700">Ligand extracted from the input complex, using the user-specified 'chain ID', 'residue name' & 'residue ID' (e.g., "A", "1", & "SIA", respectively)</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-mono text-blue-600">1mwe_F_SIA.sdf</td>
                  <td className="p-4 text-gray-700">Ligand SDF file downloaded from RCSB database</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-mono text-blue-600">1mwe_G_SIA.sdf</td>
                  <td className="p-4 text-gray-700">(OPTIONAL) A duplicate ligand SDF file downloaded from RCSB database. It is NOT used by the pipeline.</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-mono text-blue-600">prep_lig.sdf</td>
                  <td className="p-4 text-gray-700">Ligand file with Hydrogens</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-mono text-blue-600">prep_comp.pdb</td>
                  <td className="p-4 text-gray-700">Prepared complex: combined 'prot_A_wat_A.pdb' after it is subjected to PDBfixer and 'prep_lig.sdf'</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-mono text-blue-600">prep_min_comp.pdb</td>
                  <td className="p-4 text-gray-700">Complex obtained by energy minimizing 'prep_comp.pdb'</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-mono text-blue-600">prep_min_prot_wat.pdb</td>
                  <td className="p-4 text-gray-700">Protein & water molecules extracted from 'prep_min_comp.pdb'</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-mono text-blue-600">prep_min_lig.pdb</td>
                  <td className="p-4 text-gray-700">Ligand extracted from 'prep_min_comp.pdb'</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-mono text-blue-600">prep_min_lig.sdf</td>
                  <td className="p-4 text-gray-700">'prep_min_lig.pdb' converted into SDF format</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-mono text-blue-600">md_topology.xml</td>
                  <td className="p-4 text-gray-700">OpenMM-compatible 'xml' file containing the topology and parameters of the full system. It is created by OpenMM.</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-mono text-blue-600">md_topology.top</td>
                  <td className="p-4 text-gray-700">GROMACS-compatible 'top' file containing the topology and parameters of the full system. It is an essential input for the SSTMap 'run_gist' module and is created using ParmEd.</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-mono text-blue-600">md_inp_full_sys.gro</td>
                  <td className="p-4 text-gray-700">GROMACS-compatible coordinate file of the full system. It is an essential input for the SSTMap 'run_gist' module and is created using ParmEd.</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-mono text-blue-600">md_inp_full_sys.pdb</td>
                  <td className="p-4 text-gray-700">PDB file of the full system created after solvation, which is used as input for the MD protocol ('Step 2b' described above).</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-mono text-blue-600">md_*</td>
                  <td className="p-4 text-gray-700">Files generated during the MD protocol. The filenames are self-explanatory.</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-mono text-blue-600">sys_prep_and_openmm_md.log</td>
                  <td className="p-4 text-gray-700">Log file with system preparation and MD protocol details</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-mono text-blue-600">processed_aligned_nvt_prod.xtc</td>
                  <td className="p-4 text-gray-700">Wrapped MD production run trajectory</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-mono text-blue-600">sstmap_*</td>
                  <td className="p-4 text-gray-700">Files generated by the SSTMap GIST calculation</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-mono text-blue-600">sstmap_gist.log</td>
                  <td className="p-4 text-gray-700">Log file with the SSTMap GIST calculation details</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-mono text-blue-600">gist_*</td>
                  <td className="p-4 text-gray-700">Files generated by the GISTPP step</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-mono text-blue-600">gistpp.log</td>
                  <td className="p-4 text-gray-700">Log file with the GISTPP step details</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-mono text-blue-600">*.dx</td>
                  <td className="p-4 text-gray-700">All .dx files generated by the SSTMap GIST calculation & GISTPP step</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-mono text-blue-600">wat_site_*</td>
                  <td className="p-4 text-gray-700">Coordinate files of water molecules at the sites of interest, taken from 'md_energy_min.pdb'</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-mono text-blue-600">vmd_visuals.vmd</td>
                  <td className="p-4 text-gray-700">System-specific ".vmd" file created to visualize the protein, ligand, and water sites for which ABFEs are calculated</td>
                </tr>
                <tr className="hover:bg-gray-50 bg-green-50">
                  <td className="p-4 font-mono text-green-600 font-bold">wat_FE_summary.dat</td>
                  <td className="p-4 text-gray-700 font-semibold">Summary file with the ABFE value (along with the enthalpy & T*entropy break-up) for each water site of interest</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* VMD Representations */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="w-3 h-8 bg-gradient-to-b from-teal-500 to-cyan-600 rounded-full mr-4"></div>
            <h2 className="text-3xl font-bold text-gray-800">Representations in 'vmd_visuals.vmd'</h2>
          </div>

          <div className="space-y-6">
            {/* Mol ID 0 */}
            <div className="bg-teal-50 border-l-4 border-teal-400 p-6 rounded-r-lg">
              <h4 className="text-lg font-semibold text-teal-800 mb-4">Mol ID 0:</h4>
              <div className="space-y-3">
                <div className="bg-white p-4 rounded-lg border border-teal-200">
                  <p className="text-gray-700">The input holo complex either downloaded from RCSB or provided by the user.</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-teal-200">
                  <p className="text-gray-700">This structure serves as the reference for the input locations of the water sites of interest for ABFE calculations.</p>
                </div>
              </div>
            </div>

            {/* Mol ID 1 */}
            <div className="bg-cyan-50 border-l-4 border-cyan-400 p-6 rounded-r-lg">
              <h4 className="text-lg font-semibold text-cyan-800 mb-4">Mol ID 1:</h4>
              <div className="space-y-3">
                <div className="bg-white p-4 rounded-lg border border-cyan-200">
                  <p className="text-gray-700">The wrapped MD production run trajectory ('processed_aligned_nvt_prod.xtc') loaded on top of the PDB file of the energy minimized full system ('md_energy_min.pdb').</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-cyan-200">
                  <p className="text-gray-700">The structural and interaction dynamics at the water sites of interest can be visualized from this trajectory.</p>
                </div>
              </div>
            </div>

                     {/* Color Scheme */}
            <div className="bg-violet-50 border-l-4 border-violet-400 p-6 rounded-r-lg">
              <h4 className="text-lg font-semibold text-violet-800 mb-4">Color scheme:</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-violet-100">
                      <th className="text-left p-4 font-semibold text-violet-800 border-b">Atoms</th>
                      <th className="text-left p-4 font-semibold text-violet-800 border-b">In Mol ID 0</th>
                      <th className="text-left p-4 font-semibold text-violet-800 border-b">In Mol ID 1</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-violet-200">
                    <tr className="hover:bg-violet-50">
                      <td className="p-4 text-gray-700">Protein chain of interest</td>
                      <td className="p-4 font-mono text-sm">NewCartoon, white</td>
                      <td className="p-4 font-mono text-sm">NewCartoon, yellow</td>
                    </tr>
                    <tr className="hover:bg-violet-50">
                      <td className="p-4 text-gray-700">Pocket residues</td>
                      <td className="p-4 font-mono text-sm">CPK, colored by 'Name'</td>
                      <td className="p-4 font-mono text-sm">Licorice, colored by 'Name'</td>
                    </tr>
                    <tr className="hover:bg-violet-50">
                      <td className="p-4 text-gray-700">Ligand from the chain of interest</td>
                      <td className="p-4 font-mono text-sm">CPK, colored by 'Name'</td>
                      <td className="p-4 font-mono text-sm">Licorice, colored by 'Name'</td>
                    </tr>
                    <tr className="hover:bg-violet-50">
                      <td className="p-4 text-gray-700">All water molecules</td>
                      <td className="p-4 font-mono text-sm">CPK, iceblue</td>
                      <td className="p-4 font-mono text-sm">Licorice, iceblue</td>
                    </tr>
                    <tr className="hover:bg-violet-50">
                      <td className="p-4 text-gray-700">Water molecules at sites of interest</td>
                      <td className="p-4 font-mono text-sm">CPK, orange2</td>
                      <td className="p-4 font-mono text-sm">Licorice, orange2</td>
                    </tr>
                    <tr className="hover:bg-violet-50">
                      <td className="p-4 text-gray-700">Other water molecules in the vicinity of the sites of interest</td>
                      <td className="p-4 font-mono text-sm">---</td>
                      <td className="p-4 font-mono text-sm">CPK, cyan2</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4 bg-white p-4 rounded-lg border border-violet-200">
                <p className="text-gray-700">
                  The remaining 5 hidden representations in Mol ID 1 are placeholders, meant for visualizing
                  interactions of each site of interest with protein, ligand, and water in the neighborhood. To that
                  end, the 'dummy' residue ID and Oxygen coordinates in these representations must be
                  replaced with those corresponding to a site of interest (as in 'md_energy_min.pdb').
                </p>
              </div>
            </div>

            {/* Copyright Notice */}
            <div className="bg-gray-100 border-l-4 border-gray-400 p-4 rounded-r-lg">
              <p className="text-sm text-gray-600 font-mono">
                Proprietary and confidential.<br />
                Copyright © 2017-25 Aganitha. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;