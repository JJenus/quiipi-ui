// src/components/projects/ProjectForm.tsx
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { StepperTabs } from '@/components/ui/stepper-tabs';
import { ProjectCreateRequest, ProjectPriority } from '@/types';
import { useClients } from '@/hooks/useClients';
import { formatDateTimeForAPI } from '@/utils/dateUtils';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  FolderKanban,
  Calendar,
  DollarSign,
  Globe,
  Users,
} from 'lucide-react'; 

const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  clientId: z.string().min(1, 'Client is required'),
  startDate: z.date().optional(),
  deadline: z.date().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
  estimatedBudget: z.number().min(0).optional(),
  hourlyRate: z.number().min(0).optional(),
  repositoryUrl: z.string().url().optional().or(z.literal('')),
  stagingUrl: z.string().url().optional().or(z.literal('')),
  productionUrl: z.string().url().optional().or(z.literal('')),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  onSubmit: (data: ProjectCreateRequest) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<ProjectFormData>;
}

const steps = [
  { 
    id: 'basic', 
    title: 'Basic Info', 
    icon: FolderKanban,
    description: 'Project name, description and client'
  },
  { 
    id: 'timeline', 
    title: 'Timeline', 
    icon: Calendar,
    description: 'Set project dates and priority'
  },
  { 
    id: 'budget', 
    title: 'Budget', 
    icon: DollarSign,
    description: 'Financial details and rates'
  },
  { 
    id: 'urls', 
    title: 'URLs', 
    icon: Globe,
    description: 'Repository and environment URLs'
  },
];

