import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSubscription } from '@/hooks/useSubscriptions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';
import { formatDate, formatCurrency } from '@/utils/dateUtils';
import { ExpiryBadge } from '@/components/subscriptions/ExpiryBadge';

export const SubscriptionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // We need to add this hook - for now using placeholder
  const isLoading = false;
  const subscription = null;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Subscription not found</h2>
        <Button onClick={() => navigate('/subscriptions')} className="mt-4">
          Back to Subscriptions
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/subscriptions')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Subscription Details</h1>
          <p className="text-muted-foreground">ID: {id}</p>
        </div>
      </div>
      {/* Subscription details content */}
    </div>
  );
};
