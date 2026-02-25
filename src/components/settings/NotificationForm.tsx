// src/components/settings/NotificationForm.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { NotificationSettings } from '@/types';

interface NotificationFormProps {
  initialData?: Partial<NotificationSettings>;
  onSubmit: (data: NotificationSettings) => Promise<void>;
  isSubmitting?: boolean;
}

export const NotificationForm: React.FC<NotificationFormProps> = ({
  initialData = {
    emailNotifications: true,
    subscriptionExpiryAlerts: true,
    projectDeadlineReminders: true,
    invoiceOverdueAlerts: true,
    paymentReceived: true,
    invoiceCreated: false,
    projectUpdates: false,
    marketingEmails: false,
  },
  onSubmit,
  isSubmitting = false,
}) => {
  const [settings, setSettings] = React.useState<NotificationSettings>(initialData as NotificationSettings);

  const handleToggle = (key: keyof NotificationSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(settings);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>
            Choose what notifications you want to receive.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email Notifications - Master Checkbox */}
          <div className="rounded-lg border p-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="emailNotifications"
                checked={settings.emailNotifications}
                onCheckedChange={() => handleToggle('emailNotifications')}
                className="mt-0.5"
              />
              <div className="space-y-0.5">
                <Label 
                  htmlFor="emailNotifications" 
                  className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Email Notifications
                </Label>
                <CardDescription>
                  Receive notifications via email
                </CardDescription>
              </div>
            </div>
          </div>

          <Separator />

          {/* Notification Types */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">NOTIFICATION TYPES</h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="subscriptionExpiryAlerts"
                  checked={settings.subscriptionExpiryAlerts}
                  onCheckedChange={() => handleToggle('subscriptionExpiryAlerts')}
                  disabled={!settings.emailNotifications}
                  className="mt-0.5"
                />
                <div className="space-y-0.5">
                  <Label 
                    htmlFor="subscriptionExpiryAlerts" 
                    className={`text-sm font-medium leading-none ${
                      !settings.emailNotifications ? 'text-muted-foreground' : ''
                    }`}
                  >
                    Subscription Expiry Alerts
                  </Label>
                  <CardDescription className="text-xs">
                    Get notified when subscriptions are about to expire
                  </CardDescription>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="projectDeadlineReminders"
                  checked={settings.projectDeadlineReminders}
                  onCheckedChange={() => handleToggle('projectDeadlineReminders')}
                  disabled={!settings.emailNotifications}
                  className="mt-0.5"
                />
                <div className="space-y-0.5">
                  <Label 
                    htmlFor="projectDeadlineReminders" 
                    className={`text-sm font-medium leading-none ${
                      !settings.emailNotifications ? 'text-muted-foreground' : ''
                    }`}
                  >
                    Project Deadline Reminders
                  </Label>
                  <CardDescription className="text-xs">
                    Receive reminders for upcoming project deadlines
                  </CardDescription>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="invoiceOverdueAlerts"
                  checked={settings.invoiceOverdueAlerts}
                  onCheckedChange={() => handleToggle('invoiceOverdueAlerts')}
                  disabled={!settings.emailNotifications}
                  className="mt-0.5"
                />
                <div className="space-y-0.5">
                  <Label 
                    htmlFor="invoiceOverdueAlerts" 
                    className={`text-sm font-medium leading-none ${
                      !settings.emailNotifications ? 'text-muted-foreground' : ''
                    }`}
                  >
                    Invoice Overdue Alerts
                  </Label>
                  <CardDescription className="text-xs">
                    Get notified when invoices become overdue
                  </CardDescription>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="paymentReceived"
                  checked={settings.paymentReceived}
                  onCheckedChange={() => handleToggle('paymentReceived')}
                  disabled={!settings.emailNotifications}
                  className="mt-0.5"
                />
                <div className="space-y-0.5">
                  <Label 
                    htmlFor="paymentReceived" 
                    className={`text-sm font-medium leading-none ${
                      !settings.emailNotifications ? 'text-muted-foreground' : ''
                    }`}
                  >
                    Payment Received
                  </Label>
                  <CardDescription className="text-xs">
                    Get notified when a payment is received
                  </CardDescription>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="invoiceCreated"
                  checked={settings.invoiceCreated}
                  onCheckedChange={() => handleToggle('invoiceCreated')}
                  disabled={!settings.emailNotifications}
                  className="mt-0.5"
                />
                <div className="space-y-0.5">
                  <Label 
                    htmlFor="invoiceCreated" 
                    className={`text-sm font-medium leading-none ${
                      !settings.emailNotifications ? 'text-muted-foreground' : ''
                    }`}
                  >
                    Invoice Created
                  </Label>
                  <CardDescription className="text-xs">
                    Get notified when a new invoice is created
                  </CardDescription>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="projectUpdates"
                  checked={settings.projectUpdates}
                  onCheckedChange={() => handleToggle('projectUpdates')}
                  disabled={!settings.emailNotifications}
                  className="mt-0.5"
                />
                <div className="space-y-0.5">
                  <Label 
                    htmlFor="projectUpdates" 
                    className={`text-sm font-medium leading-none ${
                      !settings.emailNotifications ? 'text-muted-foreground' : ''
                    }`}
                  >
                    Project Updates
                  </Label>
                  <CardDescription className="text-xs">
                    Get notified about project status changes
                  </CardDescription>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Marketing Preferences */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">MARKETING</h3>
            
            <div className="flex items-start space-x-3">
              <Checkbox
                id="marketingEmails"
                checked={settings.marketingEmails}
                onCheckedChange={() => handleToggle('marketingEmails')}
                className="mt-0.5"
              />
              <div className="space-y-0.5">
                <Label 
                  htmlFor="marketingEmails" 
                  className="text-sm font-medium leading-none"
                >
                  Marketing Emails
                </Label>
                <CardDescription className="text-xs">
                  Receive updates about new features and offers
                </CardDescription>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Preferences'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};