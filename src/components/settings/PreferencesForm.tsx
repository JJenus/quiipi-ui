// src/components/settings/PreferencesForm.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RegionalSettings } from '@/types';
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';
import { LANGUAGES } from '@/constants/languages';
import { TIMEZONES } from '@/constants/timezones';
import { CURRENCIES } from '@/constants/currencies';

interface PreferencesFormProps {
  initialData?: Partial<RegionalSettings>;
  onSubmit: (data: RegionalSettings) => Promise<void>;
  isSubmitting?: boolean;
}

export const PreferencesForm: React.FC<PreferencesFormProps> = ({
  initialData = {
    language: 'en',
    timezone: 'Africa/Lagos',
    currency: 'NGN',
  },
  onSubmit,
  isSubmitting = false,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [formData, setFormData] = React.useState<RegionalSettings>(initialData as RegionalSettings);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>
            Customize your application experience.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Appearance Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">APPEARANCE</h3>
            
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label className="text-base">Theme</Label>
                <CardDescription>
                  Switch between light and dark mode
                </CardDescription>
              </div>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={toggleTheme}
                className="gap-2"
              >
                {theme === 'light' ? (
                  <>
                    <Moon className="h-4 w-4" />
                    <span>Dark Mode</span>
                  </>
                ) : (
                  <>
                    <Sun className="h-4 w-4" />
                    <span>Light Mode</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          <Separator />

          {/* Regional Settings Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">REGIONAL SETTINGS</h3>
            
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select
                  value={formData.language}
                  onValueChange={(value) => setFormData({ ...formData, language: value })}
                >
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((language) => (
                      <SelectItem key={language.code} value={language.code}>
                        <div className="flex items-center gap-2">
                          <span>{language.nativeName}</span>
                          <span className="text-xs text-muted-foreground">
                            ({language.name})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={formData.timezone}
                  onValueChange={(value) => setFormData({ ...formData, timezone: value })}
                >
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {TIMEZONES.map((timezone) => (
                      <SelectItem key={timezone.id} value={timezone.id}>
                        <div className="flex items-center gap-2">
                          <span>{timezone.label}</span>
                          <span className="text-xs text-muted-foreground">
                            {timezone.offset}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => setFormData({ ...formData, currency: value })}
                >
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{currency.symbol}</span>
                          <span>{currency.code}</span>
                          <span className="text-xs text-muted-foreground">
                            - {currency.name}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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