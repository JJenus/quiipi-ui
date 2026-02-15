// src/components/layout/DashboardLayout.tsx
import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileHeader } from './MobileHeader';
import { useUIStore } from '@/store/uiStore';
import { cn } from '@/lib/utils';

export const DashboardLayout: React.FC = () => {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const { setSidebarOpen } = useUIStore();
  const location = useLocation();

  // Close sidebar on mobile when route changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setSidebarOpen]);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [location, setSidebarOpen]);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      {/* Mobile Header - visible only on mobile */}
      <MobileHeader />
      
      {/* Desktop Header - hidden on mobile */}
      <div className="hidden md:block">
        <Header />
      </div>
      
      <div
        className={cn(
          'transition-all duration-300 ease-in-out',
          sidebarOpen ? 'md:ml-64' : 'md:ml-20',
          'mt-16 md:mt-0' // Add margin-top for mobile to account for mobile header
        )}
      >
        <main className="container mx-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};