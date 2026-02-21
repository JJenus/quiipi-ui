// src/pages/ProjectDetails.tsx (enhanced)
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProject, useProjectInvoices } from '@/hooks/useProjects';
import { useProjectSubscriptions } from '@/hooks/useProjectSubscriptions';
// import { useProjectInvoices } from '@/hooks/useProjectInvoices'; // Add this hook
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  Github, 
  Globe, 
  Server,
  FileText,
  Clock,
  AlertCircle
} from 'lucide-react';
import { formatDate, formatCurrency, getDaysUntil } from '@/utils/dateUtils';
import { ProjectStatus } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { project, isLoading: projectLoading } = useProject(id!);
  const { subscriptions, isLoading: subsLoading } = useProjectSubscriptions(id!);
  const { invoices, isLoading: invoicesLoading } = useProjectInvoices(id!);

  const getStatusColor = (status: ProjectStatus) => {
    const colors = {
      [ProjectStatus.PLANNING]: 'bg-blue-100 text-blue-800',
      [ProjectStatus.IN_PROGRESS]: 'bg-green-100 text-green-800',
      [ProjectStatus.ON_HOLD]: 'bg-yellow-100 text-yellow-800',
      [ProjectStatus.COMPLETED]: 'bg-gray-100 text-gray-800',
      [ProjectStatus.CANCELLED]: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      LOW: 'bg-gray-100 text-gray-800',
      MEDIUM: 'bg-blue-100 text-blue-800',
      HIGH: 'bg-orange-100 text-orange-800',
      CRITICAL: 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const getInvoiceStatusColor = (status: string) => {
    const colors = {
      PAID: 'bg-green-100 text-green-800',
      PARTIALLY_PAID: 'bg-yellow-100 text-yellow-800',
      OVERDUE: 'bg-red-100 text-red-800',
      SENT: 'bg-blue-100 text-blue-800',
      DRAFT: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (projectLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Project not found</h2>
        <Button onClick={() => navigate('/projects')} className="mt-4">
          Back to Projects
        </Button>
      </div>
    );
  }

  const daysUntil = getDaysUntil(project.deadline);
  const budgetUsed = project.estimatedBudget > 0 
    ? (project.actualCost / project.estimatedBudget) * 100 
    : 0;
  const isNearDeadline = daysUntil <= 7 && daysUntil > 0;
  const isOverdue = daysUntil < 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/projects')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <p className="text-muted-foreground">
              Client: {project.client?.companyName || 'No client assigned'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge className={getStatusColor(project.status)}>
            {project.status}
          </Badge>
          <Badge className={getPriorityColor(project.priority)}>
            {project.priority} Priority
          </Badge>
          {isOverdue && (
            <Badge variant="destructive" className="animate-pulse">
              Overdue
            </Badge>
          )}
          {isNearDeadline && !isOverdue && (
            <Badge variant="destructive" className="animate-pulse">
              {daysUntil} days left
            </Badge>
          )}
        </div>
      </div>

      {/* Stats Cards - Enhanced */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {formatDate(project.startDate, 'MMM d')} - {formatDate(project.deadline, 'MMM d, yyyy')}
            </p>
            <p className={`text-xs mt-1 ${
              isOverdue ? 'text-red-600' : 
              isNearDeadline ? 'text-orange-600' : 
              'text-muted-foreground'
            }`}>
              {isOverdue ? `${Math.abs(daysUntil)} days overdue` : 
               isNearDeadline ? `${daysUntil} days remaining` : 
               `${daysUntil} days until deadline`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Budget
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold">
              {formatCurrency(project.actualCost)}
            </p>
            <p className="text-xs text-muted-foreground">
              of {formatCurrency(project.estimatedBudget)} ({budgetUsed.toFixed(1)}%)
            </p>
            {project.estimatedBudget > 0 && (
              <Progress value={budgetUsed} className="mt-2" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold text-orange-600">
              {formatCurrency(project.pendingBalance)}
            </p>
            <p className="text-xs text-muted-foreground">
              Outstanding invoices
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Hourly Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold">
              {formatCurrency(project.hourlyRate)}/hr
            </p>
            <p className="text-xs text-muted-foreground">
              Billable rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subscriptions">
            Subscriptions
            {subscriptions.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {subscriptions.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="invoices">
            Invoices
            {invoices.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {invoices.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {project.description || 'No description provided'}
              </p>
            </CardContent>
          </Card>

          {/* Links */}
          {(project.repositoryUrl || project.stagingUrl || project.productionUrl) && (
            <Card>
              <CardHeader>
                <CardTitle>Project Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {project.repositoryUrl && (
                  <div className="flex items-center gap-2">
                    <Github className="h-4 w-4" />
                    <a 
                      href={project.repositoryUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Repository
                    </a>
                  </div>
                )}
                {project.stagingUrl && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <a 
                      href={project.stagingUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Staging Site
                    </a>
                  </div>
                )}
                {project.productionUrl && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <a 
                      href={project.productionUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Production Site
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="subscriptions">
          <Card>
            <CardHeader>
              <CardTitle>Project Subscriptions</CardTitle>
            </CardHeader>
            <CardContent>
              {subsLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : subscriptions.length === 0 ? (
                <div className="text-center py-8">
                  <Server className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No subscriptions for this project</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => navigate('/subscriptions/new', { state: { projectId: id } })}
                  >
                    Add Subscription
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {subscriptions.map((sub) => {
                    const daysUntil = getDaysUntil(sub.expiryDate);
                    const isExpiring = daysUntil <= 30 && daysUntil > 0;
                    
                    return (
                      <div 
                        key={sub.id} 
                        className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => navigate(`/subscriptions/${sub.id}`)}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <Server className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{sub.name}</p>
                            <p className="text-sm text-muted-foreground">{sub.provider}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-medium">{formatCurrency(sub.cost, sub.currency)}</p>
                            <p className="text-xs text-muted-foreground">
                              {sub.billingCycle.toLowerCase()}
                            </p>
                          </div>
                          
                          <div className="text-right min-w-[100px]">
                            <p className={`text-sm ${isExpiring ? 'text-orange-600' : 'text-muted-foreground'}`}>
                              {formatDate(sub.expiryDate, 'MMM d, yyyy')}
                            </p>
                            {isExpiring && (
                              <Badge variant="destructive" className="mt-1">
                                {daysUntil} days left
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle>Project Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              {invoicesLoading ? (
                <Skeleton className="h-32 w-full" />
              ) : invoices.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No invoices for this project</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => navigate('/invoices/new', { state: { projectId: id } })}
                  >
                    Create Invoice
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Issue Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Pending</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow 
                        key={invoice.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => navigate(`/invoices/${invoice.id}`)}
                      >
                        <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                        <TableCell>{formatDate(invoice.issueDate, 'MMM d, yyyy')}</TableCell>
                        <TableCell>
                          <span className={invoice.isOverdue ? 'text-red-600' : ''}>
                            {formatDate(invoice.dueDate, 'MMM d, yyyy')}
                          </span>
                        </TableCell>
                        <TableCell>{formatCurrency(invoice.totalAmount)}</TableCell>
                        <TableCell>
                          {invoice.pendingBalance > 0 ? (
                            <span className="text-orange-600 font-medium">
                              {formatCurrency(invoice.pendingBalance)}
                            </span>
                          ) : '-'}
                        </TableCell>
                        <TableCell>
                          <Badge className={getInvoiceStatusColor(invoice.status)}>
                            {invoice.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="milestones">
          <Card>
            <CardHeader>
              <CardTitle>Project Milestones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">Milestones feature coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};