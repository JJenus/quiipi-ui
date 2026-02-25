// src/hooks/useBilling.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { billingService } from '@/services/billing.service';
import { useUIStore } from '@/store/uiStore';
import { 
  BillingSettings, 
  BankAccount, 
  PaymentLink,
  CreateBankAccountRequest,
  CreatePaymentLinkRequest 
} from '@/types';

export const useBilling = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useUIStore();

  const {
    data: settings,
    isLoading,
    error,
    refetch,
  } = useQuery<BillingSettings>({
    queryKey: ['billing-settings'],
    queryFn: () => billingService.getBillingSettings(),
  });

  const createBankAccount = useMutation({
    mutationFn: (data: CreateBankAccountRequest) => billingService.createBankAccount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing-settings'] });
      addNotification({
        type: 'success',
        message: 'Bank account added successfully',
        duration: 3000,
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        message: error.message || 'Failed to add bank account',
        duration: 5000,
      });
    },
  });

  const updateBankAccount = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BankAccount> }) =>
      billingService.updateBankAccount(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing-settings'] });
      addNotification({
        type: 'success',
        message: 'Bank account updated successfully',
        duration: 3000,
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        message: error.message || 'Failed to update bank account',
        duration: 5000,
      });
    },
  });

  const deleteBankAccount = useMutation({
    mutationFn: (id: string) => billingService.deleteBankAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing-settings'] });
      addNotification({
        type: 'success',
        message: 'Bank account deleted successfully',
        duration: 3000,
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        message: error.message || 'Failed to delete bank account',
        duration: 5000,
      });
    },
  });

  const createPaymentLink = useMutation({
    mutationFn: (data: CreatePaymentLinkRequest) => billingService.createPaymentLink(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing-settings'] });
      addNotification({
        type: 'success',
        message: 'Payment link added successfully',
        duration: 3000,
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        message: error.message || 'Failed to add payment link',
        duration: 5000,
      });
    },
  });

  const updatePaymentLink = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PaymentLink> }) =>
      billingService.updatePaymentLink(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing-settings'] });
      addNotification({
        type: 'success',
        message: 'Payment link updated successfully',
        duration: 3000,
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        message: error.message || 'Failed to update payment link',
        duration: 5000,
      });
    },
  });

  const deletePaymentLink = useMutation({
    mutationFn: (id: string) => billingService.deletePaymentLink(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing-settings'] });
      addNotification({
        type: 'success',
        message: 'Payment link deleted successfully',
        duration: 3000,
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        message: error.message || 'Failed to delete payment link',
        duration: 5000,
      });
    },
  });

  const setDefaultPaymentMethod = useMutation({
    mutationFn: (method: 'BANK' | 'PAYMENT_LINK') => 
      billingService.setDefaultPaymentMethod(method),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing-settings'] });
      addNotification({
        type: 'success',
        message: 'Default payment method updated',
        duration: 3000,
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        message: error.message || 'Failed to update default payment method',
        duration: 5000,
      });
    },
  });

  const updatePaymentInstructions = useMutation({
    mutationFn: (instructions: string) => 
      billingService.updatePaymentInstructions(instructions),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing-settings'] });
      addNotification({
        type: 'success',
        message: 'Payment instructions updated',
        duration: 3000,
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        message: error.message || 'Failed to update payment instructions',
        duration: 5000,
      });
    },
  });

  return {
    settings,
    isLoading,
    error,
    refetch,
    createBankAccount: createBankAccount.mutate,
    updateBankAccount: updateBankAccount.mutate,
    deleteBankAccount: deleteBankAccount.mutate,
    createPaymentLink: createPaymentLink.mutate,
    updatePaymentLink: updatePaymentLink.mutate,
    deletePaymentLink: deletePaymentLink.mutate,
    setDefaultPaymentMethod: setDefaultPaymentMethod.mutate,
    updatePaymentInstructions: updatePaymentInstructions.mutate,
    isCreatingBank: createBankAccount.isPending,
    isUpdatingBank: updateBankAccount.isPending,
    isDeletingBank: deleteBankAccount.isPending,
    isCreatingLink: createPaymentLink.isPending,
    isUpdatingLink: updatePaymentLink.isPending,
    isDeletingLink: deletePaymentLink.isPending,
    isUpdatingDefault: setDefaultPaymentMethod.isPending,
    isUpdatingInstructions: updatePaymentInstructions.isPending,
  };
};