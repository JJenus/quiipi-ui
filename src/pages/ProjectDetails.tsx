// src/pages/ProjectDetails.tsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProject, useProjects } from '@/hooks/useProjects';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { ProjectForm } from '@/components/projects/ProjectForm';
import { ArrowLeft, Edit, Trash2, Calendar, DollarSign, Github, Globe, FolderKanban } from 'lucide-react';
import { formatDate, formatCurrency, getDaysUntil } from '@/utils/dateUtils';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProjectStatus, ProjectPriority } from '@/types';

export const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const { project, isLoading } = useProject(id!);
  const { updateProject, deleteProject } = useProjects();

  const handleUpdate = async (data: any) => {
    await updateProject({ id: id!, data });
    setShowEditDialog(false);
  };

  const handleDelete = async () => {
    await deleteProject(id!);
    setShowDeleteDialog(false);
    navigate('/projects');
  };

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

  const getPriorityColor = (priority: ProjectPriority) => {
    const colors = {
      [ProjectPriority.LOW]: 'bg-gray-100 text-gray-800',
      [ProjectPriority.MEDIUM]: 'bg-blue-100 text-blue-800',
      [ProjectPriority.HIGH]: 'bg-orange-100 text-orange-800',
      [ProjectPriority.CRITICAL]: 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/projects')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">{project.name}</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Client: {project.client?.companyName || 'No client assigned'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
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

      {/* Status Badges */}
      <div className="flex flex-wrap gap-2">
        <Badge className={getStatusColor(project.status)}>
          {project.status}
        </Badge>
        <Badge className={getPriorityColor(project.priority)}>
          {project.priority} Priority
        </Badge>
        {isOverdue && (
          <Badge variant="destructive">
            Overdue by {Math.abs(daysUntil)} days
          </Badge>
        )}
        {isNearDeadline && !isOverdue && (
          <Badge variant="destructive" className="animate-pulse">
            {daysUntil} days left
          </Badge>
        )}
      </div>

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
            <p className="text-sm">
              {formatDate(project.startDate, 'MMM d')} - {formatDate(project.deadline, 'MMM d, yyyy')}
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
              {formatCurrency(project.estimatedBudget || 0)}
            </p>
            <p className="text-xs text-muted-foreground">
              Spent: {formatCurrency(project.actualCost || 0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Hourly Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold">
              {formatCurrency(project.hourlyRate || 0)}/hr
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold text-orange-600">
              {formatCurrency(project.pendingBalance || 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      {!isMobile ? (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Description Card */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">
                  {project.description || 'No description provided.'}
                </p>
              </CardContent>
            </Card>

            {/* Links Card */}
            {(project.repositoryUrl || project.stagingUrl || project.productionUrl) && (
              <Card>
                <CardHeader>
                  <CardTitle>Project Links</CardTitle>
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
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Client Info Card */}
            {project.client && (
              <Card>
                <CardHeader>
                  <CardTitle>Client Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="font-medium">{project.client.companyName}</p>
                  <p className="text-sm text-muted-foreground">{project.client.email}</p>
                  <p className="text-sm text-muted-foreground">{project.client.phone}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => navigate(`/clients/${project.client!.id}`)}
                  >
                    View Client
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Metadata Card */}
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Created:</span>
                  <span className="text-sm">{formatDate(project.createdAt, 'MMM d, yyyy')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Last Updated:</span>
                  <span className="text-sm">{formatDate(project.updatedAt, 'MMM d, yyyy')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Project ID:</span>
                  <span className="text-sm font-mono">{project.id}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        /* Mobile Tabs */
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="links">Links</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
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

            {project.client && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Client</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">{project.client.companyName}</p>
                  <Button 
                    variant="link" 
                    className="px-0 h-auto text-sm"
                    onClick={() => navigate(`/clients/${project.client!.id}`)}
                  >
                    View Client Details
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="links" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Project Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
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
                {!project.repositoryUrl && !project.stagingUrl && !project.productionUrl && (
                  <p className="text-sm text-muted-foreground">No links provided.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Additional Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Created:</span>
                  <span className="text-sm">{formatDate(project.createdAt, 'MMM d, yyyy')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Last Updated:</span>
                  <span className="text-sm">{formatDate(project.updatedAt, 'MMM d, yyyy')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Project ID:</span>
                  <span className="text-sm font-mono">{project.id}</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
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