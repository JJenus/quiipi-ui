// Improved ExpiryWidget with better visual hierarchy
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ExpiringItem } from '@/services/dashboard.service';
import { formatDate } from '@/utils/dateUtils';
import { AlertCircle, Clock, Globe, Server, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface ExpiryWidgetProps {
  items: ExpiringItem[] | undefined;
  title: string;
}

const getIcon = (type: string) => {
  const iconClass = "h-4 w-4";
  switch (type) {
    case 'DOMAIN':
      return <Globe className={iconClass} />;
    case 'HOSTING':
      return <Server className={iconClass} />;
    default:
      return <Calendar className={iconClass} />;
  }
};

const getStatusConfig = (status: string, daysLeft: number) => {
  if (daysLeft <= 3) {
    return {
      badge: 'destructive',
      text: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: AlertCircle
    };
  }
  if (daysLeft <= 7) {
    return {
      badge: 'warning',
      text: 'text-yellow-600',
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: Clock
    };
  }
  return {
    badge: 'secondary',
    text: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: Clock
  };
};

export const ExpiryWidget: React.FC<ExpiryWidgetProps> = ({ items = [], title }) => {
  const navigate = useNavigate();

  if (!items || items.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-muted p-3 mb-3">
              <Clock className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No expiring items</p>
            <p className="text-xs text-muted-foreground mt-1">Everything is up to date</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Badge variant="outline" className="ml-2">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[350px] pr-4 -mr-4">
          <div className="space-y-3">
            {items.map((item) => {
              const statusConfig = getStatusConfig(item.status, item.daysLeft);
              const StatusIcon = statusConfig.icon;
              
              return (
                <div
                  key={item.id}
                  className={cn(
                    "group relative rounded-lg border p-4 transition-all hover:shadow-md",
                    statusConfig.bg,
                    statusConfig.border
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className={cn(
                        "mt-0.5 rounded-full p-2",
                        statusConfig.bg.replace('50', '100')
                      )}>
                        {getIcon(item.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-medium truncate">{item.name}</p>
                          <Badge variant={statusConfig.badge as any} className="shrink-0">
                            {item.daysLeft} days
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 truncate">
                          {item.relatedTo}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(item.expiryDate)}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                            <StatusIcon className={cn("h-3 w-3", statusConfig.text)} />
                            <span className={cn("font-medium", statusConfig.text)}>
                              {item.daysLeft <= 3 ? 'Urgent' : item.daysLeft <= 7 ? 'Soon' : 'Upcoming'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
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
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};