// src/pages/ProjectDetails.tsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProject, useProjects, useProjectInvoices, useProjectSubscriptions, useProjectMilestones } from '@/hooks/useProjects';
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
  DialogDescription,
  DialogFooter,
} from '@/components/ui/responsive-dialog';
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

import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ProjectForm } from '@/components/projects/ProjectForm';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  Github,
  Globe,
  Server,
  FileText,
  Clock,
  AlertCircle,
  FolderKanban,
  Building2,
  Users,
  CheckCircle,
  Plus,
  ExternalLink,
  Flag,
  Link,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Activity,
  Play,
  Pause,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { formatDate, formatCurrency, getDaysUntil, formatDateForAPI } from '@/utils/dateUtils';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ProjectStatus, ProjectPriority, InvoiceStatus, MilestoneStatus, SubscriptionType } from '@/types';

export const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showMilestoneDialog, setShowMilestoneDialog] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [milestoneForm, setMilestoneForm] = useState({
    name: '',
    description: '',
    dueDate: '',
    paymentAmount: 0,
  });

  const { project, isLoading: projectLoading } = useProject(id!);
  const { updateProject, deleteProject, updateProjectStatus } = useProjects();
  const { invoices, isLoading: invoicesLoading } = useProjectInvoices(id!);
  const { subscriptions, isLoading: subsLoading } = useProjectSubscriptions(id!);
  const { milestones, isLoading: milestonesLoading, addMilestone, updateMilestone } = useProjectMilestones(id!);

  const handleUpdate = async (data: any) => {
    await updateProject({ id: id!, data });
    setShowEditDialog(false);
  };

  const handleDelete = async () => {
    await deleteProject(id!);
    setShowDeleteDialog(false);
    navigate('/projects');
  };

  const handleStatusChange = async (status: ProjectStatus) => {
    await updateProjectStatus({ id: id!, status });
  };

  const handleAddMilestone = async () => {
    await addMilestone({
      name: milestoneForm.name,
      description: milestoneForm.description,
      dueDate: formatDateForAPI(milestoneForm.dueDate),
      paymentAmount: milestoneForm.paymentAmount,
    });
    setShowMilestoneDialog(false);
    setMilestoneForm({ name: '', description: '', dueDate: '', paymentAmount: 0 });
  };

  const handleUpdateMilestoneStatus = async (milestoneId: string, status: MilestoneStatus) => {
    await updateMilestone({ id: milestoneId, data: { status } });
  };

  const getStatusColor = (status: ProjectStatus) => {
    const colors = {
      [ProjectStatus.PLANNING]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      [ProjectStatus.IN_PROGRESS]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      [ProjectStatus.ON_HOLD]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      [ProjectStatus.COMPLETED]: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
      [ProjectStatus.CANCELLED]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: ProjectPriority) => {
    const colors = {
      [ProjectPriority.LOW]: 'bg-gray-100 text-gray-800',
      [ProjectPriority.MEDIUM]: 'bg-blue-100 text-blue-800',
      [ProjectPriority.HIGH]: 'bg-orange-100 text-orange-800',
      [ProjectPriority.CRITICAL]: 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const getInvoiceStatusColor = (status: InvoiceStatus) => {
    const colors = {
      [InvoiceStatus.DRAFT]: 'bg-gray-100 text-gray-800',
      [InvoiceStatus.SENT]: 'bg-blue-100 text-blue-800',
      [InvoiceStatus.PAID]: 'bg-green-100 text-green-800',
      [InvoiceStatus.PARTIALLY_PAID]: 'bg-yellow-100 text-yellow-800',
      [InvoiceStatus.OVERDUE]: 'bg-red-100 text-red-800',
      [InvoiceStatus.CANCELLED]: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getMilestoneStatusIcon = (status: MilestoneStatus) => {
    switch (status) {
      case MilestoneStatus.COMPLETED:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case MilestoneStatus.IN_PROGRESS:
        return <Play className="h-4 w-4 text-blue-500" />;
      case MilestoneStatus.DELAYED:
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case MilestoneStatus.PENDING:
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  if (projectLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-48" />
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
        <FolderKanban className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold">Project not found</h2>
        <p className="text-muted-foreground mt-2 mb-4">
          The project you're looking for doesn't exist or has been deleted.
        </p>
        <Button onClick={() => navigate('/projects')}>
          Back to Projects
        </Button>
      </div>
    );
  }

  const daysUntil = getDaysUntil(project.deadline);
  const isOverdue = daysUntil < 0;
  const isNearDeadline = daysUntil <= 7 && daysUntil > 0;

  const totalInvoiced = invoices?.reduce((sum, inv) => sum + inv.totalAmount, 0) || 0;
  const totalPaid = invoices?.reduce((sum, inv) => sum + inv.amountPaid, 0) || 0;
  const pendingInvoices = invoices?.filter(inv => 
    inv.status !== InvoiceStatus.PAID && inv.status !== InvoiceStatus.CANCELLED
  ) || [];
  const overdueInvoices = invoices?.filter(inv => inv.status === InvoiceStatus.OVERDUE) || [];

  const completedMilestones = milestones?.filter(m => m.status === MilestoneStatus.COMPLETED) || [];
  const milestoneProgress = milestones?.length 
    ? Math.round((completedMilestones.length / milestones.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/projects')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold">{project.name}</h1>
              <Badge className={getStatusColor(project.status)}>
                {project.status}
              </Badge>
              <Badge className={getPriorityColor(project.priority)}>
                {project.priority} Priority
              </Badge>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Client: {project.client?.companyName || 'No client assigned'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Select value={project.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ProjectStatus.PLANNING}>Planning</SelectItem>
              <SelectItem value={ProjectStatus.IN_PROGRESS}>In Progress</SelectItem>
              <SelectItem value={ProjectStatus.ON_HOLD}>On Hold</SelectItem>
              <SelectItem value={ProjectStatus.COMPLETED}>Completed</SelectItem>
              <SelectItem value={ProjectStatus.CANCELLED}>Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => setShowEditDialog(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
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
      </div>

      {/* Deadline Alert */}
      {(isOverdue || isNearDeadline) && (
        <Alert variant={isOverdue ? "destructive" : "default"} className={isNearDeadline ? "border-yellow-200 dark:border-yellow-900" : ""}>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>
            {isOverdue ? 'Project Overdue' : 'Deadline Approaching'}
          </AlertTitle>
          <AlertDescription>
            {isOverdue 
              ? `This project is ${Math.abs(daysUntil)} days overdue.`
              : `This project deadline is in ${daysUntil} days.`}
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">
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
              Financial
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold">{formatCurrency(totalInvoiced)}</p>
            <p className="text-xs text-muted-foreground">
              Budget: {formatCurrency(project.estimatedBudget || 0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold">{milestoneProgress}%</p>
            <p className="text-xs text-muted-foreground">
              {completedMilestones.length}/{milestones?.length || 0} milestones
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold text-orange-600">
              {formatCurrency(project.pendingBalance || 0)}
            </p>
            <p className="text-xs text-muted-foreground">
              {pendingInvoices.length} pending invoices
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Tabs */}
      {isMobile ? (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="invoices">
              Invoices
              {invoices && invoices.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {invoices.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="subscriptions">
              Subs
              {subscriptions && subscriptions.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {subscriptions.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="milestones">
              Tasks
              {milestones && milestones.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {milestones.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            {/* Description Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">
                  {project.description || 'No description provided.'}
                </p>
              </CardContent>
            </Card>

            {/* Client Info Card */}
            {project.client && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Client Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-medium">{project.client.companyName}</p>
                    <p className="text-sm text-muted-foreground">{project.client.email}</p>
                    <p className="text-sm text-muted-foreground">{project.client.phone}</p>
                  </div>
                  <Button 
                    variant="link" 
                    className="px-0 h-auto text-sm"
                    onClick={() => navigate(`/clients/${project.client!.id}`)}
                  >
                    View Client Profile
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Links Card */}
            {(project.repositoryUrl || project.stagingUrl || project.productionUrl) && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Link className="h-4 w-4" />
                    Project Links
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {project.repositoryUrl && (
                    <a 
                      href={project.repositoryUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                    >
                      <Github className="h-4 w-4" />
                      Repository
                    </a>
                  )}
                  {project.stagingUrl && (
                    <a 
                      href={project.stagingUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                    >
                      <Globe className="h-4 w-4" />
                      Staging Site
                    </a>
                  )}
                  {project.productionUrl && (
                    <a 
                      href={project.productionUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                    >
                      <Globe className="h-4 w-4" />
                      Production Site
                    </a>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/invoices/new', { state: { projectId: id } })}
              >
                <Plus className="mr-2 h-4 w-4" />
                New Invoice
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowMilestoneDialog(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="invoices" className="mt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Invoices</CardTitle>
                <Button 
                  size="sm" 
                  onClick={() => navigate('/invoices/new', { state: { projectId: id } })}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New
                </Button>
              </CardHeader>
              <CardContent>
                {invoicesLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ) : invoices?.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No invoices yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {invoices?.map((invoice) => (
                      <div
                        key={invoice.id}
                        className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => navigate(`/invoices/${invoice.id}`)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium">{invoice.invoiceNumber}</p>
                            <Badge className={getInvoiceStatusColor(invoice.status)}>
                              {invoice.status}
                            </Badge>
                          </div>
                          <p className="font-bold">{formatCurrency(invoice.totalAmount)}</p>
                        </div>
                        <div className="flex justify-between text-sm mt-2">
                          <span className="text-muted-foreground">
                            Due: {formatDate(invoice.dueDate, 'MMM d, yyyy')}
                          </span>
                          {invoice.pendingBalance > 0 && (
                            <span className="text-orange-600">
                              Pending: {formatCurrency(invoice.pendingBalance)}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscriptions" className="mt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Subscriptions</CardTitle>
                <Button 
                  size="sm" 
                  onClick={() => navigate('/subscriptions/new', { state: { projectId: id } })}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add
                </Button>
              </CardHeader>
              <CardContent>
                {subsLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ) : subscriptions?.length === 0 ? (
                  <div className="text-center py-8">
                    <Server className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No subscriptions yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {subscriptions?.map((sub) => {
                      const daysUntil = getDaysUntil(sub.expiryDate);
                      const isExpiring = daysUntil <= 30 && daysUntil > 0;
                      
                      return (
                        <div
                          key={sub.id}
                          className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => navigate(`/subscriptions/${sub.id}`)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-medium">{sub.name}</p>
                              <p className="text-sm text-muted-foreground">{sub.provider}</p>
                            </div>
                            <p className="font-bold">{formatCurrency(sub.cost, sub.currency)}</p>
                          </div>
                          <div className="flex justify-between text-sm mt-2">
                            <Badge variant="outline">{sub.type}</Badge>
                            <span className={isExpiring ? 'text-orange-600' : 'text-muted-foreground'}>
                              Expires: {formatDate(sub.expiryDate, 'MMM d')}
                              {isExpiring && ` (${daysUntil}d)`}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="milestones" className="mt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Tasks & Milestones</CardTitle>
                <Button size="sm" onClick={() => setShowMilestoneDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add
                </Button>
              </CardHeader>
              <CardContent>
                {milestonesLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ) : milestones?.length === 0 ? (
                  <div className="text-center py-8">
                    <Flag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No tasks added yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {milestones?.map((milestone) => {
                      const milestoneDaysUntil = getDaysUntil(milestone.dueDate);
                      const isMilestoneOverdue = milestoneDaysUntil < 0 && milestone.status !== MilestoneStatus.COMPLETED;
                      
                      return (
                        <div key={milestone.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                {getMilestoneStatusIcon(milestone.status)}
                                <p className="font-medium">{milestone.name}</p>
                              </div>
                              {milestone.description && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  {milestone.description}
                                </p>
                              )}
                              <div className="flex items-center gap-4 mt-2 text-sm">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span className={isMilestoneOverdue ? 'text-red-600' : ''}>
                                    {formatDate(milestone.dueDate, 'MMM d, yyyy')}
                                    {isMilestoneOverdue && ' (Overdue)'}
                                  </span>
                                </div>
                                {milestone.paymentAmount > 0 && (
                                  <div className="flex items-center gap-1">
                                    <DollarSign className="h-3 w-3" />
                                    <span>{formatCurrency(milestone.paymentAmount)}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <Select
                              value={milestone.status}
                              onValueChange={(value: MilestoneStatus) => 
                                handleUpdateMilestoneStatus(milestone.id, value)
                              }
                            >
                              <SelectTrigger className="w-[110px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value={MilestoneStatus.PENDING}>Pending</SelectItem>
                                <SelectItem value={MilestoneStatus.IN_PROGRESS}>In Progress</SelectItem>
                                <SelectItem value={MilestoneStatus.COMPLETED}>Completed</SelectItem>
                                <SelectItem value={MilestoneStatus.DELAYED}>Delayed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        /* Desktop Layout */
        <>
          {/* Desktop Info Cards */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* Description Card */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">
                  {project.description || 'No description provided.'}
                </p>
              </CardContent>
            </Card>

            {/* Client Info Card */}
            {project.client && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Client
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div 
                    className="cursor-pointer hover:bg-muted/50 p-3 -m-3 rounded-lg transition-colors"
                    onClick={() => navigate(`/clients/${project.client!.id}`)}
                  >
                    <p className="font-medium text-lg">{project.client.companyName}</p>
                    <div className="space-y-1 mt-2">
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        {project.client.email}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Phone className="h-3 w-3" />
                        {project.client.phone}
                      </p>
                    </div>
                    <Button variant="link" className="px-0 h-auto mt-2 text-sm">
                      View Full Profile
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Links Card */}
          {(project.repositoryUrl || project.stagingUrl || project.productionUrl) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link className="h-5 w-5" />
                  Project Links
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {project.repositoryUrl && (
                    <a 
                      href={project.repositoryUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-blue-600 hover:underline p-3 border rounded-lg"
                    >
                      <Github className="h-4 w-4" />
                      Repository
                    </a>
                  )}
                  {project.stagingUrl && (
                    <a 
                      href={project.stagingUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-blue-600 hover:underline p-3 border rounded-lg"
                    >
                      <Globe className="h-4 w-4" />
                      Staging Site
                    </a>
                  )}
                  {project.productionUrl && (
                    <a 
                      href={project.productionUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-blue-600 hover:underline p-3 border rounded-lg"
                    >
                      <Globe className="h-4 w-4" />
                      Production Site
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Desktop Tabs */}
          <Tabs defaultValue="invoices" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="invoices">
                Invoices
                {invoices && invoices.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {invoices.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="subscriptions">
                Subscriptions
                {subscriptions && subscriptions.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {subscriptions.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="milestones">
                Milestones
                {milestones && milestones.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {milestones.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="invoices">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Project Invoices</CardTitle>
                  <Button 
                    size="sm" 
                    onClick={() => navigate('/invoices/new', { state: { projectId: id } })}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Invoice
                  </Button>
                </CardHeader>
                <CardContent>
                  {invoicesLoading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  ) : invoices?.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No invoices for this project</p>
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
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {invoices?.map((invoice) => (
                          <TableRow 
                            key={invoice.id}
                            className="cursor-pointer"
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
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="subscriptions">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Project Subscriptions</CardTitle>
                  <Button 
                    size="sm" 
                    onClick={() => navigate('/subscriptions/new', { state: { projectId: id } })}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Subscription
                  </Button>
                </CardHeader>
                <CardContent>
                  {subsLoading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  ) : subscriptions?.length === 0 ? (
                    <div className="text-center py-8">
                      <Server className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No subscriptions for this project</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Provider</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Cost</TableHead>
                          <TableHead>Expiry Date</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {subscriptions?.map((sub) => {
                          const daysUntil = getDaysUntil(sub.expiryDate);
                          const isExpiring = daysUntil <= 30 && daysUntil > 0;
                          
                          return (
                            <TableRow 
                              key={sub.id}
                              className="cursor-pointer"
                              onClick={() => navigate(`/subscriptions/${sub.id}`)}
                            >
                              <TableCell className="font-medium">{sub.name}</TableCell>
                              <TableCell>{sub.provider}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{sub.type}</Badge>
                              </TableCell>
                              <TableCell>{formatCurrency(sub.cost, sub.currency)}</TableCell>
                              <TableCell>
                                <span className={isExpiring ? 'text-orange-600 font-medium' : ''}>
                                  {formatDate(sub.expiryDate, 'MMM d, yyyy')}
                                  {isExpiring && ` (${daysUntil}d)`}
                                </span>
                              </TableCell>
                              <TableCell>
                                {isExpiring ? (
                                  <Badge variant="destructive">Expiring Soon</Badge>
                                ) : (
                                  <Badge variant="outline">Active</Badge>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="milestones">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Project Milestones</CardTitle>
                  <Button size="sm" onClick={() => setShowMilestoneDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Milestone
                  </Button>
                </CardHeader>
                <CardContent>
                  {milestonesLoading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  ) : milestones?.length === 0 ? (
                    <div className="text-center py-8">
                      <Flag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No milestones added yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {milestones?.map((milestone) => {
                        const milestoneDaysUntil = getDaysUntil(milestone.dueDate);
                        const isMilestoneOverdue = milestoneDaysUntil < 0 && milestone.status !== MilestoneStatus.COMPLETED;
                        
                        return (
                          <div key={milestone.id} className="border rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  {getMilestoneStatusIcon(milestone.status)}
                                  <h4 className="font-medium">{milestone.name}</h4>
                                </div>
                                {milestone.description && (
                                  <p className="text-sm text-muted-foreground mt-2">
                                    {milestone.description}
                                  </p>
                                )}
                                <div className="flex items-center gap-6 mt-3 text-sm">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className={isMilestoneOverdue ? 'text-red-600 font-medium' : ''}>
                                      Due: {formatDate(milestone.dueDate, 'MMMM d, yyyy')}
                                      {isMilestoneOverdue && ' (Overdue)'}
                                    </span>
                                  </div>
                                  {milestone.paymentAmount > 0 && (
                                    <div className="flex items-center gap-2">
                                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                                      <span>Payment: {formatCurrency(milestone.paymentAmount)}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <Select
                                value={milestone.status}
                                onValueChange={(value: MilestoneStatus) => 
                                  handleUpdateMilestoneStatus(milestone.id, value)
                                }
                              >
                                <SelectTrigger className="w-[140px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value={MilestoneStatus.PENDING}>Pending</SelectItem>
                                  <SelectItem value={MilestoneStatus.IN_PROGRESS}>In Progress</SelectItem>
                                  <SelectItem value={MilestoneStatus.COMPLETED}>Completed</SelectItem>
                                  <SelectItem value={MilestoneStatus.DELAYED}>Delayed</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[600px] p-0 sm:p-6">
          <DialogHeader className="p-4 sm:p-0 border-b sm:border-0">
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          <div className="max-h-[calc(90vh-8rem)] overflow-y-auto px-4 pb-4 sm:px-0 sm:pb-0">
            <ProjectForm
              initialData={{
                ...project,
                startDate: project.startDate,
                deadline: project.deadline,
              }}
              onSubmit={handleUpdate}
              onCancel={() => setShowEditDialog(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Milestone Dialog */}
      <Dialog open={showMilestoneDialog} onOpenChange={setShowMilestoneDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Milestone</DialogTitle>
            <DialogDescription>
              Create a new milestone for this project
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Milestone Name *</Label>
              <Input
                id="name"
                value={milestoneForm.name}
                onChange={(e) => setMilestoneForm({ ...milestoneForm, name: e.target.value })}
                placeholder="e.g., Design Approval, Beta Launch"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={milestoneForm.description}
                onChange={(e) => setMilestoneForm({ ...milestoneForm, description: e.target.value })}
                placeholder="Describe this milestone..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date *</Label>
              <Input
                id="dueDate"
                type="date"
                value={milestoneForm.dueDate}
                onChange={(e) => setMilestoneForm({ ...milestoneForm, dueDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentAmount">Payment Amount (Optional)</Label>
              <Input
                id="paymentAmount"
                type="number"
                step="0.01"
                value={milestoneForm.paymentAmount}
                onChange={(e) => setMilestoneForm({ 
                  ...milestoneForm, 
                  paymentAmount: parseFloat(e.target.value) || 0 
                })}
                placeholder="0.00"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMilestoneDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddMilestone}
              disabled={!milestoneForm.name || !milestoneForm.dueDate}
            >
              Add Milestone
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{project.name}"? This action cannot be undone.
              This will also delete all associated invoices and subscriptions.
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