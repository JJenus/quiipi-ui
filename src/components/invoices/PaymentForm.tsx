// src/components/invoices/PaymentForm.tsx
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Invoice, PaymentMethod } from '@/types';
import { DatePicker } from '@/components/ui/date-picker';
import { formatDateTimeForAPI, formatDateForAPI } from '@/utils/dateUtils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CreditCard, Landmark, Wallet, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

const paymentSchema = z.object({
  amount: z.number()
    .min(0.01, 'Amount must be greater than 0')
    .refine(val => val > 0, 'Amount must be positive'),
  paymentDate: z.date({
    required_error: 'Payment date is required',
  }),
  paymentMethod: z.enum(['BANK_TRANSFER', 'CREDIT_CARD', 'PAYPAL', 'CASH']),
  referenceNumber: z.string().optional(),
  notes: z.string().optional(),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface PaymentFormProps {
  invoice: Invoice;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  invoice,
  onSubmit,
  onCancel,
}) => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: invoice.pendingBalance,
      paymentDate: new Date(), // Auto-select current date and time
      paymentMethod: 'BANK_TRANSFER',
      referenceNumber: '',
      notes: '',
    },
  });

  const amount = watch('amount');
  const paymentMethod = watch('paymentMethod');
  const maxAmount = invoice.pendingBalance;

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'BANK_TRANSFER':
        return <Landmark className="h-4 w-4" />;
      case 'CREDIT_CARD':
        return <CreditCard className="h-4 w-4" />;
      case 'PAYPAL':
        return <DollarSign className="h-4 w-4" />;
      case 'CASH':
        return <Wallet className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const handleFormSubmit = async (data: PaymentFormData) => {
    // Format the date for API - using formatDateForAPI to match backend expectations
    // The backend might expect just the date part, not the full datetime
    const formattedData = {
      invoiceId: invoice.id, // Add the invoice ID to the request body
      amount: data.amount,
      paymentDate: formatDateForAPI(data.paymentDate), // Use formatDateForAPI instead of formatDateTimeForAPI
      paymentMethod: data.paymentMethod,
      referenceNumber: data.referenceNumber,
      notes: data.notes,
    };
    
    console.log('Submitting payment data:', formattedData); // For debugging
    await onSubmit(formattedData);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (isNaN(value) || value < 0) {
      setValue('amount', 0);
    } else if (value > maxAmount) {
      setValue('amount', maxAmount);
    } else {
      setValue('amount', value);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Hidden invoice ID field for debugging */}
      <input type="hidden" value={invoice.id} readOnly />

      {/* Amount Input */}
      <div className="space-y-2">
        <Label htmlFor="amount" className="text-sm font-medium">
          Payment Amount *
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            $
          </span>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0.01"
            max={maxAmount}
            {...register('amount', { 
              valueAsNumber: true,
              onChange: handleAmountChange
            })}
            className="pl-8 pr-4 w-full"
            placeholder="0.00"
          />
        </div>
        {errors.amount && (
          <p className="text-sm text-red-500">{errors.amount.message}</p>
        )}
        {amount > maxAmount && (
          <p className="text-sm text-red-500 animate-pulse">
            Amount cannot exceed pending balance ({formatCurrency(maxAmount)})
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          Pending balance: {formatCurrency(maxAmount)}
        </p>
      </div>

      {/* Payment Date - Using DatePicker with time */}
      <div className="space-y-2">
        <Label htmlFor="paymentDate" className="text-sm font-medium">
          Payment Date *
        </Label>
        <Controller
          control={control}
          name="paymentDate"
          render={({ field }) => (
            <DatePicker
              date={field.value}
              onSelect={field.onChange}
              placeholder="Select payment date"
              showTime={true}
              disabled={false}
            />
          )}
        />
        {errors.paymentDate && (
          <p className="text-sm text-red-500">{errors.paymentDate.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Current date and time is auto-selected
        </p>
      </div>

      {/* Payment Method */}
      <div className="space-y-2">
        <Label htmlFor="paymentMethod" className="text-sm font-medium">
          Payment Method *
        </Label>
        <Controller
          control={control}
          name="paymentMethod"
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
            >
              <SelectTrigger id="paymentMethod" className="w-full">
                <SelectValue placeholder="Select payment method">
                  {field.value && (
                    <div className="flex items-center gap-2">
                      {getPaymentMethodIcon(field.value)}
                      <span>{field.value.replace('_', ' ')}</span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BANK_TRANSFER">
                  <div className="flex items-center gap-2">
                    <Landmark className="h-4 w-4" />
                    <span>Bank Transfer</span>
                  </div>
                </SelectItem>
                <SelectItem value="CREDIT_CARD">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span>Credit Card</span>
                  </div>
                </SelectItem>
                <SelectItem value="PAYPAL">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span>PayPal</span>
                  </div>
                </SelectItem>
                <SelectItem value="CASH">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4" />
                    <span>Cash</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.paymentMethod && (
          <p className="text-sm text-red-500">{errors.paymentMethod.message}</p>
        )}
      </div>

      {/* Reference Number */}
      <div className="space-y-2">
        <Label htmlFor="referenceNumber" className="text-sm font-medium">
          Reference Number
        </Label>
        <Input
          id="referenceNumber"
          {...register('referenceNumber')}
          placeholder="Transaction ID / Reference / Check Number"
          className="w-full"
        />
        <p className="text-xs text-muted-foreground">
          Optional: Enter transaction ID, check number, or reference
        </p>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes" className="text-sm font-medium">
          Notes
        </Label>
        <textarea
          id="notes"
          {...register('notes')}
          rows={3}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          placeholder="Any notes about this payment..."
        />
      </div>

      {/* Summary */}
      <div className="rounded-lg bg-muted/50 p-4 space-y-2">
        <h4 className="text-sm font-medium">Payment Summary</h4>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Invoice Total:</span>
          <span className="font-medium">{formatCurrency(invoice.totalAmount)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Previous Payments:</span>
          <span className="font-medium">{formatCurrency(invoice.amountPaid)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Pending Balance:</span>
          <span className="font-medium text-orange-600">{formatCurrency(maxAmount)}</span>
        </div>
        <div className="flex justify-between text-sm font-medium pt-2 border-t">
          <span>This Payment:</span>
          <span className="text-green-600">{formatCurrency(amount || 0)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Remaining After Payment:</span>
          <span className={`font-medium ${maxAmount - (amount || 0) > 0 ? 'text-orange-600' : 'text-green-600'}`}>
            {formatCurrency(Math.max(0, maxAmount - (amount || 0)))}
          </span>
        </div>
      </div>

      {/* Quick Amount Buttons */}
      <div className="flex flex-wrap gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setValue('amount', maxAmount)}
          className="flex-1"
        >
          Full Amount
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setValue('amount', Math.min(maxAmount, maxAmount / 2))}
          className="flex-1"
        >
          50%
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setValue('amount', Math.min(maxAmount, maxAmount * 0.25))}
          className="flex-1"
        >
          25%
        </Button>
      </div>

      {/* Form Actions */}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-2 pt-4 border-t">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel} 
          className="w-full sm:w-auto min-h-[44px]"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting || amount > maxAmount || amount <= 0} 
          className="w-full sm:w-auto min-h-[44px]"
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Recording Payment...
            </>
          ) : (
            'Record Payment'
          )}
        </Button>
      </div>
    </form>
  );
};