import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Info,
  Upload,
  Database,
  LogIn,
  Atom,
  Zap,
  Droplets,
  Gauge,
  Grid3x3,
  FolderArchive,
  ChevronLeft,
  ChevronRight,
  Rocket,
} from 'lucide-react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Progress } from '@/components/ui/progress';

const formSchema = z.object({
  pdb_id: z.string().optional(),
  pdb_file: z.custom<File | undefined>((val) => val === undefined || (typeof File !== 'undefined' && val instanceof File), {
    message: 'PDB File must be a valid file',
  }).optional(),
  prot_chain_id: z.string().min(1, 'Protein Chain ID is required'),
  lig_chain_id: z.string().min(1, 'Ligand Chain ID is required'),
  lig_resid: z.number().min(1, 'Ligand Residue ID must be at least 1'),
  lig_resname: z.string().min(1, 'Ligand Residue Name is required'),
  wat_chain_id: z.string().min(1, 'Water Chain ID is required'),
  wat_resname: z.string().min(1, 'Water Residue Name is required'),
  prot_force_field: z.string().min(1, 'Protein Force Field is required'),
  lig_force_field: z.string().min(1, 'Ligand Force Field is required'),
  lig_partial_charges: z.string().min(1, 'Ligand Partial Charges is required'),
  wat_model: z.string().min(1, 'Water Model is required'),
  solvate: z.boolean(),
  PBC_box_padding: z.number().min(0.1, 'PBC Box Padding must be at least 0.1 nm').max(5, 'PBC Box Padding must be at most 5 nm'),
  salt_conc: z.number().min(0, 'Salt Concentration must be non-negative').max(1, 'Salt Concentration must be ≤ 1M'),
  positive_ion: z.string().optional(),
  negative_ion: z.string().optional(),
  neutralize: z.boolean(),
  friction_coeff: z.number().min(0.1, 'Friction Coefficient must be at least 0.1 ps⁻¹').max(10, 'Friction Coefficient must be at most 10 ps⁻¹'),
  md_time_step: z.number().min(0.001, 'MD Time Step must be at least 0.001 ps').max(0.004, 'MD Time Step must be at most 0.004 ps'),
  harmonic_restr_k: z.number().min(100, 'Harmonic Restraint K must be at least 100 kJ/(mol·nm²)').max(5000, 'Harmonic Restraint K must be at most 5000 kJ/(mol·nm²)'),
  pressure: z.number().min(0.5, 'Pressure must be at least 0.5 bar').max(2, 'Pressure must be at most 2 bar'),
  temperature: z.number().min(273, 'Temperature must be at least 273 K').max(373, 'Temperature must be at most 373 K'),
  dump_interval: z.number().min(100, 'Dump Interval must be at least 100 steps').max(10000, 'Dump Interval must be at most 10000 steps'),
  equil_steps: z.number().min(1000, 'Equilibration Steps must be at least 1000').max(1000000, 'Equilibration Steps must be at most 1,000,000'),
  prod_steps: z.number().min(1000, 'Production Steps must be at least 1000').max(5000000, 'Production Steps must be at most 5,000,000'),
  grid_box_padding: z.number().min(0.5, 'Grid Box Padding must be at least 0.5 Å').max(5, 'Grid Box Padding must be at most 5 Å'),
  wat_num_dens: z.number().min(0.01, 'Water Number Density must be at least 0.01 mol/Å³').max(0.05, 'Water Number Density must be at most 0.05 mol/Å³'),
  wat_sites: z.string().optional(),
  wat_sel_dist: z.number().min(1, 'Water Selection Distance must be at least 1 Å').max(10, 'Water Selection Distance must be at most 10 Å').optional(),
  output_folder: z.string().min(1, 'Output Folder is required').max(50, 'Output Folder must be 50 characters or less'),
  output_prefix: z.string().min(1, 'Output Prefix is required').max(20, 'Output Prefix must be 20 characters or less'),
}).refine((data) => data.pdb_id || data.pdb_file !== undefined, {
  message: 'Either PDB ID or PDB File is required',
  path: ['pdb_id'],
}).refine((data) => (data.wat_sites && !data.wat_sel_dist) || (!data.wat_sites && data.wat_sel_dist), {
  message: 'Please provide only one of Water Sites or Water Selection Distance',
  path: ['wat_sites'],
});

