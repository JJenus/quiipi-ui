// src/components/subscriptions/SubscriptionCard.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Subscription } from '@/types';
import { formatDate, formatCurrency, getDaysUntil } from '@/utils/dateUtils';
import { ExpiryBadge } from './ExpiryBadge';
import { CalendarDays, RefreshCcw, Trash2, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/responsive-dialog';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface SubscriptionCardProps {
  subscription: Subscription;
  onRenew?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscription,
  onRenew,
  onDelete,
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const daysUntil = getDaysUntil(subscription.expiryDate);
  const isMobile = useMediaQuery("(max-width: 640px)");

  const handleDelete = () => {
    if (onDelete) {
      onDelete(subscription.id);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base sm:text-lg truncate">
                {subscription.name}
              </CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                {subscription.provider}
              </p>
            </div>
            <ExpiryBadge expiryDate={subscription.expiryDate} />
          </div>
        </CardHeader>
        
        <CardContent className="pb-2 flex-1">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <CalendarDays className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
              <span className="truncate">Expires: {formatDate(subscription.expiryDate, 'MMM d, yyyy')}</span>
            </div>
            
            <div className="flex items-baseline gap-1 flex-wrap">
              <span className="text-sm sm:text-base font-semibold">
                {formatCurrency(subscription.cost, subscription.currency)}
              </span>
              <span className="text-xs text-muted-foreground">
                / {subscription.billingCycle.toLowerCase()}
              </span>
            </div>
            
            {daysUntil > 0 && (
              <p className="text-xs text-muted-foreground">
                {daysUntil} days remaining
              </p>
            )}
            
            <div className="space-y-1 pt-1">
              {subscription.project && (
                <p className="text-xs text-muted-foreground truncate">
                  <span className="font-medium">Project:</span> {subscription.project.name}
                </p>
              )}
              {subscription.client && (
                <p className="text-xs text-muted-foreground truncate">
                  <span className="font-medium">Client:</span> {subscription.client.companyName}
                </p>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-2 border-t">
          {isMobile ? (
            // Mobile: Dropdown menu for actions
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full">
                  <MoreVertical className="h-4 w-4 mr-2" />
                  Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {onRenew && (
                  <DropdownMenuItem onClick={() => onRenew(subscription.id)}>
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    Renew
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem 
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // Desktop: Buttons side by side
            <div className="flex justify-end gap-2 w-full">
              {onRenew && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRenew(subscription.id)}
                  className="flex-1"
                >
                  <RefreshCcw className="mr-2 h-3 w-3" />
                  Renew
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDeleteDialog(true)}
                  className="px-2"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </CardFooter>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Subscription</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{subscription.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="w-full sm:w-auto"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};