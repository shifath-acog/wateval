import React, { useState, FormEvent } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
} from 'lucide-react';
import { useForm, useFieldArray, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const formSchema = z.object({
  pdb_id: z.string().optional(),
  pdb_file: z.custom<File | undefined>((val) => val === undefined || (typeof File !== 'undefined' && val instanceof File), {
    message: 'PDB File must be a valid file',
  }).optional(),
  prot_chain_id: z.string().min(1, 'Protein Chain ID is required'),
  lig_chain_id: z.string().min(1, 'Ligand Chain ID is required'),
  lig_resid: z.number().min(1, 'Ligand Residue ID is required'),
  lig_resname: z.string().min(1, 'Ligand Residue Name is required'),
  wat_chain_id: z.string().min(1, 'Water Chain ID is required'),
  wat_resname: z.string().min(1, 'Water Residue Name is required'),
  prot_force_field: z.string().min(1, 'Protein Force Field is required'),
  lig_force_field: z.string().min(1, 'Ligand Force Field is required'),
  lig_partial_charges: z.string().min(1, 'Ligand Partial Charges is required'),
  wat_model: z.string().min(1, 'Water Model is required'),
  solvate: z.boolean(),
  PBC_box_padding: z.number().min(0, 'PBC Box Padding must be non-negative'),
  salt_conc: z.number().min(0, 'Salt Concentration must be non-negative'),
  positive_ion: z.string().optional(),
  negative_ion: z.string().optional(),
  neutralize: z.boolean(),
  friction_coeff: z.number().min(0, 'Friction Coefficient must be non-negative'),
  md_time_step: z.number().min(0, 'MD Time Step must be non-negative'),
  harmonic_restr_k: z.number().min(0, 'Harmonic Restraint K must be non-negative'),
  pressure: z.number().min(0, 'Pressure must be non-negative'),
  temperature: z.number().min(0, 'Temperature must be non-negative'),
  dump_interval: z.number().min(0, 'Dump Interval must be non-negative'),
  equil_steps: z.number().min(0, 'Equilibration Steps must be non-negative'),
  prod_steps: z.number().min(0, 'Production Steps must be non-negative'),
  grid_box_padding: z.number().min(0, 'Grid Box Padding must be non-negative'),
  wat_num_dens: z.number().min(0, 'Water Number Density must be non-negative'),
  wat_sites: z.string().optional(),
  output_folder: z.string().min(1, 'Output Folder is required'),
  output_prefix: z.string().min(1, 'Output Prefix is required'),
}).refine((data) => data.pdb_id || data.pdb_file !== undefined, {
  message: 'Either PDB ID or PDB File is required',
  path: ['pdb_id'],
});

interface PipelineFormProps {
  onSubmit: (formData: FormData) => void;
}

export default function PipelineForm({ onSubmit }: PipelineFormProps) {
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
    formState: { errors },
    watch,
    trigger,
    setValue,
  } = methods;

  const [activeTab, setActiveTab] = useState('input');
  const [pdbSource, setPdbSource] = useState<'id' | 'file'>('id');
  const [pdbFile, setPdbFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pdbId, setPdbId] = useState(methods.getValues('pdb_id') || '');
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

  const tabs = ['input', 'specifications', 'force-fields', 'solvation', 'md-parameters', 'gist-inputs', 'output'];

  const forceFieldOptions = {
    protein: ['amber/ff14SB.xml', 'amber/ff99SB.xml', 'amber/ff99SBildn.xml', 'charmm/charmm36_protein.xml'],
    ligand: ['openff-2.2.0', 'openff-2.1.0', 'openff-2.2.1', 'openff-1.2.0', 'openff-1.3.0', 'openff-1.3.1'],
    charges: ['am1bcc', 'gasteiger', 'am1-mulliken'],
    water: ['tip3p', 'spce', 'tip3pfb', 'tip4pew', 'tip4pfb'],
  };

  const onSubmitHandler = (data: any) => {
    console.log('handleSubmit called');
    const formData = new FormData();
    if (pdbSource === 'id') formData.append('pdb_id', data.pdb_id);
    if (pdbFile) formData.append('pdb_file', pdbFile);
    for (const [key, value] of Object.entries(data)) {
      if (value && key !== 'pdb_id' && key !== 'pdb_file') {
        formData.append(key, value.toString());
      }
    }
    console.log('Form Data:', Object.fromEntries(formData));
    setError(null);
    onSubmit(formData);
  };

  // --- FIX 1: handleNext now accepts the event and prevents default behavior ---
  const handleNext = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); 
    const currentIndex = tabs.indexOf(activeTab);
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
          isValid = await trigger(['grid_box_padding', 'wat_num_dens', 'wat_sites']);
          break;
        case 'output':
          isValid = await trigger(['output_folder', 'output_prefix']);
          break;
      }
      if (isValid) {
        setError(null);
        setActiveTab(tabs[currentIndex + 1]);
      } else {
        setError('Please fix the errors in the current tab before proceeding');
      }
    }
  };

  const handlePrevious = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  const isFirstTab = tabs.indexOf(activeTab) === 0;
  const isLastTab = tabs.indexOf(activeTab) === tabs.length - 1;

  return (
    <FormProvider {...methods}>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Configure Molecular Dynamics Simulation</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Using the form's onSubmit, but the buttons will control the logic */}
          <form onSubmit={handleSubmit(onSubmitHandler)}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
               <TabsList className="grid w-full grid-cols-7">
                <TabsTrigger value="input" className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" /> Input
                </TabsTrigger>
                <TabsTrigger value="specifications" className="flex items-center gap-2">
                  <Atom className="h-4 w-4" /> Specs
                </TabsTrigger>
                <TabsTrigger value="force-fields" className="flex items-center gap-2">
                  <Zap className="h-4 w-4" /> Force Fields
                </TabsTrigger>
                <TabsTrigger value="solvation" className="flex items-center gap-2">
                  <Droplets className="h-4 w-4" /> Solvation
                </TabsTrigger>
                <TabsTrigger value="md-parameters" className="flex items-center gap-2">
                  <Gauge className="h-4 w-4" /> MD Params
                </TabsTrigger>
                <TabsTrigger value="gist-inputs" className="flex items-center gap-2">
                  <Grid3x3 className="h-4 w-4" /> GIST
                </TabsTrigger>
                <TabsTrigger value="output" className="flex items-center gap-2">
                  <FolderArchive className="h-4 w-4" /> Output
                </TabsTrigger>
              </TabsList>
              
              {/* All TabsContent sections remain the same... */}
              <TabsContent value="input" className="mt-6">
                <div className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-foreground mb-4">
                        Input Structure to Pipeline
                      </h3>
                      <div className="grid gap-6">
                        <div>
                          <Label className="text-sm font-medium text-foreground mb-3 block">
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
                              <Label>Upload PDB File *</Label>
                              <Input
                                type="file"
                                accept=".pdb"
                                onChange={(e) => {
                                  const file = e.target.files ? e.target.files[0] : null;
                                  setPdbFile(file);
                                  setValue('pdb_file', file ?? undefined, { shouldValidate: true });
                                }}
                                className="mt-1"
                              />
                              {errors.pdb_file && <p className="text-red-600 text-sm">{errors.pdb_file.message}</p>}
                            </div>
                          ) : (
                            <div>
                              <Label>PDB ID *</Label>
                              <Input
                                {...register('pdb_id')}
                                value={pdbId}
                                onChange={(e) => setPdbId(e.target.value)}
                                placeholder="Enter PDB ID (e.g., 1MWE or 1LPG)"
                                className="mt-1"
                              />
                              {errors.pdb_id && <p className="text-red-600 text-sm">{errors.pdb_id.message}</p>}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="specifications" className="mt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Protein Chain ID *</Label>
                    <Input {...register('prot_chain_id')} defaultValue="A" className="mt-1" />
                    {errors.prot_chain_id && <p className="text-red-600 text-sm">{errors.prot_chain_id.message}</p>}
                  </div>
                  <div>
                    <Label>Ligand Chain ID *</Label>
                    <Input {...register('lig_chain_id')} defaultValue="A" className="mt-1" />
                    {errors.lig_chain_id && <p className="text-red-600 text-sm">{errors.lig_chain_id.message}</p>}
                  </div>
                  <div>
                    <Label>Ligand Residue ID *</Label>
                    <Input
                      type="number"
                      {...register('lig_resid', { valueAsNumber: true })}
                      defaultValue={1}
                      className="mt-1"
                    />
                    {errors.lig_resid && <p className="text-red-600 text-sm">{errors.lig_resid.message}</p>}
                  </div>
                  <div>
                    <Label>Ligand Residue Name *</Label>
                    <Input {...register('lig_resname')} defaultValue="SIA" className="mt-1" />
                    {errors.lig_resname && <p className="text-red-600 text-sm">{errors.lig_resname.message}</p>}
                  </div>
                  <div>
                    <Label>Water Chain ID *</Label>
                    <Input {...register('wat_chain_id')} defaultValue="A" className="mt-1" />
                    {errors.wat_chain_id && <p className="text-red-600 text-sm">{errors.wat_chain_id.message}</p>}
                  </div>
                  <div>
                    <Label>Water Residue Name *</Label>
                    <Input {...register('wat_resname')} defaultValue="HOH" className="mt-1" />
                    {errors.wat_resname && <p className="text-red-600 text-sm">{errors.wat_resname.message}</p>}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="force-fields" className="mt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Protein Force Field</Label>
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
                    {errors.prot_force_field && <p className="text-red-600 text-sm">{errors.prot_force_field.message}</p>}
                  </div>
                  <div>
                    <Label>Ligand Force Field</Label>
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
                    {errors.lig_force_field && <p className="text-red-600 text-sm">{errors.lig_force_field.message}</p>}
                  </div>
                  <div>
                    <Label>Ligand Partial Charges</Label>
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
                    {errors.lig_partial_charges && <p className="text-red-600 text-sm">{errors.lig_partial_charges.message}</p>}
                  </div>
                  <div>
                    <Label>Water Model</Label>
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
                    {errors.wat_model && <p className="text-red-600 text-sm">{errors.wat_model.message}</p>}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="solvation" className="mt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Label>Solvate</Label>
                    <Switch {...register('solvate')} defaultChecked />
                    {errors.solvate && <p className="text-red-600 text-sm">{errors.solvate.message}</p>}
                  </div>
                  <div>
                    <Label>PBC Box Padding</Label>
                    <Input
                      type="number"
                      {...register('PBC_box_padding', { valueAsNumber: true })}
                      defaultValue={1.0}
                      step="0.1"
                      className="mt-1"
                    />
                    {errors.PBC_box_padding && <p className="text-red-600 text-sm">{errors.PBC_box_padding.message}</p>}
                  </div>
                  <div>
                    <Label>Salt Concentration</Label>
                    <Input
                      type="number"
                      {...register('salt_conc', { valueAsNumber: true })}
                      defaultValue={0.15}
                      step="0.01"
                      className="mt-1"
                    />
                    {errors.salt_conc && <p className="text-red-600 text-sm">{errors.salt_conc.message}</p>}
                  </div>
                  <div>
                    <Label>Positive Ion</Label>
                    <Input {...register('positive_ion')} defaultValue="Na+" className="mt-1" />
                    {errors.positive_ion && <p className="text-red-600 text-sm">{errors.positive_ion.message}</p>}
                  </div>
                  <div>
                    <Label>Negative Ion</Label>
                    <Input {...register('negative_ion')} defaultValue="Cl-" className="mt-1" />
                    {errors.negative_ion && <p className="text-red-600 text-sm">{errors.negative_ion.message}</p>}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label>Neutralize</Label>
                    <Switch {...register('neutralize')} defaultChecked />
                    {errors.neutralize && <p className="text-red-600 text-sm">{errors.neutralize.message}</p>}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="md-parameters" className="mt-6">
                <div className="grid grid-cols-2 gap-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Label>Friction Coefficient</Label>
                          <Input
                            type="number"
                            {...register('friction_coeff', { valueAsNumber: true })}
                            defaultValue={1.0}
                            step="0.1"
                            className="mt-1"
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>Unit: ps⁻¹</TooltipContent>
                    </Tooltip>
                    {errors.friction_coeff && <p className="text-red-600 text-sm">{errors.friction_coeff.message}</p>}
                  </TooltipProvider>
                  <div>
                    <Label>MD Time Step</Label>
                    <Input
                      type="number"
                      {...register('md_time_step', { valueAsNumber: true })}
                      defaultValue={0.002}
                      step="0.001"
                      className="mt-1"
                    />
                    {errors.md_time_step && <p className="text-red-600 text-sm">{errors.md_time_step.message}</p>}
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Label>Harmonic Restraint K</Label>
                          <Input
                            type="number"
                            {...register('harmonic_restr_k', { valueAsNumber: true })}
                            defaultValue={1000}
                            className="mt-1"
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>Unit: kJ/(mol·nm²)</TooltipContent>
                    </Tooltip>
                    {errors.harmonic_restr_k && <p className="text-red-600 text-sm">{errors.harmonic_restr_k.message}</p>}
                  </TooltipProvider>
                  <div>
                    <Label>Pressure</Label>
                    <Input
                      type="number"
                      {...register('pressure', { valueAsNumber: true })}
                      defaultValue={1.0}
                      step="0.1"
                      className="mt-1"
                    />
                    {errors.pressure && <p className="text-red-600 text-sm">{errors.pressure.message}</p>}
                  </div>
                  <div>
                    <Label>Temperature</Label>
                    <Input
                      type="number"
                      {...register('temperature', { valueAsNumber: true })}
                      defaultValue={300}
                      className="mt-1"
                    />
                    {errors.temperature && <p className="text-red-600 text-sm">{errors.temperature.message}</p>}
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Label>Dump Interval</Label>
                          <Input
                            type="number"
                            {...register('dump_interval', { valueAsNumber: true })}
                            defaultValue={1000}
                            className="mt-1"
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>Unit: steps</TooltipContent>
                    </Tooltip>
                    {errors.dump_interval && <p className="text-red-600 text-sm">{errors.dump_interval.message}</p>}
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Label>Equilibration Steps</Label>
                          <Input
                            type="number"
                            {...register('equil_steps', { valueAsNumber: true })}
                            defaultValue={500000}
                            className="mt-1"
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>Unit: steps</TooltipContent>
                    </Tooltip>
                    {errors.equil_steps && <p className="text-red-600 text-sm">{errors.equil_steps.message}</p>}
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Label>Production Steps</Label>
                          <Input
                            type="number"
                            {...register('prod_steps', { valueAsNumber: true })}
                            defaultValue={2000000}
                            className="mt-1"
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>Unit: steps</TooltipContent>
                    </Tooltip>
                    {errors.prod_steps && <p className="text-red-600 text-sm">{errors.prod_steps.message}</p>}
                  </TooltipProvider>
                </div>
              </TabsContent>
              <TabsContent value="gist-inputs" className="mt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Grid Box Padding</Label>
                    <Input
                      type="number"
                      {...register('grid_box_padding', { valueAsNumber: true })}
                      defaultValue={1.0}
                      step="0.1"
                      className="mt-1"
                    />
                    {errors.grid_box_padding && <p className="text-red-600 text-sm">{errors.grid_box_padding.message}</p>}
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="relative">
                          <Label>Water Number Density</Label>
                          <Input
                            type="number"
                            {...register('wat_num_dens', { valueAsNumber: true })}
                            defaultValue={0.0329}
                            step="0.0001"
                            className="mt-1"
                          />
                          <Info
                            className="absolute right-2 top-8 h-4 w-4 text-gray-400 cursor-help"
                            onClick={() =>
                              alert(
                                'The bulk water number density is dependent on the water model. TIP3P = 0.0329, SPC/E = 0.0333, TIP3P-FB ≈ 0.0334, TIP4P-Ew = 0.0332, TIP4P-DB = 0.0332'
                              )
                            }
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>Unit: mol/Å³</TooltipContent>
                    </Tooltip>
                    {errors.wat_num_dens && <p className="text-red-600 text-sm">{errors.wat_num_dens.message}</p>}
                  </TooltipProvider>
                  <div>
                    <Label>Water Sites (e.g., A1326,A1327)</Label>
                    <Input
                      type="text"
                      {...register('wat_sites')}
                      defaultValue="A1326,A1327"
                      className="mt-1"
                    />
                    {errors.wat_sites && <p className="text-red-600 text-sm">{errors.wat_sites.message}</p>}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="output" className="mt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Output Folder</Label>
                    <Input
                      type="text"
                      {...register('output_folder')}
                      defaultValue="1mwe_wat_thermo"
                      className="mt-1"
                    />
                    {errors.output_folder && <p className="text-red-600 text-sm">{errors.output_folder.message}</p>}
                  </div>
                  <div>
                    <Label>Output Prefix</Label>
                    <Input
                      type="text"
                      {...register('output_prefix')}
                      defaultValue="md"
                      className="mt-1"
                    />
                    {errors.output_prefix && <p className="text-red-600 text-sm">{errors.output_prefix.message}</p>}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            {error && <p className="text-red-600 text-sm mt-4">{error}</p>}

            {/* --- FIX 2: All buttons are now type="button" and use onClick for control --- */}
            <div className="flex justify-between mt-6">
                <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={isFirstTab}
                >
                    Previous
                </Button>

                {isLastTab ? (
                    <Button
                        type="button"
                        onClick={handleSubmit(onSubmitHandler)}
                    >
                        Submit
                    </Button>
                ) : (
                    <Button type="button" onClick={handleNext}>
                        Next
                    </Button>
                )}
            </div>
          </form>
        </CardContent>
      </Card>
    </FormProvider>
  );
}