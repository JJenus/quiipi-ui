import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InvoiceCreateRequest } from '@/types';
import { useClients } from '@/hooks/useClients';
import { Trash2, Plus } from 'lucide-react';

const invoiceItemSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  itemType: z.string().default('SERVICE'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  unitPrice: z.number().min(0, 'Unit price must be positive'),
  discountPercentage: z.number().min(0).max(100).optional(),
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
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
}) => {
  const { clients } = useClients();
  const [selectedClient, setSelectedClient] = useState<string>('');

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: [{ description: '', quantity: 1, unitPrice: 0, itemType: 'SERVICE' }],
      taxRate: 0,
      discountAmount: 0,
      ...initialData,
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

  const handleFormSubmit = async (data: InvoiceFormData) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="clientId">Client *</Label>
          <select
            id="clientId"
            {...register('clientId')}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="">Select a client</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.companyName}
              </option>
            ))}
          </select>
          {errors.clientId && (
            <p className="text-sm text-red-500">{errors.clientId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="issueDate">Issue Date *</Label>
          <Input
            id="issueDate"
            type="date"
            {...register('issueDate')}
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
          />
          {errors.dueDate && (
            <p className="text-sm text-red-500">{errors.dueDate.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Invoice Items</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ description: '', quantity: 1, unitPrice: 0, itemType: 'SERVICE' })}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>

        {fields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-12 gap-2 items-end border p-4 rounded-lg">
            <div className="col-span-4 space-y-2">
              <Label>Description</Label>
              <Input
                {...register(`items.${index}.description`)}
                placeholder="Service description"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Type</Label>
              <select
                {...register(`items.${index}.itemType`)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="SERVICE">Service</option>
                <option value="PRODUCT">Product</option>
                <option value="HOSTING">Hosting</option>
                <option value="DOMAIN">Domain</option>
              </select>
            </div>
            <div className="col-span-1 space-y-2">
              <Label>Qty</Label>
              <Input
                type="number"
                {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                min="1"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Unit Price</Label>
              <Input
                type="number"
                step="0.01"
                {...register(`items.${index}.unitPrice`, { valueAsNumber: true })}
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Discount %</Label>
              <Input
                type="number"
                {...register(`items.${index}.discountPercentage`, { valueAsNumber: true })}
                min="0"
                max="100"
              />
            </div>
            <div className="col-span-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
                disabled={fields.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        {errors.items && (
          <p className="text-sm text-red-500">{errors.items.message}</p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="taxRate">Tax Rate (%)</Label>
          <Input
            id="taxRate"
            type="number"
            step="0.1"
            {...register('taxRate', { valueAsNumber: true })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="discountAmount">Discount Amount</Label>
          <Input
            id="discountAmount"
            type="number"
            step="0.01"
            {...register('discountAmount', { valueAsNumber: true })}
          />
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-end space-y-2">
          <div className="w-64 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax ({taxRate}%):</span>
              <span className="font-medium">${taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount:</span>
              <span className="font-medium">-${discountAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <textarea
          id="notes"
          {...register('notes')}
          rows={3}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          placeholder="Additional notes..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="termsAndConditions">Terms & Conditions</Label>
        <textarea
          id="termsAndConditions"
          {...register('termsAndConditions')}
          rows={3}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          placeholder="Payment terms, late fees, etc."
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Invoice'}
        </Button>
      </div>
    </form>
  );
};
