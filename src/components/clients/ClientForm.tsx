// components/clients/ClientForm.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StepperTabs } from '@/components/ui/stepper-tabs';
import { ClientCreateRequest } from '@/types';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Building2,
  MapPin,
  Truck,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';

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

const steps = [
  { 
    id: 'basic', 
    title: 'Basic Information', 
    icon: Building2,
    description: 'Company details and contact information'
  },
  { 
    id: 'billing', 
    title: 'Billing Address', 
    icon: MapPin,
    description: 'Primary billing address'
  },
  { 
    id: 'shipping', 
    title: 'Shipping Address', 
    icon: Truck,
    description: 'Where to send products/services'
  },
  { 
    id: 'additional', 
    title: 'Additional Info', 
    icon: FileText,
    description: 'Payment terms and notes'
  },
];

export const ClientForm: React.FC<ClientFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [sameAsBilling, setSameAsBilling] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
    getValues,
    setValue,
    watch,
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

  // Watch billing address for "same as billing" feature
  const billingAddress = watch('billingAddress');

  const handleSameAsBilling = (checked: boolean) => {
    setSameAsBilling(checked);
    if (checked) {
      setValue('shippingAddress', billingAddress);
    }
  };

  const handleNext = async () => {
    let fieldsToValidate: string[] = [];
    
    switch (currentStep) {
      case 0: // Basic
        fieldsToValidate = [
          'companyName', 'contactPerson', 'email', 'phone', 
          'alternatePhone', 'website', 'taxId', 'currency', 
          'paymentTerms', 'creditLimit'
        ];
        break;
      case 1: // Billing
        fieldsToValidate = [
          'billingAddress.street', 'billingAddress.city', 
          'billingAddress.state', 'billingAddress.postalCode', 
          'billingAddress.country'
        ];
        break;
      case 2: // Shipping
        if (!sameAsBilling) {
          fieldsToValidate = [
            'shippingAddress.street', 'shippingAddress.city', 
            'shippingAddress.state', 'shippingAddress.postalCode', 
            'shippingAddress.country'
          ];
        }
        break;
      case 3: // Additional - no required fields to validate
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

  const handleFormSubmit = async (data: ClientFormData) => {
    await onSubmit(data);
  };

  const stepContents = [
    // Step 0: Basic Information
    (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name *</Label>
            <Input id="companyName" {...register('companyName')} placeholder="Acme Inc." />
            {errors.companyName && <p className="text-sm text-red-500">{errors.companyName.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactPerson">Contact Person *</Label>
            <Input id="contactPerson" {...register('contactPerson')} placeholder="John Doe" />
            {errors.contactPerson && <p className="text-sm text-red-500">{errors.contactPerson.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input id="email" type="email" {...register('email')} placeholder="contact@acme.com" />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone *</Label>
            <Input id="phone" {...register('phone')} placeholder="+1 234 567 8900" />
            {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="alternatePhone">Alternate Phone</Label>
            <Input id="alternatePhone" {...register('alternatePhone')} placeholder="+1 234 567 8901" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input id="website" {...register('website')} placeholder="https://acme.com" />
            {errors.website && <p className="text-sm text-red-500">{errors.website.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="taxId">Tax ID / VAT Number</Label>
            <Input id="taxId" {...register('taxId')} placeholder="123456789" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Input id="currency" {...register('currency')} placeholder="USD" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentTerms">Payment Terms</Label>
            <Input id="paymentTerms" {...register('paymentTerms')} placeholder="NET30" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="creditLimit">Credit Limit</Label>
            <Input id="creditLimit" type="number" {...register('creditLimit', { valueAsNumber: true })} placeholder="10000" />
            {errors.creditLimit && <p className="text-sm text-red-500">{errors.creditLimit.message}</p>}
          </div>
        </div>
      </div>
    ),

    // Step 1: Billing Address
    (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 space-y-2">
            <Label htmlFor="billingAddress.street">Street Address *</Label>
            <Input id="billingAddress.street" {...register('billingAddress.street')} placeholder="123 Main St" />
            {errors.billingAddress?.street && <p className="text-sm text-red-500">{errors.billingAddress.street.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="billingAddress.city">City *</Label>
            <Input id="billingAddress.city" {...register('billingAddress.city')} placeholder="New York" />
            {errors.billingAddress?.city && <p className="text-sm text-red-500">{errors.billingAddress.city.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="billingAddress.state">State *</Label>
            <Input id="billingAddress.state" {...register('billingAddress.state')} placeholder="NY" />
            {errors.billingAddress?.state && <p className="text-sm text-red-500">{errors.billingAddress.state.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="billingAddress.postalCode">Postal Code *</Label>
            <Input id="billingAddress.postalCode" {...register('billingAddress.postalCode')} placeholder="10001" />
            {errors.billingAddress?.postalCode && <p className="text-sm text-red-500">{errors.billingAddress.postalCode.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="billingAddress.country">Country *</Label>
            <Input id="billingAddress.country" {...register('billingAddress.country')} placeholder="USA" />
            {errors.billingAddress?.country && <p className="text-sm text-red-500">{errors.billingAddress.country.message}</p>}
          </div>
        </div>
      </div>
    ),

    // Step 2: Shipping Address
    (
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="checkbox"
            id="sameAsBilling"
            checked={sameAsBilling}
            onChange={(e) => handleSameAsBilling(e.target.checked)}
            className="rounded border-gray-300"
          />
          <Label htmlFor="sameAsBilling">Same as billing address</Label>
        </div>

        {!sameAsBilling && (
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="shippingAddress.street">Street Address *</Label>
              <Input id="shippingAddress.street" {...register('shippingAddress.street')} placeholder="123 Main St" />
              {errors.shippingAddress?.street && <p className="text-sm text-red-500">{errors.shippingAddress.street.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="shippingAddress.city">City *</Label>
              <Input id="shippingAddress.city" {...register('shippingAddress.city')} placeholder="New York" />
              {errors.shippingAddress?.city && <p className="text-sm text-red-500">{errors.shippingAddress.city.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="shippingAddress.state">State *</Label>
              <Input id="shippingAddress.state" {...register('shippingAddress.state')} placeholder="NY" />
              {errors.shippingAddress?.state && <p className="text-sm text-red-500">{errors.shippingAddress.state.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="shippingAddress.postalCode">Postal Code *</Label>
              <Input id="shippingAddress.postalCode" {...register('shippingAddress.postalCode')} placeholder="10001" />
              {errors.shippingAddress?.postalCode && <p className="text-sm text-red-500">{errors.shippingAddress.postalCode.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="shippingAddress.country">Country *</Label>
              <Input id="shippingAddress.country" {...register('shippingAddress.country')} placeholder="USA" />
              {errors.shippingAddress?.country && <p className="text-sm text-red-500">{errors.shippingAddress.country.message}</p>}
            </div>
          </div>
        )}
      </div>
    ),

    // Step 3: Additional Information
    (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <textarea
            id="notes"
            {...register('notes')}
            rows={6}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            placeholder="Any additional notes about the client..."
          />
        </div>

        {/* Summary */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-2">Review Summary</h4>
          <div className="text-sm space-y-1">
            <p><span className="text-muted-foreground">Company:</span> {getValues('companyName')}</p>
            <p><span className="text-muted-foreground">Contact:</span> {getValues('contactPerson')}</p>
            <p><span className="text-muted-foreground">Email:</span> {getValues('email')}</p>
            <p><span className="text-muted-foreground">Billing:</span> {getValues('billingAddress.city')}, {getValues('billingAddress.country')}</p>
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
            {isSubmitting ? 'Saving...' : 'Save Client'}
            <Check className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </form>
  );
};