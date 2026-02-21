// src/components/invoices/InvoiceForm.tsx
import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InvoiceCreateRequest } from '@/types';
import { useClients } from '@/hooks/useClients';
import { useProjects } from '@/hooks/useProjects';
import { Trash2, Plus, Calculator } from 'lucide-react';
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

export const InvoiceForm: React.FC<InvoiceFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  clientId: presetClientId,
}) => {
  const { clients } = useClients();
  const [selectedClient, setSelectedClient] = useState<string>(presetClientId || '');
  const { projects } = useProjects({ clientId: selectedClient });

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
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

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 pb-2 border-b">
        <Calculator className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-lg font-semibold">Invoice Details</h2>
      </div>

      {/* Client and Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      {/* Invoice Items */}
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
              {/* Description - Full width on all devices */}
              <div className="space-y-2">
                <Label htmlFor={`items.${index}.description`} className="text-xs">
                  Description *
                </Label>
                <Input
                  id={`items.${index}.description`}
                  {...register(`items.${index}.description`)}
                  placeholder="Service description"
                  className="w-full text-sm"
                  autoComplete="off"
                />
                {errors.items?.[index]?.description && (
                  <p className="text-sm text-red-500">
                    {errors.items[index]?.description?.message}
                  </p>
                )}
              </div>

              {/* Grid for other fields */}
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

              {/* Line Total and Remove Button */}
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
      </div>

      {/* Totals */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal:</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-2">
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
                <Label htmlFor="discountAmount">Discount Amount</Label>
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

            <div className="flex justify-between text-sm pt-2">
              <span className="text-muted-foreground">Tax ({taxRate}%):</span>
              <span className="font-medium">${taxAmount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Discount:</span>
              <span className="font-medium">-${discountAmount.toFixed(2)}</span>
            </div>

            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes and Terms */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <textarea
            id="notes"
            {...register('notes')}
            rows={3}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            placeholder="Additional notes to display on the invoice..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="termsAndConditions">Terms & Conditions</Label>
          <textarea
            id="termsAndConditions"
            {...register('termsAndConditions')}
            rows={3}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            placeholder="Payment terms, late fees, etc."
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-2 pt-4 border-t">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel} 
          className="w-full sm:w-auto min-h-[44px]"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full sm:w-auto min-h-[44px]"
        >
          {isSubmitting ? 'Creating Invoice...' : 'Create Invoice'}
        </Button>
      </div>
    </form>
  );
};