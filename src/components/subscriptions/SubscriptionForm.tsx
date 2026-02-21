// src/components/subscriptions/SubscriptionForm.tsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SubscriptionCreateRequest, SubscriptionType, BillingCycle } from '@/types';
import { useClients } from '@/hooks/useClients';
import { useProjects } from '@/hooks/useProjects';
import { formatDateForAPI } from '@/utils/dateUtils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Globe, Server, Shield, Mail, Wrench, Calendar, DollarSign, Link, Lock, FileText } from 'lucide-react';

const subscriptionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['DOMAIN', 'HOSTING', 'SSL', 'EMAIL', 'TOOL', 'OTHER']),
  provider: z.string().min(1, 'Provider is required'),
  providerAccountId: z.string().optional(),
  projectId: z.string().optional(),
  clientId: z.string().optional(),
  domainName: z.string().optional(),
  hostingPlan: z.string().optional(),
  cost: z.number().min(0, 'Cost must be positive'),
  currency: z.string().default('USD'),
  billingCycle: z.enum(['MONTHLY', 'QUARTERLY', 'SEMI_ANNUAL', 'YEARLY', 'ONE_TIME']),
  purchaseDate: z.string().optional(),
  startDate: z.string().optional(),
  expiryDate: z.string().min(1, 'Expiry date is required'),
  autoRenew: z.boolean().default(false),
  renewalUrl: z.string().url().optional().or(z.literal('')),
  loginCredentials: z.string().optional(),
  notes: z.string().optional(),
  notifyDaysBefore: z.number().default(30),
}).refine(data => data.projectId || data.clientId, {
  message: "Either Project or Client must be selected",
  path: ["projectId"],
});

type SubscriptionFormData = z.infer<typeof subscriptionSchema>;

interface SubscriptionFormProps {
  onSubmit: (data: SubscriptionCreateRequest) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<SubscriptionFormData>;
  clientId?: string;
  projectId?: string;
}

