// src/components/settings/BillingTab.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollableDialog } from '@/components/ui/scrollable-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BankAccount, PaymentLink, BankAccountType } from '@/types';
import { useBilling } from '@/hooks/useBilling';
import { 
  Building2, 
  CreditCard, 
  Globe, 
  Plus, 
  Trash2, 
  Edit, 
  Copy, 
  ExternalLink,
  Check,
  AlertCircle,
  Loader2,
  Banknote,
  Wallet,
  Landmark
} from 'lucide-react';
import { CURRENCIES } from '@/constants/currencies';
import { BANK_ACCOUNT_TYPES, PAYMENT_PROVIDERS, getProviderByValue } from '@/constants/billing';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const BillingTab: React.FC = () => {
  const {
    settings,
    isLoading,
    createBankAccount,
    updateBankAccount,
    deleteBankAccount,
    createPaymentLink,
    updatePaymentLink,
    deletePaymentLink,
    setDefaultPaymentMethod,
    updatePaymentInstructions,
    isCreatingBank,
    isUpdatingBank,
    isDeletingBank,
    isCreatingLink,
    isUpdatingLink,
    isDeletingLink,
    isUpdatingDefault,
    isUpdatingInstructions,
  } = useBilling();

  const [showBankDialog, setShowBankDialog] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [editingBank, setEditingBank] = useState<BankAccount | null>(null);
  const [editingLink, setEditingLink] = useState<PaymentLink | null>(null);
  const [paymentInstructions, setPaymentInstructions] = useState('');
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  // Bank account form state
  const [bankForm, setBankForm] = useState({
    accountHolderName: '',
    bankName: '',
    accountType: 'CHECKING' as BankAccountType,
    routingNumber: '',
    accountNumber: '',
    currency: 'USD',
    isDefault: false,
  });

  // Payment link form state
  const [linkForm, setLinkForm] = useState({
    name: '',
    url: '',
    provider: 'PAYPAL' as PaymentLink['provider'],
    description: '',
    isDefault: false,
  });

  // Update payment instructions when settings load
  useEffect(() => {
    if (settings?.invoicePaymentInstructions) {
      setPaymentInstructions(settings.invoicePaymentInstructions);
    }
  }, [settings]);

  const resetBankForm = () => {
    setBankForm({
      accountHolderName: '',
      bankName: '',
      accountType: 'CHECKING',
      routingNumber: '',
      accountNumber: '',
      currency: 'USD',
      isDefault: false,
    });
    setEditingBank(null);
  };

  const resetLinkForm = () => {
    setLinkForm({
      name: '',
      url: '',
      provider: 'PAYPAL',
      description: '',
      isDefault: false,
    });
    setEditingLink(null);
  };

  const handleBankSubmit = async () => {
    if (editingBank) {
      await updateBankAccount({ 
        id: editingBank.id, 
        data: bankForm 
      });
    } else {
      await createBankAccount(bankForm);
    }
    setShowBankDialog(false);
    resetBankForm();
  };

  const handleLinkSubmit = async () => {
    if (editingLink) {
      await updatePaymentLink({ 
        id: editingLink.id, 
        data: linkForm 
      });
    } else {
      await createPaymentLink(linkForm);
    }
    setShowLinkDialog(false);
    resetLinkForm();
  };

  const handleEditBank = (bank: BankAccount) => {
    setEditingBank(bank);
    setBankForm({
      accountHolderName: bank.accountHolderName,
      bankName: bank.bankName,
      accountType: bank.accountType,
      routingNumber: bank.routingNumber,
      accountNumber: '', // Don't populate the actual number
      currency: bank.currency,
      isDefault: bank.isDefault,
    });
    setShowBankDialog(true);
  };

  const handleEditLink = (link: PaymentLink) => {
    setEditingLink(link);
    setLinkForm({
      name: link.name,
      url: link.url,
      provider: link.provider,
      description: link.description || '',
      isDefault: link.isDefault,
    });
    setShowLinkDialog(true);
  };

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopySuccess(id);
    setTimeout(() => setCopySuccess(null), 2000);
  };

  const handleDeleteBank = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this bank account?')) {
      await deleteBankAccount(id);
    }
  };

  const handleDeleteLink = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this payment link?')) {
      await deletePaymentLink(id);
    }
  };

  const handleSaveInstructions = async () => {
    await updatePaymentInstructions(paymentInstructions);
  };

  const getProviderIcon = (provider: string) => {
    const providerInfo = getProviderByValue(provider);
    return providerInfo.icon;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Payment Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Instructions</CardTitle>
          <CardDescription>
            These instructions will be included on invoices sent to clients.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <textarea
            value={paymentInstructions}
            onChange={(e) => setPaymentInstructions(e.target.value)}
            rows={4}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="e.g., Please include invoice number with payment. Bank transfers may take 2-3 business days to process."
          />
          <div className="flex justify-end">
            <Button 
              onClick={handleSaveInstructions} 
              disabled={isUpdatingInstructions}
            >
              {isUpdatingInstructions ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Instructions'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Default Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle>Default Payment Method</CardTitle>
          <CardDescription>
            Choose which payment method is selected by default on invoices.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant={settings?.defaultPaymentMethod === 'BANK' ? 'default' : 'outline'}
              onClick={() => setDefaultPaymentMethod('BANK')}
              disabled={isUpdatingDefault}
              className="flex-1"
            >
              <Landmark className="mr-2 h-4 w-4" />
              Bank Transfer
              {settings?.defaultPaymentMethod === 'BANK' && (
                <Check className="ml-2 h-4 w-4" />
              )}
            </Button>
            <Button
              variant={settings?.defaultPaymentMethod === 'PAYMENT_LINK' ? 'default' : 'outline'}
              onClick={() => setDefaultPaymentMethod('PAYMENT_LINK')}
              disabled={isUpdatingDefault}
              className="flex-1"
            >
              <Wallet className="mr-2 h-4 w-4" />
              Payment Link
              {settings?.defaultPaymentMethod === 'PAYMENT_LINK' && (
                <Check className="ml-2 h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bank Accounts */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Bank Accounts</CardTitle>
            <CardDescription>
              Add bank accounts for clients to send payments via wire transfer.
            </CardDescription>
          </div>
          <Button onClick={() => setShowBankDialog(true)} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Account
          </Button>
        </CardHeader>
        <CardContent>
          {settings?.bankAccounts.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No bank accounts</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add your first bank account to receive payments via wire transfer.
              </p>
              <Button variant="outline" onClick={() => setShowBankDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Bank Account
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {settings?.bankAccounts.map((account) => (
                <div
                  key={account.id}
                  className="relative flex flex-col sm:flex-row sm:items-start justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow"
                >
                  {account.isDefault && (
                    <Badge className="absolute top-2 right-2 sm:relative sm:top-0 sm:right-0 sm:ml-auto sm:mb-2 sm:order-last">
                      Default
                    </Badge>
                  )}
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                      <Landmark className="h-5 w-5 text-primary" />
                      <span className="font-semibold">{account.bankName}</span>
                      <Badge variant="outline" className="text-xs">
                        {BANK_ACCOUNT_TYPES.find(t => t.value === account.accountType)?.label || account.accountType}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Account Holder:</span>{' '}
                        <span className="font-medium">{account.accountHolderName}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Routing Number:</span>{' '}
                        <span className="font-medium">{account.routingNumber}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Account Number:</span>{' '}
                        <span className="font-medium">{account.accountNumber}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Currency:</span>{' '}
                        <span className="font-medium">{account.currency}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 sm:mt-0 sm:ml-4 justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditBank(account)}
                      disabled={isUpdatingBank}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-100"
                      onClick={() => handleDeleteBank(account.id)}
                      disabled={isDeletingBank}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Links */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Payment Links</CardTitle>
            <CardDescription>
              Add links to payment platforms like PayPal, Stripe, or Venmo.
            </CardDescription>
          </div>
          <Button onClick={() => setShowLinkDialog(true)} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Link
          </Button>
        </CardHeader>
        <CardContent>
          {settings?.paymentLinks.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <Wallet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No payment links</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add links to your preferred payment platforms.
              </p>
              <Button variant="outline" onClick={() => setShowLinkDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Payment Link
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {settings?.paymentLinks.map((link) => {
                const provider = getProviderByValue(link.provider);
                return (
                  <div
                    key={link.id}
                    className="relative flex flex-col sm:flex-row sm:items-start justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow"
                  >
                    {link.isDefault && (
                      <Badge className="absolute top-2 right-2 sm:relative sm:top-0 sm:right-0 sm:ml-auto sm:mb-2 sm:order-last">
                        Default
                      </Badge>
                    )}
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{provider.icon}</span>
                        <span className="font-semibold">{link.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {provider.label}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline flex items-center gap-1 break-all"
                        >
                          {link.url}
                          <ExternalLink className="h-3 w-3 shrink-0" />
                        </a>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6"
                          onClick={() => handleCopy(link.url, link.id)}
                        >
                          {copySuccess === link.id ? (
                            <Check className="h-3 w-3 text-green-600" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                      
                      {link.description && (
                        <p className="text-sm text-muted-foreground">
                          {link.description}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2 mt-4 sm:mt-0 sm:ml-4 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditLink(link)}
                        disabled={isUpdatingLink}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-100"
                        onClick={() => handleDeleteLink(link.id)}
                        disabled={isDeletingLink}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Bank Account Dialog */}
      <ScrollableDialog
        open={showBankDialog}
        onOpenChange={(open) => {
          if (!open) resetBankForm();
          setShowBankDialog(open);
        }}
        title={editingBank ? 'Edit Bank Account' : 'Add Bank Account'}
        description="Enter your bank account details for receiving payments."
        className="sm:max-w-[500px]"
        contentClassName="max-h-[600px]"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="accountHolderName">Account Holder Name *</Label>
            <Input
              id="accountHolderName"
              value={bankForm.accountHolderName}
              onChange={(e) => setBankForm({ ...bankForm, accountHolderName: e.target.value })}
              placeholder="John Doe or Business Name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bankName">Bank Name *</Label>
            <Input
              id="bankName"
              value={bankForm.bankName}
              onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })}
              placeholder="Chase, Barclays, etc."
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="accountType">Account Type *</Label>
            <Select
              value={bankForm.accountType}
              onValueChange={(value: BankAccountType) => 
                setBankForm({ ...bankForm, accountType: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BANK_ACCOUNT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="routingNumber">Routing Number *</Label>
              <Input
                id="routingNumber"
                value={bankForm.routingNumber}
                onChange={(e) => setBankForm({ ...bankForm, routingNumber: e.target.value })}
                placeholder="021000021"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number *</Label>
              <Input
                id="accountNumber"
                value={bankForm.accountNumber}
                onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value })}
                placeholder="Enter account number"
                type="password"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="currency">Currency *</Label>
            <Select
              value={bankForm.currency}
              onValueChange={(value) => setBankForm({ ...bankForm, currency: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name} ({currency.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="isDefaultBank"
              checked={bankForm.isDefault}
              onChange={(e) => setBankForm({ ...bankForm, isDefault: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="isDefaultBank" className="text-sm cursor-pointer">
              Set as default payment method
            </Label>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Bank account information is encrypted and stored securely.
            </AlertDescription>
          </Alert>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t mt-4">
          <Button variant="outline" onClick={() => setShowBankDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleBankSubmit} 
            disabled={isCreatingBank || isUpdatingBank}
          >
            {(isCreatingBank || isUpdatingBank) ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {editingBank ? 'Updating...' : 'Adding...'}
              </>
            ) : (
              <>{editingBank ? 'Update' : 'Add'} Account</>
            )}
          </Button>
        </div>
      </ScrollableDialog>

      {/* Add/Edit Payment Link Dialog */}
      <ScrollableDialog
        open={showLinkDialog}
        onOpenChange={(open) => {
          if (!open) resetLinkForm();
          setShowLinkDialog(open);
        }}
        title={editingLink ? 'Edit Payment Link' : 'Add Payment Link'}
        description="Add a link to your preferred payment platform."
        className="sm:max-w-[500px]"
        contentClassName="max-h-[600px]"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="linkName">Name *</Label>
            <Input
              id="linkName"
              value={linkForm.name}
              onChange={(e) => setLinkForm({ ...linkForm, name: e.target.value })}
              placeholder="PayPal, Stripe, etc."
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="provider">Provider *</Label>
            <Select
              value={linkForm.provider}
              onValueChange={(value: PaymentLink['provider']) => 
                setLinkForm({ ...linkForm, provider: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_PROVIDERS.map((provider) => (
                  <SelectItem key={provider.value} value={provider.value}>
                    <span className="flex items-center gap-2">
                      <span>{provider.icon}</span>
                      <span>{provider.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="url">Payment URL *</Label>
            <Input
              id="url"
              value={linkForm.url}
              onChange={(e) => setLinkForm({ ...linkForm, url: e.target.value })}
              placeholder="https://paypal.me/username"
              type="url"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              value={linkForm.description}
              onChange={(e) => setLinkForm({ ...linkForm, description: e.target.value })}
              placeholder="For credit card payments"
            />
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="isDefaultLink"
              checked={linkForm.isDefault}
              onChange={(e) => setLinkForm({ ...linkForm, isDefault: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="isDefaultLink" className="text-sm cursor-pointer">
              Set as default payment method
            </Label>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t mt-4">
          <Button variant="outline" onClick={() => setShowLinkDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleLinkSubmit} 
            disabled={isCreatingLink || isUpdatingLink}
          >
            {(isCreatingLink || isUpdatingLink) ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {editingLink ? 'Updating...' : 'Adding...'}
              </>
            ) : (
              <>{editingLink ? 'Update' : 'Add'} Link</>
            )}
          </Button>
        </div>
      </ScrollableDialog>
    </div>
  );
};