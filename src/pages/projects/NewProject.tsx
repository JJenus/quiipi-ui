// src/pages/projects/NewProject.tsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useProjects } from '@/hooks/useProjects';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProjectForm } from '@/components/projects/ProjectForm';
import { ArrowLeft } from 'lucide-react';
import { ProjectCreateRequest } from '@/types';

export const NewProject: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { createProject } = useProjects();
  
  // Get clientId from location state if coming from client details
  const clientId = location.state?.clientId;

  const handleSubmit = async (data: ProjectCreateRequest) => {
    await createProject(data);
    navigate('/projects');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/projects')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Create New Project</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Add a new project to your portfolio
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ProjectForm
            onSubmit={handleSubmit}
            onCancel={() => navigate('/projects')}
            initialData={clientId ? { clientId } : undefined}
          />
        </CardContent>
      </Card>
    </div>
  );
};