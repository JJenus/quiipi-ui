// src/components/subscriptions/SubscriptionCard.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Subscription } from '@/types';
import { formatDate, formatCurrency, getDaysUntil } from '@/utils/dateUtils';
import { ExpiryBadge } from './ExpiryBadge';
import { CalendarDays, RefreshCcw, Trash2, MoreVertical, Globe, Server } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface SubscriptionCardProps {
  subscription: Subscription;
  onRenew?: (id: string, data: { newExpiryDate: string; renewalCost?: number; notes?: string }) => void;
  onDelete?: (id: string) => void;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscription,
  onRenew,
  onDelete,
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRenewDialog, setShowRenewDialog] = useState(false);
  const [renewalData, setRenewalData] = useState({
    newExpiryDate: '',
    renewalCost: subscription.cost,
    notes: '',
  });
  
  const daysUntil = getDaysUntil(subscription.expiryDate);
  const isMobile = useMediaQuery("(max-width: 640px)");
  const navigate = useNavigate();

  const getTypeIcon = () => {
    switch (subscription.type) {
      case 'DOMAIN':
        return <Globe className="h-4 w-4 text-blue-500" />;
      case 'HOSTING':
        return <Server className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  const handleRenew = () => {
    if (onRenew && renewalData.newExpiryDate) {
      onRenew(subscription.id, renewalData);
      setShowRenewDialog(false);
      setRenewalData({
        newExpiryDate: '',
        renewalCost: subscription.cost,
        notes: '',
      });
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(subscription.id);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <Card 
        className="h-full flex flex-col hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        onClick={() => navigate(`/subscriptions/${subscription.id}`)}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {getTypeIcon()}
                <CardTitle className="text-base sm:text-lg truncate">
                  {subscription.name}
                </CardTitle>
              </div>
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
              <span className="truncate">
                Expires: {formatDate(subscription.expiryDate, 'MMM d, yyyy')}
              </span>
            </div>
            
            <div className="flex items-baseline gap-1 flex-wrap">
              <span className="text-sm sm:text-base font-semibold">
                {formatCurrency(subscription.cost, subscription.currency)}
              </span>
              <span className="text-xs text-muted-foreground">
                / {subscription.billingCycle.toLowerCase()}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className={cn(
                "text-xs font-medium",
                daysUntil <= 7 ? 'text-red-600' : 
                daysUntil <= 30 ? 'text-yellow-600' : 
                'text-muted-foreground'
              )}>
                {daysUntil > 0 ? `${daysUntil} days remaining` : 'Expired'}
              </span>
              {subscription.autoRenew && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                  Auto-renew
                </span>
              )}
            </div>
            
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

            {subscription.domainName && (
              <p className="text-xs text-muted-foreground truncate">
                <span className="font-medium">Domain:</span> {subscription.domainName}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="pt-2 border-t">
          {isMobile ? (
            // Mobile: Dropdown menu for actions
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="sm" className="w-full">
                  <MoreVertical className="h-4 w-4 mr-2" />
                  Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {onRenew && (
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    const nextYear = new Date();
                    nextYear.setFullYear(nextYear.getFullYear() + 1);
                    setRenewalData({
                      ...renewalData,
                      newExpiryDate: nextYear.toISOString().split('T')[0],
                    });
                    setShowRenewDialog(true);
                  }}>
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    Renew
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteDialog(true);
                    }}
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
                  onClick={(e) => {
                    e.stopPropagation();
                    const nextYear = new Date();
                    nextYear.setFullYear(nextYear.getFullYear() + 1);
                    setRenewalData({
                      ...renewalData,
                      newExpiryDate: nextYear.toISOString().split('T')[0],
                    });
                    setShowRenewDialog(true);
                  }}
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
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteDialog(true);
                  }}
                  className="px-2 text-red-600 hover:text-red-700 hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </CardFooter>
      </Card>

      {/* Renew Dialog */}
      <Dialog open={showRenewDialog} onOpenChange={setShowRenewDialog}>
        <DialogContent className="sm:max-w-[425px]" onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Renew Subscription</DialogTitle>
            <DialogDescription>
              Enter the new expiry date and any renewal details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newExpiryDate">New Expiry Date *</Label>
              <Input
                id="newExpiryDate"
                type="date"
                value={renewalData.newExpiryDate}
                onChange={(e) => setRenewalData({ ...renewalData, newExpiryDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="renewalCost">Renewal Cost</Label>
              <Input
                id="renewalCost"
                type="number"
                step="0.01"
                value={renewalData.renewalCost}
                onChange={(e) => setRenewalData({ ...renewalData, renewalCost: parseFloat(e.target.value) })}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                rows={3}
                value={renewalData.notes}
                onChange={(e) => setRenewalData({ ...renewalData, notes: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Any notes about this renewal..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRenewDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleRenew} disabled={!renewalData.newExpiryDate}>
              Renew
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]" onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Delete Subscription</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{subscription.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};