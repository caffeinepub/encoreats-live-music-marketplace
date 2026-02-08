import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useIsCallerAdmin } from '../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Music, LogOut, User, Shield } from 'lucide-react';
import { clearSelectedRole } from '../utils/urlParams';

export default function Header() {
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: isAdmin = false } = useIsCallerAdmin();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    clearSelectedRole(); // Clear selected role on logout
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Music className="h-8 w-8 text-chart-1" />
          <span className="text-2xl font-bold bg-gradient-to-r from-chart-1 to-chart-4 bg-clip-text text-transparent">
            Encoreats
          </span>
        </div>

        <div className="flex items-center gap-4">
          {isAdmin && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => (window.location.hash = '/admin')}
              className="gap-2 border-chart-1/50 text-chart-1 hover:bg-chart-1/10"
            >
              <Shield className="h-4 w-4" />
              Admin
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10 border-2 border-chart-1/50">
                  <AvatarFallback className="bg-chart-1/20 text-chart-1 font-semibold">
                    {userProfile ? getInitials(userProfile.name) : <User className="h-5 w-5" />}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{userProfile?.name || 'User'}</p>
                  <p className="text-xs leading-none text-muted-foreground capitalize">{userProfile?.role || 'Role'}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
