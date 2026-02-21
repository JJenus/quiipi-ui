// src/pages/invoices/NewInvoice.tsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useInvoices } from '@/hooks/useInvoices';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InvoiceForm } from '@/components/invoices/InvoiceForm';
import { ArrowLeft } from 'lucide-react';
import { InvoiceCreateRequest } from '@/types';

export const NewInvoice: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { createInvoice } = useInvoices();
  
  // Get clientId and projectId from location state
  const clientId = location.state?.clientId;
  const projectId = location.state?.projectId;

  const handleSubmit = async (data: InvoiceCreateRequest) => {
    await createInvoice(data);
    navigate('/invoices');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/invoices')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Create New Invoice</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Create a new invoice for your client
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
        </CardHeader>
        <CardContent>
          <InvoiceForm
            onSubmit={handleSubmit}
            onCancel={() => navigate('/invoices')}
            clientId={clientId}
            initialData={projectId ? { projectId } : undefined}
          />
        </CardContent>
      </Card>
    </div>
  );
};