export const SubscriptionForm: React.FC<SubscriptionFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  clientId: presetClientId,
  projectId: presetProjectId,
}) => {
  const { clients } = useClients();
  const [selectedClient, setSelectedClient] = useState<string>(presetClientId || '');
  const { projects } = useProjects({ clientId: selectedClient });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      type: 'DOMAIN',
      currency: 'USD',
      billingCycle: 'YEARLY',
      autoRenew: false,
      notifyDaysBefore: 30,
      cost: 0,
      ...initialData,
      clientId: presetClientId || initialData?.clientId || '',
      projectId: presetProjectId || initialData?.projectId || '',
    },
  });

  const selectedType = watch('type');
  const autoRenew = watch('autoRenew');

  // Set client if preset
  useEffect(() => {
    if (presetClientId) {
      setSelectedClient(presetClientId);
      setValue('clientId', presetClientId);
    }
  }, [presetClientId, setValue]);

  // Set project if preset
  useEffect(() => {
    if (presetProjectId) {
      setValue('projectId', presetProjectId);
    }
  }, [presetProjectId, setValue]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'DOMAIN': return <Globe className="h-4 w-4" />;
      case 'HOSTING': return <Server className="h-4 w-4" />;
      case 'SSL': return <Shield className="h-4 w-4" />;
      case 'EMAIL': return <Mail className="h-4 w-4" />;
      case 'TOOL': return <Wrench className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const handleFormSubmit = async (data: SubscriptionFormData) => {
    // Format dates for API
    const formattedData: SubscriptionCreateRequest = {
      ...data,
      cost: Number(data.cost),
      notifyDaysBefore: Number(data.notifyDaysBefore),
      purchaseDate: data.purchaseDate ? formatDateForAPI(data.purchaseDate) : undefined,
      startDate: data.startDate ? formatDateForAPI(data.startDate) : undefined,
      expiryDate: formatDateForAPI(data.expiryDate),
    };
    await onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 pb-2 border-b">
        {getTypeIcon(selectedType)}
        <h2 className="text-lg font-semibold">Subscription Details</h2>
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="name">Subscription Name *</Label>
          <Input
            id="name"
            {...register('name')}
            placeholder="e.g., Domain Registration - example.com"
            className="w-full"
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Type *</Label>
          <Select
            value={watch('type')}
            onValueChange={(value: SubscriptionType) => setValue('type', value)}
          >
            <SelectTrigger id="type" className="w-full">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DOMAIN">Domain</SelectItem>
              <SelectItem value="HOSTING">Hosting</SelectItem>
              <SelectItem value="SSL">SSL Certificate</SelectItem>
              <SelectItem value="EMAIL">Email</SelectItem>
              <SelectItem value="TOOL">Tool / Software</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.type && (
            <p className="text-sm text-red-500">{errors.type.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="provider">Provider *</Label>
          <Input
            id="provider"
            {...register('provider')}
            placeholder="e.g., GoDaddy, Namecheap, AWS"
            className="w-full"
          />
          {errors.provider && (
            <p className="text-sm text-red-500">{errors.provider.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="providerAccountId">Provider Account ID</Label>
          <Input
            id="providerAccountId"
            {...register('providerAccountId')}
            placeholder="Account reference or ID"
            className="w-full"
          />
        </div>
      </div>

      {/* Association */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <h3 className="text-sm font-semibold">Association</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientId">Client</Label>
              <Select
  value={watch('clientId') || 'none'}
  onValueChange={(value) => {
    if (value === 'none') {
      setValue('clientId', '');
      setSelectedClient('');
    } else {
      setValue('clientId', value);
      setSelectedClient(value);
    }
    setValue('projectId', '');
  }}
>
  <SelectTrigger id="clientId" className="w-full">
    <SelectValue placeholder="Select a client (optional)" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="none">None</SelectItem>
    {clients?.map((client) => (
      <SelectItem key={client.id} value={client.id}>
        {client.companyName}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectId">Project</Label>
              <Select
  value={watch('projectId') || 'none'}
  onValueChange={(value) => setValue('projectId', value === 'none' ? '' : value)}
  disabled={!selectedClient}
>
  <SelectTrigger id="projectId" className="w-full">
    <SelectValue placeholder={selectedClient ? "Select a project" : "Select a client first"} />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="none">None</SelectItem>
    {projects?.map((project) => (
      <SelectItem key={project.id} value={project.id}>
        {project.name}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
            </div>
          </div>

          {!watch('clientId') && !watch('projectId') && (
            <p className="text-sm text-yellow-600 dark:text-yellow-500">
              Please select either a client or a project
            </p>
          )}
          {errors.projectId && (
            <p className="text-sm text-red-500">{errors.projectId.message}</p>
          )}
        </CardContent>
      </Card>

      {/* Type-specific fields */}
      {selectedType === 'DOMAIN' && (
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Domain Details
            </h3>
            <div className="space-y-2">
              <Label htmlFor="domainName">Domain Name</Label>
              <Input
                id="domainName"
                {...register('domainName')}
                placeholder="example.com"
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {selectedType === 'HOSTING' && (
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Server className="h-4 w-4" />
              Hosting Details
            </h3>
            <div className="space-y-2">
              <Label htmlFor="hostingPlan">Hosting Plan</Label>
              <Input
                id="hostingPlan"
                {...register('hostingPlan')}
                placeholder="e.g., Business Pro, VPS, Dedicated"
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Financial Details */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Financial Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cost">Cost *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {watch('currency')}
                </span>
                <Input
                  id="cost"
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('cost', { valueAsNumber: true })}
                  placeholder="0.00"
                  className="pl-12 w-full"
                />
              </div>
              {errors.cost && (
                <p className="text-sm text-red-500">{errors.cost.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={watch('currency')}
                onValueChange={(value) => setValue('currency', value)}
              >
                <SelectTrigger id="currency" className="w-full">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="JPY">JPY (¥)</SelectItem>
                  <SelectItem value="CAD">CAD ($)</SelectItem>
                  <SelectItem value="AUD">AUD ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="billingCycle">Billing Cycle *</Label>
              <Select
                value={watch('billingCycle')}
                onValueChange={(value: BillingCycle) => setValue('billingCycle', value)}
              >
                <SelectTrigger id="billingCycle" className="w-full">
                  <SelectValue placeholder="Select billing cycle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MONTHLY">Monthly</SelectItem>
                  <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                  <SelectItem value="SEMI_ANNUAL">Semi-Annual</SelectItem>
                  <SelectItem value="YEARLY">Yearly</SelectItem>
                  <SelectItem value="ONE_TIME">One Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dates */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Important Dates
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="purchaseDate">Purchase Date</Label>
              <Input
                id="purchaseDate"
                type="date"
                {...register('purchaseDate')}
                className="w-full"
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                {...register('startDate')}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date *</Label>
              <Input
                id="expiryDate"
                type="date"
                {...register('expiryDate')}
                className="w-full"
                min={watch('startDate') || watch('purchaseDate')}
              />
              {errors.expiryDate && (
                <p className="text-sm text-red-500">{errors.expiryDate.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notifyDaysBefore">Notify Days Before Expiry</Label>
            <Input
              id="notifyDaysBefore"
              type="number"
              min="1"
              max="365"
              {...register('notifyDaysBefore', { valueAsNumber: true })}
              placeholder="30"
              className="w-full md:w-48"
            />
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Link className="h-4 w-4" />
            Additional Information
          </h3>

          <div className="space-y-2">
            <Label htmlFor="renewalUrl">Renewal URL</Label>
            <Input
              id="renewalUrl"
              type="url"
              {...register('renewalUrl')}
              placeholder="https://provider.com/renew"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="loginCredentials" className="flex items-center gap-2">
              <Lock className="h-3 w-3" />
              Login Credentials (Encrypted)
            </Label>
            <textarea
              id="loginCredentials"
              {...register('loginCredentials')}
              rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Store sensitive login information here. This will be encrypted."
            />
            <p className="text-xs text-muted-foreground">
              This information will be encrypted before storing
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              {...register('notes')}
              rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Any additional notes about this subscription..."
            />
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="autoRenew"
              {...register('autoRenew')}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="autoRenew" className="text-sm cursor-pointer">
              Auto-renew enabled
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-2 pt-4 border-t">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel} 
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full sm:w-auto"
        >
          {isSubmitting ? 'Saving...' : 'Save Subscription'}
        </Button>
      </div>
    </form>
  );
};