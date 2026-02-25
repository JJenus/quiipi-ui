// src/pages/Settings.tsx
import React, { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSettings } from '@/hooks/useSettings';
import { ProfileForm } from '@/components/settings/ProfileForm';
import { PasswordForm } from '@/components/settings/PasswordForm';
import { PreferencesForm } from '@/components/settings/PreferencesForm';
import { NotificationForm } from '@/components/settings/NotificationForm';
import { BillingTab } from '@/components/settings/BillingTab';
import { Skeleton } from '@/components/ui/skeleton';

export const Settings: React.FC = () => {
  const {
    isLoading,
    user,
    notificationSettings,
    regionalSettings,
    updateProfile,
    changePassword,
    loadNotificationSettings,
    updateNotificationSettings,
    loadRegionalSettings,
    updateRegionalSettings,
  } = useSettings();

  useEffect(() => {
    loadNotificationSettings();
    loadRegionalSettings();
  }, [loadNotificationSettings, loadRegionalSettings]);

  if (!user) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and application settings.</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <ProfileForm 
            user={user}
            onSubmit={updateProfile}
            isSubmitting={isLoading}
          />

          <PasswordForm 
            onSubmit={changePassword}
            isSubmitting={isLoading}
          />
        </TabsContent>

        <TabsContent value="preferences">
          <PreferencesForm 
            initialData={regionalSettings || undefined}
            onSubmit={updateRegionalSettings}
            isSubmitting={isLoading}
          />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationForm 
            initialData={notificationSettings || undefined}
            onSubmit={updateNotificationSettings}
            isSubmitting={isLoading}
          />
        </TabsContent>

        <TabsContent value="billing">
          <BillingTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};