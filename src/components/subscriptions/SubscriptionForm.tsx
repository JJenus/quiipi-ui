import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SubscriptionCreateRequest, SubscriptionType, BillingCycle } from '@/types';

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
}

export const SubscriptionForm: React.FC<SubscriptionFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      type: 'DOMAIN',
      currency: 'USD',
      billingCycle: 'YEARLY',
      autoRenew: false,
      notifyDaysBefore: 30,
      ...initialData,
    },
  });

  const handleFormSubmit = async (data: SubscriptionFormData) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Subscription Name *</Label>
          <Input
            id="name"
            {...register('name')}
            placeholder="e.g., Domain Registration"
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Type *</Label>
          <select
            id="type"
            {...register('type')}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="DOMAIN">Domain</option>
            <option value="HOSTING">Hosting</option>
            <option value="SSL">SSL Certificate</option>
            <option value="EMAIL">Email</option>
            <option value="TOOL">Tool</option>
            <option value="OTHER">Other</option>
          </select>
          {errors.type && (
            <p className="text-sm text-red-500">{errors.type.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="provider">Provider *</Label>
          <Input
            id="provider"
            {...register('provider')}
            placeholder="e.g., GoDaddy, Namecheap"
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
            placeholder="Account reference"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="domainName">Domain Name</Label>
          <Input
            id="domainName"
            {...register('domainName')}
            placeholder="example.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hostingPlan">Hosting Plan</Label>
          <Input
            id="hostingPlan"
            {...register('hostingPlan')}
            placeholder="e.g., Business Pro"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cost">Cost *</Label>
          <Input
            id="cost"
            type="number"
            step="0.01"
            {...register('cost', { valueAsNumber: true })}
            placeholder="99.99"
          />
          {errors.cost && (
            <p className="text-sm text-red-500">{errors.cost.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Input
            id="currency"
            {...register('currency')}
            placeholder="USD"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="billingCycle">Billing Cycle *</Label>
          <select
            id="billingCycle"
            {...register('billingCycle')}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="MONTHLY">Monthly</option>
            <option value="QUARTERLY">Quarterly</option>
            <option value="SEMI_ANNUAL">Semi-Annual</option>
            <option value="YEARLY">Yearly</option>
            <option value="ONE_TIME">One Time</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="purchaseDate">Purchase Date</Label>
          <Input
            id="purchaseDate"
            type="date"
            {...register('purchaseDate')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            {...register('startDate')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="expiryDate">Expiry Date *</Label>
          <Input
            id="expiryDate"
            type="date"
            {...register('expiryDate')}
          />
          {errors.expiryDate && (
            <p className="text-sm text-red-500">{errors.expiryDate.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="notifyDaysBefore">Notify Days Before</Label>
          <Input
            id="notifyDaysBefore"
            type="number"
            {...register('notifyDaysBefore', { valueAsNumber: true })}
            placeholder="30"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="renewalUrl">Renewal URL</Label>
          <Input
            id="renewalUrl"
            {...register('renewalUrl')}
            placeholder="https://..."
          />
        </div>

        <div className="col-span-2 space-y-2">
          <Label htmlFor="loginCredentials">Login Credentials (Encrypted)</Label>
          <Input
            id="loginCredentials"
            type="password"
            {...register('loginCredentials')}
            placeholder="Store sensitive information"
          />
        </div>

        <div className="col-span-2 space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <textarea
            id="notes"
            {...register('notes')}
            rows={3}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            placeholder="Additional notes..."
          />
        </div>

        <div className="col-span-2 flex items-center space-x-2">
          <input
            type="checkbox"
            id="autoRenew"
            {...register('autoRenew')}
            className="h-4 w-4 rounded border-gray-300"
          />
          <Label htmlFor="autoRenew">Auto-renew enabled</Label>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Subscription'}
        </Button>
      </div>
    </form>
  );
};
