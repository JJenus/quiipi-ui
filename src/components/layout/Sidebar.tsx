// src/components/layout/Sidebar.tsx
import React, { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useUIStore } from '@/store/uiStore';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  CreditCard,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Clients',
    href: '/clients',
    icon: Users,
  },
  {
    title: 'Projects',
    href: '/projects',
    icon: FolderKanban,
  },
  {
    title: 'Subscriptions',
    href: '/subscriptions',
    icon: CreditCard,
  },
  {
    title: 'Invoices',
    href: '/invoices',
    icon: FileText,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

export const Sidebar: React.FC = () => {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const location = useLocation();

  // Close sidebar on mobile when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (window.innerWidth < 768 && sidebarOpen) {
        const sidebar = document.getElementById('sidebar');
        if (sidebar && !sidebar.contains(event.target as Node)) {
          toggleSidebar();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen, toggleSidebar]);

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && window.innerWidth < 768 && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        id="sidebar"
        className={cn(
          'fixed left-0 top-0 z-50 h-screen bg-card border-r transition-all duration-300 ease-in-out',
          sidebarOpen ? 'w-64' : 'w-0 md:w-20',
          // Mobile styles
          'md:left-0',
          sidebarOpen ? 'left-0' : '-left-64 md:left-0'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-4">
            {sidebarOpen ? (
              <span className="text-xl font-bold">Quiipi</span>
            ) : (
              <span className="text-xl font-bold hidden md:block">Q</span>
            )}
            
            {/* Close button for mobile */}
            {window.innerWidth < 768 && sidebarOpen && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="h-8 w-8 md:hidden"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            
            {/* Toggle button for desktop */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="h-8 w-8 hidden md:flex"
            >
              {sidebarOpen ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </div>

          <Separator />

          {/* Navigation */}
          <ScrollArea className="flex-1 py-4">
            <nav className="space-y-1 px-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  onClick={() => {
                    if (window.innerWidth < 768) {
                      toggleSidebar();
                    }
                  }}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                      !sidebarOpen && 'md:justify-center'
                    )
                  }
                >
                  <item.icon className={cn('h-5 w-5 shrink-0', sidebarOpen && 'mr-3')} />
                  {sidebarOpen && <span>{item.title}</span>}
                  {!sidebarOpen && (
                    <span className="sr-only md:not-sr-only">{item.title}</span>
                  )}
                </NavLink>
              ))}
            </nav>
          </ScrollArea>
        </div>
      </aside>
    </>
  );
};