export const ProjectForm: React.FC<ProjectFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { clients } = useClients();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
    getValues,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      priority: 'MEDIUM',
      ...initialData,
      startDate: initialData?.startDate ? new Date(initialData.startDate) : undefined,
      deadline: initialData?.deadline ? new Date(initialData.deadline) : undefined,
    },
  });

  const handleNext = async () => {
    let fieldsToValidate: string[] = [];
    
    switch (currentStep) {
      case 0: // Basic Info
        fieldsToValidate = ['name', 'description', 'clientId'];
        break;
      case 1: // Timeline
        fieldsToValidate = ['startDate', 'deadline', 'priority'];
        break;
      case 2: // Budget
        fieldsToValidate = ['estimatedBudget', 'hourlyRate'];
        break;
      case 3: // URLs
        fieldsToValidate = ['repositoryUrl', 'stagingUrl', 'productionUrl'];
        break;
    }

    const isValid = fieldsToValidate.length ? await trigger(fieldsToValidate as any) : true;
    
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleFormSubmit = async (data: ProjectFormData) => {
    const formattedData: ProjectCreateRequest = {
      name: data.name,
      description: data.description,
      clientId: data.clientId,
      priority: data.priority,
      estimatedBudget: data.estimatedBudget,
      hourlyRate: data.hourlyRate,
      repositoryUrl: data.repositoryUrl,
      stagingUrl: data.stagingUrl,
      productionUrl: data.productionUrl,
      startDate: data.startDate ? formatDateTimeForAPI(data.startDate) : undefined,
      deadline: data.deadline ? formatDateTimeForAPI(data.deadline) : undefined,
    };
    await onSubmit(formattedData);
  };

  const stepContents = [
    // Step 0: Basic Information
    (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Project Name *</Label>
          <Input
            id="name"
            {...register('name')}
            placeholder="e.g., Website Redesign"
            className="w-full"
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            {...register('description')}
            rows={4}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            placeholder="Project description..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="clientId">Client *</Label>
          <select
            id="clientId"
            {...register('clientId')}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="">Select a client</option>
            {clients?.map((client) => (
              <option key={client.id} value={client.id}>
                {client.companyName}
              </option>
            ))}
          </select>
          {errors.clientId && (
            <p className="text-sm text-red-500">{errors.clientId.message}</p>
          )}
        </div>

        {/* Quick client stats */}
        {getValues('clientId') && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Selected client:</span>
              <span className="font-medium">
                {clients?.find(c => c.id === getValues('clientId'))?.companyName}
              </span>
            </div>
          </div>
        )}
      </div>
    ),

    // Step 1: Timeline
    (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Start Date & Time</Label>
            <Controller
              control={control}
              name="startDate"
              render={({ field }) => (
                <DatePicker
                  date={field.value}
                  onSelect={field.onChange}
                  placeholder="Select start date"
                  showTime={true}
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>Deadline</Label>
            <Controller
              control={control}
              name="deadline"
              render={({ field }) => (
                <DatePicker
                  date={field.value}
                  onSelect={field.onChange}
                  placeholder="Select deadline"
                  showTime={true}
                />
              )}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <select
            id="priority"
            {...register('priority')}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>

        {/* Timeline preview */}
        {(getValues('startDate') || getValues('deadline')) && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Timeline Preview</h4>
            <div className="text-sm space-y-1">
              {getValues('startDate') && (
                <p><span className="text-muted-foreground">Start:</span> {getValues('startDate')?.toLocaleString()}</p>
              )}
              {getValues('deadline') && (
                <p><span className="text-muted-foreground">Deadline:</span> {getValues('deadline')?.toLocaleString()}</p>
              )}
            </div>
          </div>
        )}
      </div>
    ),

    // Step 2: Budget
    (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="estimatedBudget">Estimated Budget ($)</Label>
            <Input
              id="estimatedBudget"
              type="number"
              step="0.01"
              {...register('estimatedBudget', { valueAsNumber: true })}
              placeholder="0.00"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hourlyRate">Hourly Rate ($/hr)</Label>
            <Input
              id="hourlyRate"
              type="number"
              step="0.01"
              {...register('hourlyRate', { valueAsNumber: true })}
              placeholder="0.00"
              className="w-full"
            />
          </div>
        </div>

        {/* Budget summary */}
        {(getValues('estimatedBudget') || getValues('hourlyRate')) && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Budget Summary</h4>
            <div className="text-sm space-y-1">
              {getValues('estimatedBudget') && (
                <p><span className="text-muted-foreground">Total Budget:</span> ${getValues('estimatedBudget')?.toFixed(2)}</p>
              )}
              {getValues('hourlyRate') && (
                <p><span className="text-muted-foreground">Hourly Rate:</span> ${getValues('hourlyRate')?.toFixed(2)}/hr</p>
              )}
            </div>
          </div>
        )}
      </div>
    ),

    // Step 3: URLs
    (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="repositoryUrl">Repository URL</Label>
          <Input
            id="repositoryUrl"
            type="url"
            {...register('repositoryUrl')}
            placeholder="https://github.com/..."
            className="w-full"
          />
          {errors.repositoryUrl && (
            <p className="text-sm text-red-500">{errors.repositoryUrl.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="stagingUrl">Staging URL</Label>
          <Input
            id="stagingUrl"
            type="url"
            {...register('stagingUrl')}
            placeholder="https://staging.example.com"
            className="w-full"
          />
          {errors.stagingUrl && (
            <p className="text-sm text-red-500">{errors.stagingUrl.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="productionUrl">Production URL</Label>
          <Input
            id="productionUrl"
            type="url"
            {...register('productionUrl')}
            placeholder="https://example.com"
            className="w-full"
          />
          {errors.productionUrl && (
            <p className="text-sm text-red-500">{errors.productionUrl.message}</p>
          )}
        </div>

        {/* Summary */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-2">Review Summary</h4>
          <div className="text-sm space-y-1">
            <p><span className="text-muted-foreground">Project:</span> {getValues('name') || 'Not set'}</p>
            <p><span className="text-muted-foreground">Client:</span> {
              clients?.find(c => c.id === getValues('clientId'))?.companyName || 'Not set'
            }</p>
            <p><span className="text-muted-foreground">Priority:</span> {getValues('priority')}</p>
            <p><span className="text-muted-foreground">Timeline:</span> {
              getValues('startDate') ? 'Set' : 'Not set'
            } - {
              getValues('deadline') ? 'Set' : 'Not set'
            }</p>
          </div>
        </div>
      </div>
    ),
  ];

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <StepperTabs
        steps={steps}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
      >
        {stepContents}
      </StepperTabs>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={currentStep === 0 ? onCancel : handlePrevious}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          {currentStep === 0 ? 'Cancel' : 'Previous'}
        </Button>

        {currentStep < steps.length - 1 ? (
          <Button type="button" onClick={handleNext}>
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Create Project'}
            <Check className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </form>
  );
};