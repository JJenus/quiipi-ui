import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useClient } from '@/hooks/useClients';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Mail, Phone, Globe, MapPin } from 'lucide-react';
import { formatAddress } from '@/utils/formatters';
import { formatCurrency } from '@/utils/dateUtils';

export const ClientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { client, isLoading } = useClient(id!);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Client not found</h2>
        <Button onClick={() => navigate('/clients')} className="mt-4">
          Back to Clients
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/clients')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{client.companyName}</h1>
          <p className="text-muted-foreground">Client Details</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a href={`mailto:${client.email}`} className="text-sm hover:underline">
                {client.email}
              </a>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <a href={`tel:${client.phone}`} className="text-sm hover:underline">
                {client.phone}
              </a>
            </div>
            {client.website && (
              <div className="flex items-center space-x-3">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <a href={client.website} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">
                  {client.website}
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Billing Address</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-3">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
              <p className="text-sm">{formatAddress(client.billingAddress)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Financial Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Pending Balance:</span>
              <span className="font-medium">{formatCurrency(client.pendingBalance || 0, client.currency)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Credit Limit:</span>
              <span className="font-medium">{formatCurrency(client.creditLimit || 0, client.currency)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Payment Terms:</span>
              <span className="font-medium">{client.paymentTerms || 'N/A'}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="projects">
        <TabsList>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
        </TabsList>
        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No projects found</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle>Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No invoices found</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="subscriptions">
          <Card>
            <CardHeader>
              <CardTitle>Subscriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No subscriptions found</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
