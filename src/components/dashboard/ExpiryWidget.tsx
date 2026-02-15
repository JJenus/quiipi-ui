// src/components/dashboard/ExpiryWidget.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ExpiringItem } from '@/services/dashboard.service';
import { formatDate, getDaysUntil } from '@/utils/dateUtils';
import { AlertCircle, Clock, Globe, Server } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface ExpiryWidgetProps {
  items: ExpiringItem[] | undefined;
  title: string;
}

const getIcon = (type: string) => {
  switch (type) {
    case 'DOMAIN':
      return <Globe className="h-4 w-4" />;
    case 'HOSTING':
      return <Server className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'CRITICAL':
      return 'bg-red-100 text-red-800';
    case 'WARNING':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-green-100 text-green-800';
  }
};

export const ExpiryWidget: React.FC<ExpiryWidgetProps> = ({ items = [], title }) => {
  const navigate = useNavigate();

  if (!items || items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No expiring items</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between space-x-4 rounded-lg border p-3"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{getIcon(item.type)}</div>
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.relatedTo}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge className={getStatusColor(item.status)}>
                        {item.daysLeft} days left
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(item.expiryDate)}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (item.type === 'PROJECT_DEADLINE') {
                      navigate(`/projects/${item.id}`);
                    } else {
                      navigate(`/subscriptions/${item.id}`);
                    }
                  }}
                >
                  View
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};