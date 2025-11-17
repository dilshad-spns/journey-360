import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { User, Mail, Building, MapPin, Upload } from 'lucide-react';

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileDialog({ open, onOpenChange }: ProfileDialogProps) {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Product Designer',
    company: 'Design Co.',
    location: 'San Francisco, CA',
    bio: 'Passionate about creating intuitive user experiences and building great products.',
  });

  const handleSave = () => {
    // Save profile logic here
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[60vh] bg-card border-border rounded-[var(--radius-card)] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-foreground">Profile</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Manage your personal information and profile details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4 overflow-y-auto flex-1">
          {/* Avatar Section */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="" alt={profile.name} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {profile.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Button
                variant="outline"
                size="sm"
                className="rounded-[var(--radius-button)] border-border"
              >
                <Upload className="h-4 w-4 mr-2" strokeWidth={1.5} />
                Upload Photo
              </Button>
              <p className="text-muted-foreground mt-2">
                Recommended: Square image, at least 400x400px
              </p>
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label className="text-foreground flex items-center gap-2">
              <User className="h-4 w-4" strokeWidth={1.5} />
              Full Name
            </Label>
            <Input
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="bg-background border-border rounded-[var(--radius-input)]"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label className="text-foreground flex items-center gap-2">
              <Mail className="h-4 w-4" strokeWidth={1.5} />
              Email
            </Label>
            <Input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="bg-background border-border rounded-[var(--radius-input)]"
            />
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label className="text-foreground">Role</Label>
            <Input
              value={profile.role}
              onChange={(e) => setProfile({ ...profile, role: e.target.value })}
              placeholder="e.g. Product Designer"
              className="bg-background border-border rounded-[var(--radius-input)]"
            />
          </div>

          {/* Company */}
          <div className="space-y-2">
            <Label className="text-foreground flex items-center gap-2">
              <Building className="h-4 w-4" strokeWidth={1.5} />
              Company
            </Label>
            <Input
              value={profile.company}
              onChange={(e) => setProfile({ ...profile, company: e.target.value })}
              className="bg-background border-border rounded-[var(--radius-input)]"
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label className="text-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4" strokeWidth={1.5} />
              Location
            </Label>
            <Input
              value={profile.location}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              placeholder="City, Country"
              className="bg-background border-border rounded-[var(--radius-input)]"
            />
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label className="text-foreground">Bio</Label>
            <Textarea
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              placeholder="Tell us about yourself..."
              className="bg-background border-border rounded-[var(--radius-input)] min-h-[100px]"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-[var(--radius-button)] border-border"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="rounded-[var(--radius-button)] bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}