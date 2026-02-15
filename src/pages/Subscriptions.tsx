// src/pages/Subscriptions.tsx
import React, { useState } from 'react';
import { useSubscriptions, useExpiringSubscriptions } from '@/hooks/useSubscriptions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SubscriptionCard } from '@/components/subscriptions/SubscriptionCard';
import { SubscriptionForm } from '@/components/subscriptions/SubscriptionForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/responsive-dialog';
import { Plus, Search, AlertCircle, Filter, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Skeleton } from '@/components/ui/skeleton';

export const Subscriptions: React.FC = () => {
  const [search, setSearch] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  const { subscriptions, isLoading, createSubscription, renewSubscription, deleteSubscription } = useSubscriptions();
  const { subscriptions: expiringSubscriptions } = useExpiringSubscriptions(30);

  const filteredSubscriptions = subscriptions.filter((sub) =>
    sub.name.toLowerCase().includes(search.toLowerCase()) ||
    sub.provider.toLowerCase().includes(search.toLowerCase()) ||
    sub.domainName?.toLowerCase().includes(search.toLowerCase())
  );

  const getSubscriptionsByTab = () => {
    switch (activeTab) {
      case 'expiring':
        return expiringSubscriptions;
      case 'domains':
        return filteredSubscriptions.filter((sub) => sub.type === 'DOMAIN');
      case 'hosting':
        return filteredSubscriptions.filter((sub) => sub.type === 'HOSTING');
      default:
        return filteredSubscriptions;
    }
  };

  const displayedSubscriptions = getSubscriptionsByTab();

  const tabs = [
    { value: 'all', label: 'All', count: subscriptions.length },
    { value: 'expiring', label: 'Expiring Soon', count: expiringSubscriptions.length },
    { value: 'domains', label: 'Domains', count: filteredSubscriptions.filter(s => s.type === 'DOMAIN').length },
    { value: 'hosting', label: 'Hosting', count: filteredSubscriptions.filter(s => s.type === 'HOSTING').length },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Subscriptions</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Track and manage all your subscriptions, domains, and hosting services.
          </p>
        </div>
        
        {/* Create Button - Different for mobile/desktop */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              {isMobile ? 'Add' : 'Add Subscription'}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] p-4 sm:p-6">
            <DialogHeader>
              <DialogTitle>Create New Subscription</DialogTitle>
            </DialogHeader>
            <SubscriptionForm
              onSubmit={async (data) => {
                await createSubscription(data);
                setIsCreateDialogOpen(false);
              }}
              onCancel={() => setIsCreateDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Alert for Expiring Subscriptions */}
      {expiringSubscriptions.length > 0 && (
        <Alert variant="destructive" className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 mt-0.5" />
            <div>
              <AlertTitle>Attention Required</AlertTitle>
              <AlertDescription>
                You have {expiringSubscriptions.length} subscription
                {expiringSubscriptions.length > 1 ? 's' : ''} expiring in the next 30 days.
              </AlertDescription>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full sm:w-auto border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
            onClick={() => setActiveTab('expiring')}
          >
            View Now
          </Button>
        </Alert>
      )}

      {/* Main Content Card */}
      <Card>
        <CardHeader className="space-y-4">
          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={isMobile ? "Search..." : "Search subscriptions..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 w-full"
              />
            </div>
            
            {/* Mobile Filter Button */}
            {isMobile && (
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="shrink-0">
                    <Filter className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[80vh] rounded-t-xl">
                  <SheetHeader>
                    <SheetTitle>Filter Subscriptions</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4">
                    <Tabs value={activeTab} onValueChange={(value) => {
                      setActiveTab(value);
                      setIsFilterOpen(false);
                    }} className="w-full">
                      <TabsList className="grid grid-cols-2 gap-2 h-auto p-2">
                        {tabs.map(tab => (
                          <TabsTrigger 
                            key={tab.value} 
                            value={tab.value}
                            className="flex items-center justify-between px-3 py-2"
                          >
                            <span>{tab.label}</span>
                            {tab.count > 0 && (
                              <Badge variant="secondary" className="ml-2">
                                {tab.count}
                              </Badge>
                            )}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </Tabs>
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>

          {/* Desktop Tabs */}
          {!isMobile && (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                {tabs.map(tab => (
                  <TabsTrigger key={tab.value} value={tab.value} className="relative">
                    {tab.label}
                    {tab.count > 0 && (
                      <Badge 
                        variant={tab.value === 'expiring' ? 'destructive' : 'secondary'} 
                        className="ml-2"
                      >
                        {tab.count}
                      </Badge>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          )}
        </CardHeader>

        <CardContent>
          {/* Loading State */}
          {isLoading && (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && displayedSubscriptions.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                No subscriptions found
              </div>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add your first subscription
              </Button>
            </div>
          )}

          {/* Subscriptions Grid */}
          {!isLoading && displayedSubscriptions.length > 0 && (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {displayedSubscriptions.map((subscription) => (
                <SubscriptionCard
                  key={subscription.id}
                  subscription={subscription}
                  onRenew={(id) => {
                    // You might want to open a renewal dialog here
                    renewSubscription({ id, data: { newExpiryDate: '' } });
                  }}
                  onDelete={deleteSubscription}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};