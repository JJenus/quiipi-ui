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
  CardHeader,
  CardTitle,
  CardDescription,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, Search, AlertCircle, Filter, Calendar, Globe, Server, MoreVertical } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, getDaysUntil } from '@/utils/dateUtils';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const Subscriptions: React.FC = () => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [mobileFilter, setMobileFilter] = useState('all');
  const [mobileView, setMobileView] = useState<'grid' | 'list'>('grid');
  const isMobile = useMediaQuery("(max-width: 768px)");
  const navigate = useNavigate();
  
  const { subscriptions, isLoading, createSubscription, renewSubscription, deleteSubscription } = useSubscriptions();
  const { subscriptions: expiringSubscriptions } = useExpiringSubscriptions(30);

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesSearch = 
      sub.name.toLowerCase().includes(search.toLowerCase()) ||
      sub.provider.toLowerCase().includes(search.toLowerCase()) ||
      sub.domainName?.toLowerCase().includes(search.toLowerCase()) ||
      sub.client?.companyName?.toLowerCase().includes(search.toLowerCase());
    
    const matchesType = typeFilter === 'all' || sub.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const getSubscriptionsByTab = () => {
    const tab = isMobile ? mobileFilter : activeTab;
    switch (tab) {
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
    { value: 'all', label: 'All', count: subscriptions.length, icon: null },
    { value: 'expiring', label: 'Expiring Soon', count: expiringSubscriptions.length, icon: Calendar },
    { value: 'domains', label: 'Domains', count: filteredSubscriptions.filter(s => s.type === 'DOMAIN').length, icon: Globe },
    { value: 'hosting', label: 'Hosting', count: filteredSubscriptions.filter(s => s.type === 'HOSTING').length, icon: Server },
  ];

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'DOMAIN', label: 'Domains' },
    { value: 'HOSTING', label: 'Hosting' },
    { value: 'SSL', label: 'SSL Certificates' },
    { value: 'EMAIL', label: 'Email' },
    { value: 'TOOL', label: 'Tools' },
    { value: 'OTHER', label: 'Other' },
  ];

  const stats = {
    total: subscriptions.length,
    totalCost: subscriptions.reduce((sum, sub) => sum + sub.cost, 0),
    expiringCount: expiringSubscriptions.length,
    domainsCount: subscriptions.filter(s => s.type === 'DOMAIN').length,
    hostingCount: subscriptions.filter(s => s.type === 'HOSTING').length,
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Subscriptions</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Track and manage all your subscriptions, domains, and hosting services.
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add Subscription
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px] p-0 sm:p-6">
            <DialogHeader className="p-4 sm:p-0 border-b sm:border-0">
              <DialogTitle>Create New Subscription</DialogTitle>
            </DialogHeader>
            <div className="max-h-[calc(90vh-8rem)] overflow-y-auto px-4 pb-4 sm:px-0 sm:pb-0">
              <SubscriptionForm
                onSubmit={async (data) => {
                  await createSubscription(data);
                  setIsCreateDialogOpen(false);
                }}
                onCancel={() => setIsCreateDialogOpen(false)}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-muted-foreground">Total</p>
            <p className="text-lg sm:text-2xl font-bold">{stats.total}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {formatCurrency(stats.totalCost)}/mo
            </p>
          </CardContent>
        </Card>
        <Card className="bg-yellow-50 dark:bg-yellow-950/20">
          <CardContent className="p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-muted-foreground">Expiring Soon</p>
            <p className="text-lg sm:text-2xl font-bold text-yellow-600">{stats.expiringCount}</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 dark:bg-blue-950/20">
          <CardContent className="p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-muted-foreground">Domains</p>
            <p className="text-lg sm:text-2xl font-bold text-blue-600">{stats.domainsCount}</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 dark:bg-green-950/20">
          <CardContent className="p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-muted-foreground">Hosting</p>
            <p className="text-lg sm:text-2xl font-bold text-green-600">{stats.hostingCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Alert for Expiring Subscriptions */}
      {expiringSubscriptions.length > 0 && (
        <Alert variant="destructive" className="border-yellow-200 dark:border-yellow-900">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Attention Required</AlertTitle>
          <AlertDescription className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span>
              You have {expiringSubscriptions.length} subscription
              {expiringSubscriptions.length > 1 ? 's' : ''} expiring in the next 30 days.
            </span>
            <Button
              variant="outline"
              size="sm"
              className="border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-white w-full sm:w-auto"
              onClick={() => isMobile ? setMobileFilter('expiring') : setActiveTab('expiring')}
            >
              View Expiring
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle>All Subscriptions</CardTitle>
            
            {/* Mobile View Toggle */}
            {isMobile && (
              <div className="flex items-center gap-2">
                <Button
                  variant={mobileView === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setMobileView('grid')}
                  className="h-8"
                >
                  Grid
                </Button>
                <Button
                  variant={mobileView === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setMobileView('list')}
                  className="h-8"
                >
                  List
                </Button>
              </div>
            )}
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={isMobile ? "Search..." : "Search subscriptions, domains..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 w-full"
              />
            </div>

            {!isMobile && (
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  {typeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            {/* Mobile Filter Dropdown */}
            {isMobile && (
              <Select value={mobileFilter} onValueChange={setMobileFilter}>
                <SelectTrigger className="w-full">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  {tabs.map(tab => (
                    <SelectItem key={tab.value} value={tab.value}>
                      <div className="flex items-center justify-between w-full">
                        <span>{tab.label}</span>
                        {tab.count > 0 && (
                          <Badge 
                            variant={tab.value === 'expiring' ? 'destructive' : 'secondary'} 
                            className="ml-2"
                          >
                            {tab.count}
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Desktop Tabs */}
          {!isMobile && (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <TabsTrigger key={tab.value} value={tab.value} className="relative">
                      <div className="flex items-center gap-2">
                        {Icon && <Icon className="h-4 w-4" />}
                        <span>{tab.label}</span>
                        {tab.count > 0 && (
                          <Badge 
                            variant={tab.value === 'expiring' ? 'destructive' : 'secondary'} 
                            className="ml-1"
                          >
                            {tab.count}
                          </Badge>
                        )}
                      </div>
                    </TabsTrigger>
                  );
                })}
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
                {search || typeFilter !== 'all' || (isMobile ? mobileFilter !== 'all' : activeTab !== 'all')
                  ? 'No subscriptions match your filters'
                  : 'No subscriptions found'}
              </div>
              {(search || typeFilter !== 'all' || (isMobile ? mobileFilter !== 'all' : activeTab !== 'all')) ? (
                <Button variant="outline" onClick={() => {
                  setSearch('');
                  setTypeFilter('all');
                  setActiveTab('all');
                  setMobileFilter('all');
                }}>
                  Clear Filters
                </Button>
              ) : (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add your first subscription
                </Button>
              )}
            </div>
          )}

          {/* Subscriptions Grid View */}
          {!isLoading && displayedSubscriptions.length > 0 && (!isMobile || mobileView === 'grid') && (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {displayedSubscriptions.map((subscription) => (
                <SubscriptionCard
                  key={subscription.id}
                  subscription={subscription}
                  onRenew={(id) => {
                    // You might want to open a renewal dialog here
                    const newExpiryDate = new Date();
                    newExpiryDate.setFullYear(newExpiryDate.getFullYear() + 1);
                    renewSubscription({ 
                      id, 
                      data: { 
                        newExpiryDate: newExpiryDate.toISOString().split('T')[0],
                        renewalCost: subscription.cost,
                        notes: 'Auto-renewed'
                      } 
                    });
                  }}
                  onDelete={deleteSubscription}
                />
              ))}
            </div>
          )}

          {/* Mobile List View */}
          {!isLoading && displayedSubscriptions.length > 0 && isMobile && mobileView === 'list' && (
            <div className="space-y-2">
              {displayedSubscriptions.map((subscription) => {
                const daysUntil = getDaysUntil(subscription.expiryDate);
                return (
                  <div
                    key={subscription.id}
                    className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/subscriptions/${subscription.id}`)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {subscription.type === 'DOMAIN' && <Globe className="h-4 w-4 text-blue-500" />}
                        {subscription.type === 'HOSTING' && <Server className="h-4 w-4 text-green-500" />}
                        <p className="font-medium text-sm truncate">{subscription.name}</p>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{subscription.provider}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs">
                        <span>{formatCurrency(subscription.cost, subscription.currency)}</span>
                        <span>•</span>
                        <span className={cn(
                          daysUntil <= 7 ? 'text-red-600' : 
                          daysUntil <= 30 ? 'text-yellow-600' : 
                          'text-muted-foreground'
                        )}>
                          {daysUntil} days left
                        </span>
                      </div>
                    </div>
                    <Badge variant="outline" className={cn(
                      subscription.type === 'DOMAIN' ? 'border-blue-200 text-blue-700' :
                      subscription.type === 'HOSTING' ? 'border-green-200 text-green-700' :
                      'border-gray-200'
                    )}>
                      {subscription.type}
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};