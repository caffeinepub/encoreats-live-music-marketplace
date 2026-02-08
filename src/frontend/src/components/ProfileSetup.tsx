import { useState, useEffect } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Music, Building2, Users } from 'lucide-react';
import { Role, type UserProfile } from '../backend';
import { toast } from 'sonner';
import { getSelectedRole, clearSelectedRole } from '../utils/urlParams';

export default function ProfileSetup() {
  const { identity } = useInternetIdentity();
  const saveProfile = useSaveCallerUserProfile();
  
  // Get pre-selected role from session storage (set during login)
  const preSelectedRole = getSelectedRole();
  
  // Type guard to check if role is valid
  const isValidRole = (role: string | null): role is 'venue' | 'musician' | 'customer' => {
    return role === 'venue' || role === 'musician' || role === 'customer';
  };
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    bio: '',
    location: '',
    role: (isValidRole(preSelectedRole) ? preSelectedRole : 'musician') as 'venue' | 'musician' | 'customer',
  });

  // Update role if pre-selected role changes
  useEffect(() => {
    if (preSelectedRole && isValidRole(preSelectedRole)) {
      setFormData(prev => ({ ...prev, role: preSelectedRole }));
    }
  }, [preSelectedRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!identity) {
      toast.error('Please log in first');
      return;
    }

    if (!formData.name || !formData.phone || !formData.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    const profile: UserProfile = {
      id: identity.getPrincipal(),
      name: formData.name,
      phone: formData.phone,
      bio: formData.bio,
      location: formData.location,
      role: Role[formData.role],
      rating: 0,
      contractBlob: undefined,
    };

    saveProfile.mutate(profile, {
      onSuccess: () => {
        // Clear the selected role after successful profile creation
        clearSelectedRole();
      }
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-chart-1/20 p-4">
              <Music className="h-12 w-12 text-chart-1" />
            </div>
          </div>
          <CardTitle className="text-3xl">Welcome to Encoreats!</CardTitle>
          <CardDescription className="text-lg">Let's set up your profile to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="role" className="text-base">I am a...</Label>
              <RadioGroup
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value as 'venue' | 'musician' | 'customer' })}
                className="grid grid-cols-3 gap-4"
              >
                <div>
                  <RadioGroupItem value="venue" id="venue" className="peer sr-only" />
                  <Label
                    htmlFor="venue"
                    className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-background/50 p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-chart-1 peer-data-[state=checked]:bg-chart-1/10 cursor-pointer transition-all"
                  >
                    <Building2 className="mb-2 h-8 w-8" />
                    <span className="font-medium">Venue</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="musician" id="musician" className="peer sr-only" />
                  <Label
                    htmlFor="musician"
                    className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-background/50 p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-chart-1 peer-data-[state=checked]:bg-chart-1/10 cursor-pointer transition-all"
                  >
                    <Music className="mb-2 h-8 w-8" />
                    <span className="font-medium">Musician</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="customer" id="customer" className="peer sr-only" />
                  <Label
                    htmlFor="customer"
                    className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-background/50 p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-chart-1 peer-data-[state=checked]:bg-chart-1/10 cursor-pointer transition-all"
                  >
                    <Users className="mb-2 h-8 w-8" />
                    <span className="font-medium">Customer</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+91 1234567890"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                placeholder="City, State"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-chart-1 hover:bg-chart-1/90 h-12 text-lg"
              disabled={saveProfile.isPending}
            >
              {saveProfile.isPending ? 'Creating Profile...' : 'Complete Setup'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