interface PipelineFormProps {
  onSubmit: (formData: FormData) => void;
   isRunning: boolean;

}

export default function PipelineForm({ onSubmit , isRunning }: PipelineFormProps) {
  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pdb_id: '1LPG',
      prot_chain_id: 'A',
      lig_chain_id: 'A',
      lig_resid: 301,
      lig_resname: 'IMA',
      wat_chain_id: 'A',
      wat_resname: 'HOH',
      prot_force_field: 'amber/ff14SB.xml',
      lig_force_field: 'openff-2.2.0',
      lig_partial_charges: 'am1bcc',
      wat_model: 'tip3p',
      solvate: true,
      PBC_box_padding: 1.0,
      salt_conc: 0.15,
      positive_ion: 'Na+',
      negative_ion: 'Cl-',
      neutralize: true,
      friction_coeff: 1.0,
      md_time_step: 0.002,
      harmonic_restr_k: 1000,
      pressure: 1.0,
      temperature: 300,
      dump_interval: 1000,
      equil_steps: 25000,
      prod_steps: 25000,
      grid_box_padding: 1.0,
      wat_num_dens: 0.0329,
      wat_sites: 'B473',
      output_folder: '1mwe_wat_thermo',
      output_prefix: 'md',
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    trigger,
    setValue,
    getValues,
  } = methods;

  const [activeTab, setActiveTab] = useState('input');
  const [pdbSource, setPdbSource] = useState<'id' | 'file'>('id');
  const [pdbFile, setPdbFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pdbId, setPdbId] = useState(methods.getValues('pdb_id') || '');
  const [waterSelection, setWaterSelection] = useState<'wat_sites' | 'wat_sel_dist'>('wat_sites');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pdbIdValue = watch('pdb_id');

  // Dynamic defaults for 1LPG
  React.useEffect(() => {
    if (pdbIdValue === '1LPG') {
      setValue('lig_resname', 'IMA', { shouldValidate: true });
      setValue('lig_resid', 301, { shouldValidate: true });
      setValue('wat_sites', 'B473', { shouldValidate: true });
      setValue('prot_chain_id', 'B', { shouldValidate: true });
      setValue('lig_chain_id', 'B', { shouldValidate: true });
      setValue('wat_chain_id', 'B', { shouldValidate: true });
    } else {
      setValue('lig_resname', 'SIA', { shouldValidate: true });
      setValue('lig_resid', 1, { shouldValidate: true });
      setValue('wat_sites', 'A1326,A1327', { shouldValidate: true });
      setValue('prot_chain_id', 'A', { shouldValidate: true });
      setValue('lig_chain_id', 'A', { shouldValidate: true });
      setValue('wat_chain_id', 'A', { shouldValidate: true });
    }
  }, [pdbIdValue, setValue]);

  const tabs = [
    { id: 'input', name: 'Input', icon: LogIn },
    { id: 'specifications', name: 'Specifications', icon: Atom },
    { id: 'force-fields', name: 'Force Fields', icon: Zap },
    { id: 'solvation', name: 'Solvation', icon: Droplets },
    { id: 'md-parameters', name: 'MD Parameters', icon: Gauge },
    { id: 'gist-inputs', name: 'GIST', icon: Grid3x3 },
    { id: 'output', name: 'Output', icon: FolderArchive },
  ];

  const forceFieldOptions = {
    protein: ['amber/ff14SB.xml', 'amber/ff99SB.xml', 'amber/ff99SBildn.xml', 'charmm/charmm36_protein.xml'],
    ligand: ['openff-2.2.0', 'openff-2.1.0', 'openff-2.2.1', 'openff-1.2.0', 'openff-1.3.0', 'openff-1.3.1'],
    charges: ['am1bcc', 'gasteiger', 'am1-mulliken'],
    water: ['tip3p', 'spce', 'tip3pfb', 'tip4pew', 'tip4pfb'],
  };

  const onSubmitHandler = async (data: any) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      if (pdbSource === 'id') formData.append('pdb_id', data.pdb_id);
      if (pdbFile) formData.append('pdb_file', pdbFile);
      for (const [key, value] of Object.entries(data)) {
        if (value && key !== 'pdb_id' && key !== 'pdb_file') {
          formData.append(key, value.toString());
        }
      }
      await onSubmit(formData);
    } catch (err) {
      setError('Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (currentIndex < tabs.length - 1) {
      let isValid = false;
      switch (activeTab) {
        case 'input':
          isValid = await trigger(['pdb_id', 'pdb_file']);
          break;
        case 'specifications':
          isValid = await trigger(['prot_chain_id', 'lig_chain_id', 'lig_resid', 'lig_resname', 'wat_chain_id', 'wat_resname']);
          break;
        case 'force-fields':
          isValid = await trigger(['prot_force_field', 'lig_force_field', 'lig_partial_charges', 'wat_model']);
          break;
        case 'solvation':
          isValid = await trigger(['solvate', 'PBC_box_padding', 'salt_conc', 'positive_ion', 'negative_ion', 'neutralize']);
          break;
        case 'md-parameters':
          isValid = await trigger(['friction_coeff', 'md_time_step', 'harmonic_restr_k', 'pressure', 'temperature', 'dump_interval', 'equil_steps', 'prod_steps']);
          break;
        case 'gist-inputs':
          isValid = await trigger(['grid_box_padding', 'wat_num_dens', 'wat_sites', 'wat_sel_dist']);
          break;
        case 'output':
          isValid = await trigger(['output_folder', 'output_prefix']);
          break;
      }
      if (isValid) {
        setError(null);
        setActiveTab(tabs[currentIndex + 1].id);
      } else {
        setError('Please fix the errors in the current tab before proceeding');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handlePrevious = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id);
    }
  };

  const currentTabIndex = tabs.findIndex(tab => tab.id === activeTab);
  const progress = ((currentTabIndex + 1) / tabs.length) * 100;

  return (
    <FormProvider {...methods}>
      <Card className="w-full max-w-6xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">Molecular Dynamics Simulation Setup</CardTitle>
          <CardDescription className="text-muted-foreground">
            Configure your simulation parameters step by step
          </CardDescription>
          <Progress value={progress} className="h-2 mt-4" />
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmitHandler)}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="flex w-full justify-between px-0 h-12">
                {tabs.map((tab) => (
                  <TabsTrigger 
                    key={tab.id} 
                    value={tab.id} 
                    className="flex flex-col items-center justify-center gap-0.5 h-full py-1 px-1 text-xs relative"
                  >
                    <tab.icon className="h-4 w-4" />
                    <span>{tab.name}</span>
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <TabsContent value="input" className="mt-6 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Input Structure</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <div>
                        <Label className="text-sm font-medium mb-3 block">
                          Protein Structure Input (Mandatory)
                        </Label>
                        <div className="flex bg-muted rounded-lg p-1 mb-4">
                          <Button
                            type="button"
                            variant={pdbSource === 'file' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setPdbSource('file')}
                            className="flex-1"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload PDB File
                          </Button>
                          <Button
                            type="button"
                            variant={pdbSource === 'id' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setPdbSource('id')}
                            className="flex-1"
                          >
                            <Database className="h-4 w-4 mr-2" />
                            PDB ID
                          </Button>
                        </div>
{pdbSource === 'file' ? (
  <div>
    <div className="flex items-center gap-2 mb-2">
      <Label>Upload PDB File *</Label>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="h-4 w-4 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Upload a PDB file from your local system</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
    
    <div 
      onClick={() => document.getElementById('pdb-upload')?.click()}
      className="border-dashed border-2 border-gray-300 p-4 rounded-md text-center cursor-pointer hover:bg-gray-50 transition-colors"
    >
      <input
        id="pdb-upload"
        type="file"
        accept=".pdb"
        onChange={(e) => {
          const file = e.target.files?.[0];
          setPdbFile(file || null);
          setValue('pdb_file', file ?? undefined, { shouldValidate: true });
        }}
        className="hidden"
      />
      <p className="text-gray-600">
        {pdbFile ? (
          <span className="font-medium text-primary">{pdbFile.name}</span>
        ) : (
          "Drag & drop or click to upload PDB file"
        )}
      </p>
      {!pdbFile && (
        <p className="text-xs text-muted-foreground mt-1">Supports .pdb format</p>
      )}
      {errors.pdb_file && (
        <p className="text-red-600 text-sm mt-2">{errors.pdb_file.message}</p>
      )}
    </div>
  </div>
) : (
                          <div>
                            <div className="flex items-center gap-2">
                              <Label>PDB ID *</Label>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="h-4 w-4 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Enter a valid PDB ID from the RCSB database</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <Input
                              {...register('pdb_id')}
                              value={pdbId}
                              onChange={(e) => setPdbId(e.target.value)}
                              placeholder="Enter PDB ID (e.g., 1MWE or 1LPG)"
                              className="mt-1"
                            />
                            {errors.pdb_id && (
                              <p className="text-red-600 text-sm mt-1">{errors.pdb_id.message}</p>
                            )}
                            {pdbId && (
                              <p className="text-sm text-muted-foreground mt-1">
                                Example structures: 1LPG (lysozyme), 1MWE (neuraminidase)
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="specifications" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">System Specifications</CardTitle>
                    <CardDescription>
                      Define the protein, ligand, and water components of your system
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Protein Chain ID *</Label>
                        <Input {...register('prot_chain_id')} className="mt-1" placeholder='A' />
                        {errors.prot_chain_id && (
                          <p className="text-red-600 text-sm mt-1">{errors.prot_chain_id.message}</p>
                        )}
                      </div>
                      <div>
                        <Label>Ligand Chain ID *</Label>
                        <Input {...register('lig_chain_id')} className="mt-1"  placeholder='A'/>
                        {errors.lig_chain_id && (
                          <p className="text-red-600 text-sm mt-1">{errors.lig_chain_id.message}</p>
                        )}
                      </div>
                      <div>
                        <Label>Ligand Residue ID *</Label>
                        <Input
                          type="number"
                          {...register('lig_resid', { valueAsNumber: true })}
                          className="mt-1"
                          placeholder="301"
                        />
                        {errors.lig_resid && (
                          <p className="text-red-600 text-sm mt-1">{errors.lig_resid.message}</p>
                        )}
                      </div>
                      <div>
                        <Label>Ligand Residue Name *</Label>
                        <Input {...register('lig_resname')} className="mt-1" placeholder='IMA' />
                        {errors.lig_resname && (
                          <p className="text-red-600 text-sm mt-1">{errors.lig_resname.message}</p>
                        )}
                      </div>
                      <div>
                        <Label>Water Chain ID *</Label>
                        <Input {...register('wat_chain_id')} className="mt-1" placeholder='A' />
                        {errors.wat_chain_id && (
                          <p className="text-red-600 text-sm mt-1">{errors.wat_chain_id.message}</p>
                        )}
                      </div>
                      <div>
                        <Label>Water Residue Name *</Label>
                        <Input {...register('wat_resname')} className="mt-1" placeholder='HOH' />
                        {errors.wat_resname && (
                          <p className="text-red-600 text-sm mt-1">{errors.wat_resname.message}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="force-fields" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Force Field Parameters</CardTitle>
                    <CardDescription>
                      Select the appropriate force fields for your system components
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Protein Force Field *</Label>
                        <Select
                          value={watch('prot_force_field')}
                          onValueChange={(val) => setValue('prot_force_field', val, { shouldValidate: true })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {forceFieldOptions.protein.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.prot_force_field && (
                          <p className="text-red-600 text-sm mt-1">{errors.prot_force_field.message}</p>
                        )}
                      </div>
                      <div>
                        <Label>Ligand Force Field *</Label>
                        <Select
                          value={watch('lig_force_field')}
                          onValueChange={(val) => setValue('lig_force_field', val, { shouldValidate: true })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {forceFieldOptions.ligand.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.lig_force_field && (
                          <p className="text-red-600 text-sm mt-1">{errors.lig_force_field.message}</p>
                        )}
                      </div>
                      <div>
                        <Label>Ligand Partial Charges *</Label>
                        <Select
                          value={watch('lig_partial_charges')}
                          onValueChange={(val) => setValue('lig_partial_charges', val, { shouldValidate: true })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {forceFieldOptions.charges.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.lig_partial_charges && (
                          <p className="text-red-600 text-sm mt-1">{errors.lig_partial_charges.message}</p>
                        )}
                      </div>
                      <div>
                        <Label>Water Model *</Label>
                        <Select
                          value={watch('wat_model')}
                          onValueChange={(val) => setValue('wat_model', val, { shouldValidate: true })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {forceFieldOptions.water.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.wat_model && (
                          <p className="text-red-600 text-sm mt-1">{errors.wat_model.message}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="solvation" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Solvation Parameters</CardTitle>
                    <CardDescription>
                      Configure the solvation and ion parameters for your system
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch id="solvate" {...register('solvate')} defaultChecked />
                        <Label htmlFor="solvate">Solvate System</Label>
                        {errors.solvate && (
                          <p className="text-red-600 text-sm mt-1">{errors.solvate.message}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="neutralize" {...register('neutralize')} defaultChecked />
                        <Label htmlFor="neutralize">Neutralize System</Label>
                        {errors.neutralize && (
                          <p className="text-red-600 text-sm mt-1">{errors.neutralize.message}</p>
                        )}
                      </div>
                      <div>
                        <Label>PBC Box Padding (nm) *</Label>
                        <Input
                          type="number"
                          step="0.1"
                          {...register('PBC_box_padding', { valueAsNumber: true })}
                          className="mt-1"
                        />
                        {errors.PBC_box_padding && (
                          <p className="text-red-600 text-sm mt-1">{errors.PBC_box_padding.message}</p>
                        )}
                      </div>
                      <div>
                        <Label>Salt Concentration (M) *</Label>
                        <Input
                          type="number"
                          step="0.01"
                          {...register('salt_conc', { valueAsNumber: true })}
                          className="mt-1"
                        />
                        {errors.salt_conc && (
                          <p className="text-red-600 text-sm mt-1">{errors.salt_conc.message}</p>
                        )}
                      </div>
                      <div>
                        <Label>Positive Ion</Label>
                        <Input {...register('positive_ion')} className="mt-1" />
                        {errors.positive_ion && (
                          <p className="text-red-600 text-sm mt-1">{errors.positive_ion.message}</p>
                        )}
                      </div>
                      <div>
                        <Label>Negative Ion</Label>
                        <Input {...register('negative_ion')} className="mt-1" />
                        {errors.negative_ion && (
                          <p className="text-red-600 text-sm mt-1">{errors.negative_ion.message}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="md-parameters" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Molecular Dynamics Parameters</CardTitle>
                    <CardDescription>
                      Configure the parameters for your MD simulation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Friction Coefficient (ps⁻¹) *</Label>
                        <Input
                          type="number"
                          step="0.1"
                          {...register('friction_coeff', { valueAsNumber: true })}
                          className="mt-1"
                        />
                        {errors.friction_coeff && (
                          <p className="text-red-600 text-sm mt-1">{errors.friction_coeff.message}</p>
                        )}
                      </div>
                      <div>
                        <Label>MD Time Step (ps) *</Label>
                        <Input
                          type="number"
                          step="0.001"
                          {...register('md_time_step', { valueAsNumber: true })}
                          className="mt-1"
                        />
                        {errors.md_time_step && (
                          <p className="text-red-600 text-sm mt-1">{errors.md_time_step.message}</p>
                        )}
                      </div>
                      <div>
                        <Label>Harmonic Restraint K (kJ/(mol·nm²)) *</Label>
                        <Input
                          type="number"
                          {...register('harmonic_restr_k', { valueAsNumber: true })}
                          className="mt-1"
                        />
                        {errors.harmonic_restr_k && (
                          <p className="text-red-600 text-sm mt-1">{errors.harmonic_restr_k.message}</p>
                        )}
                      </div>
                      <div>
                        <Label>Pressure (bar) *</Label>
                        <Input
                          type="number"
                          step="0.1"
                          {...register('pressure', { valueAsNumber: true })}
                          className="mt-1"
                        />
                        {errors.pressure && (
                          <p className="text-red-600 text-sm mt-1">{errors.pressure.message}</p>
                        )}
                      </div>
                      <div>
                        <Label>Temperature (K) *</Label>
                        <Input
                          type="number"
                          {...register('temperature', { valueAsNumber: true })}
                          className="mt-1"
                        />
                        {errors.temperature && (
                          <p className="text-red-600 text-sm mt-1">{errors.temperature.message}</p>
                        )}
                      </div>
                      <div>
                        <Label>Dump Interval (steps) *</Label>
                        <Input
                          type="number"
                          {...register('dump_interval', { valueAsNumber: true })}
                          className="mt-1"
                        />
                        {errors.dump_interval && (
                          <p className="text-red-600 text-sm mt-1">{errors.dump_interval.message}</p>
                        )}
                      </div>
                      <div>
                        <Label>Equilibration Steps *</Label>
                        <Input
                          type="number"
                          {...register('equil_steps', { valueAsNumber: true })}
                          className="mt-1"
                        />
                        {errors.equil_steps && (
                          <p className="text-red-600 text-sm mt-1">{errors.equil_steps.message}</p>
                        )}
                      </div>
                      <div>
                        <Label>Production Steps *</Label>
                        <Input
                          type="number"
                          {...register('prod_steps', { valueAsNumber: true })}
                          className="mt-1"
                        />
                        {errors.prod_steps && (
                          <p className="text-red-600 text-sm mt-1">{errors.prod_steps.message}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="gist-inputs" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">GIST Analysis Parameters</CardTitle>
                    <CardDescription>
                      Configure parameters for Grid Inhomogeneous Solvation Theory (GIST) analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Grid Box Padding (Å) *</Label>
                        <Input
                          type="number"
                          step="0.1"
                          {...register('grid_box_padding', { valueAsNumber: true })}
                          className="mt-1"
                        />
                        {errors.grid_box_padding && (
                          <p className="text-red-600 text-sm mt-1">{errors.grid_box_padding.message}</p>
                        )}
                      </div>
                      <div>
                        <Label>Water Number Density (mol/Å³) *</Label>
                        <div className="relative">
                          <Input
                            type="number"
                            step="0.0001"
                            {...register('wat_num_dens', { valueAsNumber: true })}
                            className="mt-1"
                          />
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info
                                  className="absolute right-2 top-3 h-4 w-4 text-muted-foreground cursor-help"
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>The bulk water number density is dependent on the water model:</p>
                                <ul className="list-disc pl-4 mt-1">
                                  <li>TIP3P = 0.0329</li>
                                  <li>SPC/E = 0.0333</li>
                                  <li>TIP3P-FB ≈ 0.0334</li>
                                  <li>TIP4P-Ew = 0.0332</li>
                                  <li>TIP4P-DB = 0.0332</li>
                                </ul>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        {errors.wat_num_dens && (
                          <p className="text-red-600 text-sm mt-1">{errors.wat_num_dens.message}</p>
                        )}
                      </div>
                      <div className="md:col-span-2">
                        <Label>Water Selection Method *</Label>
                        <div className="flex space-x-4 mt-1">
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="wat_sites"
                              checked={waterSelection === 'wat_sites'}
                              onChange={() => {
                                setWaterSelection('wat_sites');
                                setValue('wat_sel_dist', undefined, { shouldValidate: true });
                                setValue('wat_sites', 'B473', { shouldValidate: true });
                              }}
                              className="h-4 w-4 text-primary"
                            />
                            <Label htmlFor="wat_sites">Water Sites</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="wat_sel_dist"
                              checked={waterSelection === 'wat_sel_dist'}
                              onChange={() => {
                                setWaterSelection('wat_sel_dist');
                                setValue('wat_sel_dist', 5.0, { shouldValidate: true });
                                setValue('wat_sites', undefined, { shouldValidate: true });
                              }}
                              className="h-4 w-4 text-primary"
                            />
                            <Label htmlFor="wat_sel_dist">Water Selection Distance</Label>
                          </div>
                        </div>
                        {errors.wat_sites && (
                          <p className="text-red-600 text-sm mt-1">{errors.wat_sites.message}</p>
                        )}
                        {errors.wat_sel_dist && (
                          <p className="text-red-600 text-sm mt-1">{errors.wat_sel_dist.message}</p>
                        )}
                      </div>
                      {waterSelection === 'wat_sites' && (
                        <div className="md:col-span-2">
                          <Label>Water Sites (comma-separated, e.g., A1326,A1327) *</Label>
                          <Input
                            type="text"
                            {...register('wat_sites')}
                            className="mt-1"
                          />
                        </div>
                      )}
                      {waterSelection === 'wat_sel_dist' && (
                        <div>
                          <Label>Water Selection Distance (Å) *</Label>
                          <Input
                            type="number"
                            step="0.1"
                            {...register('wat_sel_dist', { valueAsNumber: true })}
                            className="mt-1"
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="output" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Output Configuration</CardTitle>
                    <CardDescription>
                      Configure the output settings for your simulation results
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Output Folder *</Label>
                        <Input
                          type="text"
                          {...register('output_folder')}
                          placeholder="Enter output folder name"
                          className="mt-1"
                        />
                        {errors.output_folder && (
                          <p className="text-red-600 text-sm mt-1">{errors.output_folder.message}</p>
                        )}
                      </div>
                      <div>
                        <Label>Output Prefix *</Label>
                        <Input
                          type="text"
                          {...register('output_prefix')}
                          placeholder="Enter output file prefix"
                          className="mt-1"
                        />
                        {errors.output_prefix && (
                          <p className="text-red-600 text-sm mt-1">{errors.output_prefix.message}</p>
                        )}
                      </div>
                    </div>

                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 font-medium">{error}</p>
              </div>
            )}

            <div className="flex justify-between mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentTabIndex === 0}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              {currentTabIndex === tabs.length - 1 ? (
                <Button
                  type="button"
                  onClick={handleSubmit(onSubmitHandler)}
                  disabled={isRunning}
                  className="gap-1 bg-green-600 hover:bg-green-700"
                >
                  {isRunning ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Running...
                    </>
                  ) : (
                    <>
                      <Rocket className="h-4 w-4" />
                      Run Simulation
                    </>
                  )}
                </Button>
              ) : (
                <Button 
                  type="button" 
                  onClick={handleNext}
                  className="gap-1"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </FormProvider>
  );
}