// src/components/projects/ProjectForm.tsx - Updated with DateTimePicker
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { ProjectCreateRequest, ProjectPriority } from '@/types';
import { useClients } from '@/hooks/useClients';
import { formatDateTimeForAPI } from '@/utils/dateUtils';

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

export const ProjectForm: React.FC<ProjectFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
}) => {
  const { clients } = useClients();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      priority: 'MEDIUM',
      ...initialData,
      startDate: initialData?.startDate ? new Date(initialData.startDate) : undefined,
      deadline: initialData?.deadline ? new Date(initialData.deadline) : undefined,
    },
  });

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

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
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
            rows={3}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="estimatedBudget">Estimated Budget</Label>
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
            <Label htmlFor="hourlyRate">Hourly Rate</Label>
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

        <div className="space-y-2">
          <Label htmlFor="repositoryUrl">Repository URL</Label>
          <Input
            id="repositoryUrl"
            type="url"
            {...register('repositoryUrl')}
            placeholder="https://github.com/..."
            className="w-full"
          />
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
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-2">
        <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? 'Creating...' : 'Create Project'}
        </Button>
      </div>
    </form>
  );
};