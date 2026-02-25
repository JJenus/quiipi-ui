interface NotificationSettings {
  emailNotifications: boolean;
  subscriptionExpiryAlerts: boolean;
  projectDeadlineReminders: boolean;
  invoiceOverdueAlerts: boolean;
  paymentReceived: boolean;
  invoiceCreated: boolean;
  projectUpdates: boolean;
  marketingEmails: boolean;
}

interface RegionalSettings {
  language: string;
  timezone: string;
  currency: string;
}