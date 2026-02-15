import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ClientCreateRequest } from '@/types';

const clientSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  contactPerson: z.string().min(1, 'Contact person is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  alternatePhone: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  taxId: z.string().optional(),
  billingAddress: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
    country: z.string().min(1, 'Country is required'),
  }),
  shippingAddress: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
    country: z.string().min(1, 'Country is required'),
  }),
  paymentTerms: z.string().optional(),
  creditLimit: z.number().optional(),
  currency: z.string().default('USD'),
  notes: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface ClientFormProps {
  onSubmit: (data: ClientCreateRequest) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<ClientFormData>;
}

export const ClientForm: React.FC<ClientFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      currency: 'USD',
      ...initialData,
      billingAddress: {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        ...initialData?.billingAddress,
      },
      shippingAddress: {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        ...initialData?.shippingAddress,
      },
    },
  });

  const handleFormSubmit = async (data: ClientFormData) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Basic Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name *</Label>
            <Input
              id="companyName"
              {...register('companyName')}
              placeholder="Acme Inc."
            />
            {errors.companyName && (
              <p className="text-sm text-red-500">{errors.companyName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactPerson">Contact Person *</Label>
            <Input
              id="contactPerson"
              {...register('contactPerson')}
              placeholder="John Doe"
            />
            {errors.contactPerson && (
              <p className="text-sm text-red-500">{errors.contactPerson.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="contact@acme.com"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              {...register('phone')}
              placeholder="+1 234 567 8900"
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="alternatePhone">Alternate Phone</Label>
            <Input
              id="alternatePhone"
              {...register('alternatePhone')}
              placeholder="+1 234 567 8901"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              {...register('website')}
              placeholder="https://acme.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="taxId">Tax ID / VAT Number</Label>
            <Input
              id="taxId"
              {...register('taxId')}
              placeholder="123456789"
            />
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
            <Label htmlFor="paymentTerms">Payment Terms</Label>
            <Input
              id="paymentTerms"
              {...register('paymentTerms')}
              placeholder="NET30"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="creditLimit">Credit Limit</Label>
            <Input
              id="creditLimit"
              type="number"
              {...register('creditLimit', { valueAsNumber: true })}
              placeholder="10000"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Billing Address</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 space-y-2">
            <Label htmlFor="billingAddress.street">Street Address *</Label>
            <Input
              id="billingAddress.street"
              {...register('billingAddress.street')}
              placeholder="123 Main St"
            />
            {errors.billingAddress?.street && (
              <p className="text-sm text-red-500">{errors.billingAddress.street.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="billingAddress.city">City *</Label>
            <Input
              id="billingAddress.city"
              {...register('billingAddress.city')}
              placeholder="New York"
            />
            {errors.billingAddress?.city && (
              <p className="text-sm text-red-500">{errors.billingAddress.city.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="billingAddress.state">State *</Label>
            <Input
              id="billingAddress.state"
              {...register('billingAddress.state')}
              placeholder="NY"
            />
            {errors.billingAddress?.state && (
              <p className="text-sm text-red-500">{errors.billingAddress.state.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="billingAddress.postalCode">Postal Code *</Label>
            <Input
              id="billingAddress.postalCode"
              {...register('billingAddress.postalCode')}
              placeholder="10001"
            />
            {errors.billingAddress?.postalCode && (
              <p className="text-sm text-red-500">{errors.billingAddress.postalCode.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="billingAddress.country">Country *</Label>
            <Input
              id="billingAddress.country"
              {...register('billingAddress.country')}
              placeholder="USA"
            />
            {errors.billingAddress?.country && (
              <p className="text-sm text-red-500">{errors.billingAddress.country.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Shipping Address (Same as Billing)</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 space-y-2">
            <Label htmlFor="shippingAddress.street">Street Address *</Label>
            <Input
              id="shippingAddress.street"
              {...register('shippingAddress.street')}
              placeholder="123 Main St"
            />
            {errors.shippingAddress?.street && (
              <p className="text-sm text-red-500">{errors.shippingAddress.street.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="shippingAddress.city">City *</Label>
            <Input
              id="shippingAddress.city"
              {...register('shippingAddress.city')}
              placeholder="New York"
            />
            {errors.shippingAddress?.city && (
              <p className="text-sm text-red-500">{errors.shippingAddress.city.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="shippingAddress.state">State *</Label>
            <Input
              id="shippingAddress.state"
              {...register('shippingAddress.state')}
              placeholder="NY"
            />
            {errors.shippingAddress?.state && (
              <p className="text-sm text-red-500">{errors.shippingAddress.state.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="shippingAddress.postalCode">Postal Code *</Label>
            <Input
              id="shippingAddress.postalCode"
              {...register('shippingAddress.postalCode')}
              placeholder="10001"
            />
            {errors.shippingAddress?.postalCode && (
              <p className="text-sm text-red-500">{errors.shippingAddress.postalCode.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="shippingAddress.country">Country *</Label>
            <Input
              id="shippingAddress.country"
              {...register('shippingAddress.country')}
              placeholder="USA"
            />
            {errors.shippingAddress?.country && (
              <p className="text-sm text-red-500">{errors.shippingAddress.country.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Additional Information</h3>
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <textarea
            id="notes"
            {...register('notes')}
            rows={4}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            placeholder="Any additional notes about the client..."
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Client'}
        </Button>
      </div>
    </form>
  );
};
