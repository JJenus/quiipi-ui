// src/pages/clients/NewClient.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useClients } from '@/hooks/useClients';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClientForm } from '@/components/clients/ClientForm';
import { ArrowLeft } from 'lucide-react';
import { ClientCreateRequest } from '@/types';

export const NewClient: React.FC = () => {
  const navigate = useNavigate();
  const { createClient } = useClients();

  const handleSubmit = async (data: ClientCreateRequest) => {
    await createClient(data);
    navigate('/clients');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/clients')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Create New Client</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Add a new client to your portfolio
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientForm
            onSubmit={handleSubmit}
            onCancel={() => navigate('/clients')}
          />
        </CardContent>
      </Card>
    </div>
  );
};