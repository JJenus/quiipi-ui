// src/components/invoices/InvoiceForm.tsx
import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StepperTabs } from '@/components/ui/stepper-tabs';
import { InvoiceCreateRequest } from '@/types';
import { useClients } from '@/hooks/useClients';
import { useProjects } from '@/hooks/useProjects';
import { 
  Trash2, 
  Plus, 
  Calculator,
  ChevronLeft,
  ChevronRight,
  Check,
  Users,
  Calendar,
  FileText,
  Receipt,
  DollarSign,
  Building2
} from 'lucide-react';
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

const invoiceItemSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  itemType: z.string().default('SERVICE'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  unitPrice: z.number().min(0, 'Unit price must be positive'),
  discountPercentage: z.number().min(0).max(100).optional().default(0),
  notes: z.string().optional(),
});

const invoiceSchema = z.object({
  clientId: z.string().min(1, 'Client is required'),
  projectId: z.string().optional(),
  issueDate: z.string().min(1, 'Issue date is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  items: z.array(invoiceItemSchema).min(1, 'At least one item is required'),
  taxRate: z.number().min(0).max(100).default(0),
  discountAmount: z.number().min(0).default(0),
  notes: z.string().optional(),
  termsAndConditions: z.string().optional(),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

interface InvoiceFormProps {
  onSubmit: (data: InvoiceCreateRequest) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<InvoiceFormData>;
  clientId?: string;
}

const steps = [
  { 
    id: 'client', 
    title: 'Client', 
    icon: Building2,
    description: 'Select client and project'
  },
  { 
    id: 'dates', 
    title: 'Dates', 
    icon: Calendar,
    description: 'Set issue and due dates'
  },
  { 
    id: 'items', 
    title: 'Items', 
    icon: Receipt,
    description: 'Add invoice line items'
  },
  { 
    id: 'totals', 
    title: 'Totals', 
    icon: DollarSign,
    description: 'Tax, discounts and review'
  },
  { 
    id: 'notes', 
    title: 'Notes', 
    icon: FileText,
    description: 'Additional information'
  },
];

export const InvoiceForm: React.FC<InvoiceFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  clientId: presetClientId,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { clients } = useClients();
  const [selectedClient, setSelectedClient] = useState<string>(presetClientId || '');
  const { projects } = useProjects({ clientId: selectedClient });

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    trigger,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: [{ description: '', quantity: 1, unitPrice: 0, itemType: 'SERVICE', discountPercentage: 0 }],
      taxRate: 0,
      discountAmount: 0,
      ...initialData,
      clientId: presetClientId || initialData?.clientId || '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const items = watch('items');
  const taxRate = watch('taxRate');
  const discountAmount = watch('discountAmount');

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => {
      const itemTotal = (item.quantity || 0) * (item.unitPrice || 0);
      const discount = item.discountPercentage ? itemTotal * (item.discountPercentage / 100) : 0;
      return sum + (itemTotal - discount);
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount - (discountAmount || 0);

  useEffect(() => {
    if (presetClientId) {
      setSelectedClient(presetClientId);
      setValue('clientId', presetClientId);
    }
  }, [presetClientId, setValue]);

  const handleNext = async () => {
    let fieldsToValidate: string[] = [];
    
    switch (currentStep) {
      case 0: // Client
        fieldsToValidate = ['clientId', 'projectId'];
        break;
      case 1: // Dates
        fieldsToValidate = ['issueDate', 'dueDate'];
        break;
      case 2: // Items
        // Validate all items have required fields
        const itemFields: string[] = [];
        items.forEach((_, index) => {
          itemFields.push(`items.${index}.description`);
          itemFields.push(`items.${index}.quantity`);
          itemFields.push(`items.${index}.unitPrice`);
        });
        fieldsToValidate = itemFields;
        break;
      case 3: // Totals
        fieldsToValidate = ['taxRate', 'discountAmount'];
        break;
      case 4: // Notes
        fieldsToValidate = ['notes', 'termsAndConditions'];
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

  const handleFormSubmit = async (data: InvoiceFormData) => {
    const formattedData: InvoiceCreateRequest = {
      ...data,
      issueDate: formatDateForAPI(data.issueDate),
      dueDate: formatDateForAPI(data.dueDate),
      items: data.items.map(item => ({
        ...item,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
        discountPercentage: item.discountPercentage ? Number(item.discountPercentage) : undefined,
      })),
      taxRate: Number(data.taxRate),
      discountAmount: Number(data.discountAmount),
    };
    await onSubmit(formattedData);
  };

  const stepContents = [
    // Step 0: Client Information
    (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="clientId">Client *</Label>
          <Select
            value={watch('clientId')}
            onValueChange={(value) => {
              setValue('clientId', value);
              setSelectedClient(value);
              setValue('projectId', '');
            }}
          >
            <SelectTrigger id="clientId" className="w-full">
              <SelectValue placeholder="Select a client" />
            </SelectTrigger>
            <SelectContent>
              {clients?.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.companyName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.clientId && (
            <p className="text-sm text-red-500">{errors.clientId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="projectId">Project (Optional)</Label>
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

        {/* Client Summary */}
        {selectedClient && (
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Client Summary
            </h4>
            <div className="text-sm space-y-1">
              <p>
                <span className="text-muted-foreground">Company:</span>{' '}
                {clients?.find(c => c.id === selectedClient)?.companyName}
              </p>
              <p>
                <span className="text-muted-foreground">Contact:</span>{' '}
                {clients?.find(c => c.id === selectedClient)?.contactPerson}
              </p>
              <p>
                <span className="text-muted-foreground">Projects:</span>{' '}
                {projects?.length || 0} active
              </p>
            </div>
          </div>
        )}
      </div>
    ),

    // Step 1: Dates
    (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="issueDate">Issue Date *</Label>
            <Input
              id="issueDate"
              type="date"
              {...register('issueDate')}
              className="w-full"
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.issueDate && (
              <p className="text-sm text-red-500">{errors.issueDate.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date *</Label>
            <Input
              id="dueDate"
              type="date"
              {...register('dueDate')}
              className="w-full"
              min={watch('issueDate')}
            />
            {errors.dueDate && (
              <p className="text-sm text-red-500">{errors.dueDate.message}</p>
            )}
          </div>
        </div>

        {/* Date Preview */}
        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Timeline Preview
          </h4>
          <div className="text-sm space-y-1">
            <p>
              <span className="text-muted-foreground">Issue:</span>{' '}
              {new Date(watch('issueDate')).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <p>
              <span className="text-muted-foreground">Due:</span>{' '}
              {new Date(watch('dueDate')).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <p className="pt-1 text-xs">
              Payment terms: {
                Math.ceil((new Date(watch('dueDate')).getTime() - new Date(watch('issueDate')).getTime()) / (1000 * 60 * 60 * 24))
              } days
            </p>
          </div>
        </div>
      </div>
    ),

    // Step 2: Invoice Items
    (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">Invoice Items</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ 
              description: '', 
              quantity: 1, 
              unitPrice: 0, 
              itemType: 'SERVICE',
              discountPercentage: 0 
            })}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>

        {fields.map((field, index) => (
          <Card key={field.id} className="relative">
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`items.${index}.description`} className="text-xs">
                  Description *
                </Label>
                <Input
                  id={`items.${index}.description`}
                  {...register(`items.${index}.description`)}
                  placeholder="Service description"
                  className="w-full text-sm"
                />
                {errors.items?.[index]?.description && (
                  <p className="text-sm text-red-500">
                    {errors.items[index]?.description?.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor={`items.${index}.itemType`} className="text-xs">
                    Type
                  </Label>
                  <select
                    id={`items.${index}.itemType`}
                    {...register(`items.${index}.itemType`)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="SERVICE">Service</option>
                    <option value="PRODUCT">Product</option>
                    <option value="HOSTING">Hosting</option>
                    <option value="DOMAIN">Domain</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`items.${index}.quantity`} className="text-xs">
                    Quantity
                  </Label>
                  <Input
                    id={`items.${index}.quantity`}
                    type="number"
                    {...register(`items.${index}.quantity`, { 
                      valueAsNumber: true,
                      onChange: (e) => {
                        const value = parseInt(e.target.value);
                        if (isNaN(value) || value < 1) {
                          setValue(`items.${index}.quantity`, 1);
                        }
                      }
                    })}
                    min="1"
                    step="1"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`items.${index}.unitPrice`} className="text-xs">
                    Unit Price
                  </Label>
                  <Input
                    id={`items.${index}.unitPrice`}
                    type="number"
                    step="0.01"
                    {...register(`items.${index}.unitPrice`, { 
                      valueAsNumber: true,
                      onChange: (e) => {
                        const value = parseFloat(e.target.value);
                        if (isNaN(value) || value < 0) {
                          setValue(`items.${index}.unitPrice`, 0);
                        }
                      }
                    })}
                    placeholder="0.00"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`items.${index}.discountPercentage`} className="text-xs">
                    Discount %
                  </Label>
                  <Input
                    id={`items.${index}.discountPercentage`}
                    type="number"
                    {...register(`items.${index}.discountPercentage`, { 
                      valueAsNumber: true,
                      onChange: (e) => {
                        const value = parseInt(e.target.value);
                        if (isNaN(value) || value < 0) {
                          setValue(`items.${index}.discountPercentage`, 0);
                        } else if (value > 100) {
                          setValue(`items.${index}.discountPercentage`, 100);
                        }
                      }
                    })}
                    min="0"
                    max="100"
                    step="1"
                    placeholder="0"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div>
                  <p className="text-xs text-muted-foreground">Line Total</p>
                  <p className="text-sm font-semibold">
                    ${((items[index]?.quantity || 0) * (items[index]?.unitPrice || 0) * 
                       (1 - ((items[index]?.discountPercentage || 0) / 100))).toFixed(2)}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                  className="text-red-600 hover:text-red-700 hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {errors.items && (
          <p className="text-sm text-red-500">{errors.items.message}</p>
        )}

        {/* Items Summary */}
        {items.length > 0 && (
          <div className="mt-2 text-sm text-right text-muted-foreground">
            {items.length} item{items.length !== 1 ? 's' : ''} · Subtotal: ${subtotal.toFixed(2)}
          </div>
        )}
      </div>
    ),

    // Step 3: Totals
    (
      <div className="space-y-4">
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    {...register('taxRate', { 
                      valueAsNumber: true,
                      onChange: (e) => {
                        const value = parseFloat(e.target.value);
                        if (isNaN(value) || value < 0) {
                          setValue('taxRate', 0);
                        } else if (value > 100) {
                          setValue('taxRate', 100);
                        }
                      }
                    })}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discountAmount">Discount Amount ($)</Label>
                  <Input
                    id="discountAmount"
                    type="number"
                    step="0.01"
                    min="0"
                    {...register('discountAmount', { 
                      valueAsNumber: true,
                      onChange: (e) => {
                        const value = parseFloat(e.target.value);
                        if (isNaN(value) || value < 0) {
                          setValue('discountAmount', 0);
                        }
                      }
                    })}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-medium mb-3">Invoice Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax ({taxRate}%):</span>
                    <span className="font-medium">${taxAmount.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Discount:</span>
                    <span className="font-medium text-red-600">-${discountAmount.toFixed(2)}</span>
                  </div>

                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Amount:</span>
                      <span className="text-primary">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    ),

    // Step 4: Notes
    (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <textarea
            id="notes"
            {...register('notes')}
            rows={4}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            placeholder="Additional notes to display on the invoice..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="termsAndConditions">Terms & Conditions</Label>
          <textarea
            id="termsAndConditions"
            {...register('termsAndConditions')}
            rows={4}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            placeholder="Payment terms, late fees, etc."
          />
        </div>

        {/* Final Review */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Check className="h-4 w-4 text-green-600" />
            Ready to Create
          </h4>
          <div className="text-sm space-y-2">
            <p><span className="text-muted-foreground">Client:</span> {
              clients?.find(c => c.id === getValues('clientId'))?.companyName || 'Not selected'
            }</p>
            <p><span className="text-muted-foreground">Items:</span> {items.length}</p>
            <p><span className="text-muted-foreground">Total Amount:</span> ${total.toFixed(2)}</p>
            <p><span className="text-muted-foreground">Due Date:</span> {
              new Date(getValues('dueDate')).toLocaleDateString()
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
            {isSubmitting ? 'Creating...' : 'Create Invoice'}
            <Check className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </form>
  );
};