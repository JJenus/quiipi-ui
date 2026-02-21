// src/pages/subscriptions/NewSubscription.tsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SubscriptionForm } from '@/components/subscriptions/SubscriptionForm';
import { ArrowLeft } from 'lucide-react';
import { SubscriptionCreateRequest } from '@/types';

export const NewSubscription: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { createSubscription } = useSubscriptions();
  
  // Get clientId and projectId from location state
  const clientId = location.state?.clientId;
  const projectId = location.state?.projectId;

  const handleSubmit = async (data: SubscriptionCreateRequest) => {
    await createSubscription(data);
    navigate('/subscriptions');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/subscriptions')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Add New Subscription</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Track a new subscription, domain, or hosting service
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subscription Details</CardTitle>
        </CardHeader>
        <CardContent>
          <SubscriptionForm
            onSubmit={handleSubmit}
            onCancel={() => navigate('/subscriptions')}
            clientId={clientId}
            projectId={projectId}
          />
        </CardContent>
      </Card>
    </div>
  );
};