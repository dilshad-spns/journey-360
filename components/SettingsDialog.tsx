import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Bell, Palette, Shield, Lock, UserCircle, Settings as SettingsIcon } from 'lucide-react';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

type SettingsSection = 'general' | 'notifications' | 'personalization' | 'data' | 'security' | 'account';

export function SettingsDialog({ open, onOpenChange, darkMode, onToggleDarkMode }: SettingsDialogProps) {
  const [activeSection, setActiveSection] = useState<SettingsSection>('general');
  const [appearance, setAppearance] = useState<'system' | 'light' | 'dark'>(darkMode ? 'dark' : 'light');
  const [accentColor, setAccentColor] = useState('#0066FF');
  const [language, setLanguage] = useState('english');
  const [spokenLanguage, setSpokenLanguage] = useState('english-us');
  const [voice, setVoice] = useState('alloy');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    desktop: false,
    sound: true,
  });

  const sections = [
    { id: 'general' as const, label: 'General', icon: SettingsIcon },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'personalization' as const, label: 'Personalization', icon: Palette },
    { id: 'data' as const, label: 'Data controls', icon: Shield },
    { id: 'security' as const, label: 'Security', icon: Lock },
    { id: 'account' as const, label: 'Account', icon: UserCircle },
  ];

  const accentColors = [
    '#0066FF', '#7C3AED', '#DC2626', '#EA580C', 
    '#CA8A04', '#16A34A', '#0891B2', '#DB2777'
  ];

  const handleAppearanceChange = (value: 'system' | 'light' | 'dark') => {
    setAppearance(value);
    if (value !== 'system') {
      const shouldBeDark = value === 'dark';
      if (shouldBeDark !== darkMode) {
        onToggleDarkMode();
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-4xl h-[60vh] p-0 bg-card border-border rounded-[var(--radius-card)] overflow-hidden flex flex-col">
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-40 bg-muted/30 border-r border-border flex flex-col shrink-0">
            <DialogHeader className="px-4 py-4 border-b border-border shrink-0">
              <DialogTitle className="text-foreground">Settings</DialogTitle>
              <DialogDescription className="sr-only">
                Manage your application preferences and settings
              </DialogDescription>
            </DialogHeader>
            
            <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-[var(--radius)] transition-colors ${
                      activeSection === section.id
                        ? 'bg-background text-foreground shadow-[var(--elevation-sm)]'
                        : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
                    <span className="text-left">{section.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="p-6 space-y-6 min-h-full">
              {/* General Section */}
              {activeSection === 'general' && (
                <>
                  <div className="mb-6">
                    <h3 className="text-foreground mb-1">General</h3>
                    <p className="text-muted-foreground">Manage your general application settings</p>
                  </div>

                  {/* Appearance */}
                  <div className="space-y-2">
                    <Label className="text-foreground block">Appearance</Label>
                    <div className="flex gap-3">
                      {(['system', 'light', 'dark'] as const).map((mode) => (
                        <button
                          key={mode}
                          onClick={() => handleAppearanceChange(mode)}
                          className={`flex-1 px-4 py-3 rounded-[var(--radius)] border transition-all capitalize ${
                            appearance === mode
                              ? 'border-primary bg-primary/10 text-foreground'
                              : 'border-border bg-background text-muted-foreground hover:border-border-hover hover:text-foreground'
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Accent Color */}
                  <div className="space-y-2">
                    <Label className="text-foreground block">Accent color</Label>
                    <div className="flex gap-2 flex-wrap">
                      {accentColors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setAccentColor(color)}
                          className={`h-10 w-10 rounded-[var(--radius)] border-2 transition-all ${
                            accentColor === color
                              ? 'border-foreground scale-110'
                              : 'border-transparent hover:scale-105'
                          }`}
                          style={{ backgroundColor: color }}
                          aria-label={`Select ${color} accent color`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Language */}
                  <div className="space-y-2">
                    <Label className="text-foreground block">Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="bg-background border-border rounded-[var(--radius)]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border rounded-[var(--radius)]">
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="spanish">Spanish</SelectItem>
                        <SelectItem value="french">French</SelectItem>
                        <SelectItem value="german">German</SelectItem>
                        <SelectItem value="chinese">Chinese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Spoken Language */}
                  <div className="space-y-2">
                    <Label className="text-foreground block">Spoken language</Label>
                    <Select value={spokenLanguage} onValueChange={setSpokenLanguage}>
                      <SelectTrigger className="bg-background border-border rounded-[var(--radius)]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border rounded-[var(--radius)]">
                        <SelectItem value="english-us">English (US)</SelectItem>
                        <SelectItem value="english-uk">English (UK)</SelectItem>
                        <SelectItem value="spanish-es">Spanish (ES)</SelectItem>
                        <SelectItem value="french-fr">French (FR)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Voice */}
                  <div className="space-y-2">
                    <Label className="text-foreground block">Voice</Label>
                    <Select value={voice} onValueChange={setVoice}>
                      <SelectTrigger className="bg-background border-border rounded-[var(--radius)]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border rounded-[var(--radius)]">
                        <SelectItem value="alloy">Alloy</SelectItem>
                        <SelectItem value="echo">Echo</SelectItem>
                        <SelectItem value="fable">Fable</SelectItem>
                        <SelectItem value="onyx">Onyx</SelectItem>
                        <SelectItem value="nova">Nova</SelectItem>
                        <SelectItem value="shimmer">Shimmer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {/* Notifications Section */}
              {activeSection === 'notifications' && (
                <>
                  <div className="mb-6">
                    <h3 className="text-foreground mb-1">Notifications</h3>
                    <p className="text-muted-foreground">Configure how you receive notifications</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between py-3 border-b border-border">
                      <div>
                        <Label className="text-foreground block mb-1">Email notifications</Label>
                        <p className="text-muted-foreground">Receive notifications via email</p>
                      </div>
                      <Switch
                        checked={notifications.email}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-border">
                      <div>
                        <Label className="text-foreground block mb-1">Push notifications</Label>
                        <p className="text-muted-foreground">Receive push notifications in browser</p>
                      </div>
                      <Switch
                        checked={notifications.push}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-border">
                      <div>
                        <Label className="text-foreground block mb-1">Desktop notifications</Label>
                        <p className="text-muted-foreground">Show system notifications</p>
                      </div>
                      <Switch
                        checked={notifications.desktop}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, desktop: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div>
                        <Label className="text-foreground block mb-1">Notification sounds</Label>
                        <p className="text-muted-foreground">Play sound for notifications</p>
                      </div>
                      <Switch
                        checked={notifications.sound}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, sound: checked })}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Personalization Section */}
              {activeSection === 'personalization' && (
                <>
                  <div className="mb-6">
                    <h3 className="text-foreground mb-1">Personalization</h3>
                    <p className="text-muted-foreground">Customize your experience</p>
                  </div>
                  <p className="text-muted-foreground">Personalization options coming soon...</p>
                </>
              )}

              {/* Data Controls Section */}
              {activeSection === 'data' && (
                <>
                  <div className="mb-6">
                    <h3 className="text-foreground mb-1">Data controls</h3>
                    <p className="text-muted-foreground">Manage your data and privacy</p>
                  </div>
                  <p className="text-muted-foreground">Data control options coming soon...</p>
                </>
              )}

              {/* Security Section */}
              {activeSection === 'security' && (
                <>
                  <div className="mb-6">
                    <h3 className="text-foreground mb-1">Security</h3>
                    <p className="text-muted-foreground">Manage your security settings</p>
                  </div>
                  <p className="text-muted-foreground">Security options coming soon...</p>
                </>
              )}

              {/* Account Section */}
              {activeSection === 'account' && (
                <>
                  <div className="mb-6">
                    <h3 className="text-foreground mb-1">Account</h3>
                    <p className="text-muted-foreground">Manage your account settings</p>
                  </div>
                  <p className="text-muted-foreground">Account settings coming soon...</p>
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}