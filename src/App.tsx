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
      <BrowserRouter> {/* Moved BrowserRouter to the top */}
        <ThemeProvider defaultTheme="light" storageKey="quiipi-theme">
          <AuthProvider> {/* AuthProvider now inside BrowserRouter */}
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/"
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