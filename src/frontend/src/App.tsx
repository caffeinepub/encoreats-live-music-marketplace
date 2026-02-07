import { useEffect } from 'react';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile, useIsCallerAdmin } from './hooks/useQueries';
import { useUsageTracking } from './hooks/useUsageTracking';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import LandingPage from './pages/LandingPage';
import ProfileSetup from './components/ProfileSetup';
import VenueDashboard from './pages/VenueDashboard';
import MusicianDashboard from './pages/MusicianDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AccessDeniedScreen from './components/AccessDeniedScreen';
import { Role } from './backend';

export default function App() {
  const { identity, loginStatus } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { trackPageView } = useUsageTracking();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  // Track page views when path changes
  useEffect(() => {
    if (isAuthenticated) {
      trackPageView(window.location.pathname);
    }
  }, [isAuthenticated, trackPageView]);

  // Check if current path is /admin
  const isAdminPath = window.location.pathname === '/admin';

  // Show landing page if not authenticated
  if (!isAuthenticated || loginStatus === 'initializing') {
    return (
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <LandingPage />
        <Toaster />
      </ThemeProvider>
    );
  }

  // Show profile setup if user is authenticated but has no profile
  if (showProfileSetup) {
    return (
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <ProfileSetup />
        <Toaster />
      </ThemeProvider>
    );
  }

  // Show loading state while profile is being fetched
  if (profileLoading || !isFetched || adminLoading) {
    return (
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <div className="flex h-screen items-center justify-center bg-background">
          <div className="text-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
            <p className="text-muted-foreground">Loading your profile...</p>
          </div>
        </div>
        <Toaster />
      </ThemeProvider>
    );
  }

  // Handle /admin route
  if (isAdminPath) {
    if (isAdmin) {
      return (
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AdminDashboard />
          <Toaster />
        </ThemeProvider>
      );
    } else {
      return (
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AccessDeniedScreen />
          <Toaster />
        </ThemeProvider>
      );
    }
  }

  // Route to appropriate dashboard based on user role
  const renderDashboard = () => {
    if (!userProfile) return null;

    switch (userProfile.role) {
      case Role.venue:
        return <VenueDashboard />;
      case Role.musician:
        return <MusicianDashboard />;
      case Role.customer:
        return <CustomerDashboard />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      {renderDashboard()}
      <Toaster />
    </ThemeProvider>
  );
}
