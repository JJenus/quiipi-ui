import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getExpiryStatus } from '@/utils/dateUtils';

interface ExpiryBadgeProps {
  expiryDate: string;
  className?: string;
}

export const ExpiryBadge: React.FC<ExpiryBadgeProps> = ({ expiryDate, className }) => {
  const status = getExpiryStatus(expiryDate);
  
  const variants = {
    healthy: 'bg-green-100 text-green-800 hover:bg-green-100',
    warning: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
    critical: 'bg-orange-100 text-orange-800 hover:bg-orange-100',
    expired: 'bg-red-100 text-red-800 hover:bg-red-100',
  };

  const labels = {
    healthy: 'Healthy',
    warning: 'Expiring Soon',
    critical: 'Critical',
    expired: 'Expired',
  };

  return (
    <Badge className={cn(variants[status], className)} variant="outline">
      {labels[status]}
    </Badge>
  );
};
