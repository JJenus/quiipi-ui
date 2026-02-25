// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Layout
import { DashboardLayout } from '@/components/layout/DashboardLayout';

// Pages
import { Landing } from '@/pages/Landing';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { Dashboard } from '@/pages/Dashboard';
import { Clients } from '@/pages/Clients';
import { ClientDetails } from '@/pages/ClientDetails';
import { Projects } from '@/pages/Projects';
import { ProjectDetails } from '@/pages/ProjectDetails';
import { Subscriptions } from '@/pages/Subscriptions';
import { SubscriptionDetails } from '@/pages/SubscriptionDetails';
import { Invoices } from '@/pages/Invoices';
import { InvoiceDetails } from '@/pages/InvoiceDetails';
import { Settings } from '@/pages/Settings';
import { NewClient } from '@/pages/clients/NewClient';
import { NewProject } from '@/pages/projects/NewProject';
import { NewInvoice } from '@/pages/invoices/NewInvoice';
import { NewSubscription } from '@/pages/subscriptions/NewSubscription';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider defaultTheme="light" storageKey="quiipi-theme">
          <AuthProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected routes */}
              <Route
                
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="clients" element={<Clients />} />
                <Route path="clients/:id" element={<ClientDetails />} />
                <Route path="projects" element={<Projects />} />
                <Route path="projects/:id" element={<ProjectDetails />} />
                <Route path="subscriptions" element={<Subscriptions />} />
                <Route path="subscriptions/:id" element={<SubscriptionDetails />} />
                <Route path="invoices" element={<Invoices />} />
                <Route path="invoices/:id" element={<InvoiceDetails />} />
                <Route path="clients/new" element={<NewClient />} />
                <Route path="projects/new" element={<NewProject />} />
                <Route path="invoices/new" element={<NewInvoice />} />
                <Route path="subscriptions/new" element={<NewSubscription />} />
                <Route path="settings" element={<Settings />} />
                <Route path="settings/*" element={<Settings />} />
              </Route>
            </Routes>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;