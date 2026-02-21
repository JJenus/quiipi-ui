// src/pages/SubscriptionDetails.tsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSubscription, useSubscriptions } from '@/hooks/useSubscriptions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/responsive-dialog';
import {
  ArrowLeft,
  Globe,
  Server,
  Shield,
  Mail,
  Wrench,
  Calendar,
  DollarSign,
  Link,
  Lock,
  FileText,
  Edit,
  Trash2,
  RefreshCcw,
  Copy,
  AlertCircle,
  Building2,
  FolderKanban
} from 'lucide-react';
import { formatDate, formatCurrency, getDaysUntil, getExpiryStatus } from '@/utils/dateUtils';
import { SubscriptionForm } from '@/components/subscriptions/SubscriptionForm';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SubscriptionType, SubscriptionStatus } from '@/types';

export const SubscriptionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRenewDialog, setShowRenewDialog] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  
  const { subscription, isLoading } = useSubscription(id!);
  const { updateSubscription, deleteSubscription, renewSubscription } = useSubscriptions();

  const getTypeIcon = (type: SubscriptionType) => {
    switch (type) {
      case 'DOMAIN':
        return <Globe className="h-5 w-5 text-blue-500" />;
      case 'HOSTING':
        return <Server className="h-5 w-5 text-green-500" />;
      case 'SSL':
        return <Shield className="h-5 w-5 text-purple-500" />;
      case 'EMAIL':
        return <Mail className="h-5 w-5 text-yellow-500" />;
      case 'TOOL':
        return <Wrench className="h-5 w-5 text-orange-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: SubscriptionStatus) => {
    const colors = {
      [SubscriptionStatus.ACTIVE]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      [SubscriptionStatus.EXPIRED]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      [SubscriptionStatus.CANCELLED]: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
      [SubscriptionStatus.PENDING]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getExpiryBadge = () => {
    if (!subscription) return null;
    const status = getExpiryStatus(subscription.expiryDate);
    const daysUntil = getDaysUntil(subscription.expiryDate);
    
    const colors = {
      healthy: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      critical: 'bg-orange-100 text-orange-800',
      expired: 'bg-red-100 text-red-800'
    };

    const labels = {
      healthy: 'Healthy',
      warning: 'Expiring Soon',
      critical: 'Critical',
      expired: 'Expired'
    };

    return (
      <Badge className={colors[status]}>
        {labels[status]} {!subscription.isExpired && `(${daysUntil} days left)`}
      </Badge>
    );
  };

  const handleUpdate = async (data: any) => {
    await updateSubscription({ id: id!, data });
    setShowEditDialog(false);
  };

  const handleDelete = async () => {
    await deleteSubscription(id!);
    setShowDeleteDialog(false);
    navigate('/subscriptions');
  };

  const handleRenew = async () => {
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    await renewSubscription({
      id: id!,
      data: {
        newExpiryDate: nextYear.toISOString().split('T')[0],
        renewalCost: subscription?.cost,
        notes: 'Renewed subscription'
      }
    });
    setShowRenewDialog(false);
  };

  const handleCopyCredentials = () => {
    if (subscription?.loginCredentials) {
      navigator.clipboard.writeText(subscription.loginCredentials);
      // You might want to show a toast notification here
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold">Subscription not found</h2>
        <p className="text-muted-foreground mt-2 mb-4">
          The subscription you're looking for doesn't exist or has been deleted.
        </p>
        <Button onClick={() => navigate('/subscriptions')}>
          Back to Subscriptions
        </Button>
      </div>
    );
  }

  const daysUntil = getDaysUntil(subscription.expiryDate);
  const isExpiring = daysUntil <= 30 && daysUntil > 0;
  const isExpired = daysUntil <= 0;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/subscriptions')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            {getTypeIcon(subscription.type)}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">{subscription.name}</h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                {subscription.provider}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {getExpiryBadge()}
          <Badge className={getStatusColor(subscription.status)}>
            {subscription.status}
          </Badge>
        </div>
      </div>

      {/* Expiry Alert */}
      {(isExpiring || isExpired) && (
        <Alert variant={isExpired ? "destructive" : "default"} className={isExpiring ? "border-yellow-200 dark:border-yellow-900" : ""}>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>
            {isExpired ? 'Subscription Expired' : 'Subscription Expiring Soon'}
          </AlertTitle>
          <AlertDescription className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span>
              {isExpired 
                ? `This subscription expired ${Math.abs(daysUntil)} days ago.`
                : `This subscription will expire in ${daysUntil} days.`}
            </span>
            {!isExpired && (
              <Button 
                size="sm" 
                variant={isExpiring ? "default" : "outline"}
                onClick={handleRenew}
                className="w-full sm:w-auto"
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Renew Now
              </Button>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => setShowEditDialog(true)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <Button variant="outline" onClick={handleRenew}>
          <RefreshCcw className="mr-2 h-4 w-4" />
          Renew
        </Button>
        <Button 
          variant="outline" 
          className="text-red-600 hover:text-red-700 hover:bg-red-100"
          onClick={() => setShowDeleteDialog(true)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column - Details */}
        <div className="space-y-6 md:col-span-2">
          {/* Overview Card */}
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Cost</p>
                  <p className="text-lg font-bold">
                    {formatCurrency(subscription.cost, subscription.currency)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    / {subscription.billingCycle.toLowerCase()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Start Date</p>
                  <p className="font-medium">{formatDate(subscription.startDate, 'MMM d, yyyy')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Expiry Date</p>
                  <p className={`font-medium ${isExpired ? 'text-red-600' : isExpiring ? 'text-orange-600' : ''}`}>
                    {formatDate(subscription.expiryDate, 'MMM d, yyyy')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Auto Renew</p>
                  <Badge variant={subscription.autoRenew ? "default" : "outline"}>
                    {subscription.autoRenew ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
              </div>

              {subscription.domainName && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-1">Domain Name</p>
                  <p className="font-medium">{subscription.domainName}</p>
                </div>
              )}

              {subscription.hostingPlan && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-1">Hosting Plan</p>
                  <p className="font-medium">{subscription.hostingPlan}</p>
                </div>
              )}

              {subscription.notes && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-1">Notes</p>
                  <p className="text-sm whitespace-pre-wrap">{subscription.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Association Card */}
          {(subscription.client || subscription.project) && (
            <Card>
              <CardHeader>
                <CardTitle>Associated With</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {subscription.client && (
                  <div 
                    className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/clients/${subscription.client!.id}`)}
                  >
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{subscription.client.companyName}</p>
                      <p className="text-sm text-muted-foreground">Client</p>
                    </div>
                  </div>
                )}
                {subscription.project && (
                  <div 
                    className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/projects/${subscription.project!.id}`)}
                  >
                    <FolderKanban className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{subscription.project.name}</p>
                      <p className="text-sm text-muted-foreground">Project</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Additional Info */}
        <div className="space-y-6">
          {/* Login Credentials Card */}
          {subscription.loginCredentials && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Login Credentials
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleCopyCredentials}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">
                    {showCredentials 
                      ? subscription.loginCredentials 
                      : '••••••••••••••••••••••'}
                  </pre>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setShowCredentials(!showCredentials)}
                  >
                    {showCredentials ? 'Hide' : 'Show'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Renewal Info Card */}
          {subscription.renewalUrl && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Link className="h-4 w-4" />
                  Renewal Link
                </CardTitle>
              </CardHeader>
              <CardContent>
                <a 
                  href={subscription.renewalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline break-all"
                >
                  {subscription.renewalUrl}
                </a>
              </CardContent>
            </Card>
          )}

          {/* Metadata Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subscription ID:</span>
                <span className="font-mono">{subscription.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Provider Account:</span>
                <span>{subscription.providerAccountId || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Notify Before:</span>
                <span>{subscription.notifyDaysBefore} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created:</span>
                <span>{formatDate(subscription.createdAt, 'MMM d, yyyy')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated:</span>
                <span>{formatDate(subscription.updatedAt, 'MMM d, yyyy')}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[800px] p-0 sm:p-6">
          <DialogHeader className="p-4 sm:p-0 border-b sm:border-0">
            <DialogTitle>Edit Subscription</DialogTitle>
          </DialogHeader>
          <div className="max-h-[calc(90vh-8rem)] overflow-y-auto px-4 pb-4 sm:px-0 sm:pb-0">
            <SubscriptionForm
              initialData={subscription}
              onSubmit={handleUpdate}
              onCancel={() => setShowEditDialog(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Subscription</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{subscription.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};