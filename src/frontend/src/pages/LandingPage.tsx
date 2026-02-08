import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useFetchAllGigs } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Music, MapPin, Calendar, Search, Sparkles, Building2, Users } from 'lucide-react';
import { SiFacebook, SiX, SiInstagram } from 'react-icons/si';
import { useState } from 'react';
import { setSelectedRole } from '../utils/urlParams';

export default function LandingPage() {
  const { login, loginStatus } = useInternetIdentity();
  const { data: gigs = [] } = useFetchAllGigs();
  const [searchQuery, setSearchQuery] = useState('');

  const isLoggingIn = loginStatus === 'logging-in';

  const handleRoleLogin = async (role: 'venue' | 'musician' | 'customer') => {
    setSelectedRole(role);
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.message === 'User is already authenticated') {
        // Handle edge case where user is already authenticated
        await login();
      }
    }
  };

  const filteredGigs = gigs.filter((gig) =>
    gig.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const upcomingGigs = filteredGigs
    .filter((gig) => Number(gig.date) > Date.now() * 1000000)
    .sort((a, b) => Number(a.date) - Number(b.date))
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Music className="h-8 w-8 text-chart-1" />
            <span className="text-2xl font-bold bg-gradient-to-r from-chart-1 to-chart-4 bg-clip-text text-transparent">
              Encoreats
            </span>
          </div>
          <Button onClick={() => handleRoleLogin('venue')} disabled={isLoggingIn} size="lg" className="bg-chart-1 hover:bg-chart-1/90">
            {isLoggingIn ? 'Connecting...' : 'Get Started'}
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-chart-1/20 via-background to-chart-4/20"></div>
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-chart-1/30 bg-chart-1/10 px-4 py-2 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-chart-1" />
              <span className="text-sm font-medium text-chart-1">Live Music Marketplace</span>
            </div>
            <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight md:text-7xl">
              Where Live Music
              <br />
              <span className="bg-gradient-to-r from-chart-1 via-chart-4 to-chart-2 bg-clip-text text-transparent">
                Finds a Home
              </span>
            </h1>
            <p className="mb-8 text-xl text-muted-foreground md:text-2xl">
              Connect venues, musicians, and music lovers in one seamless platform.
              <br />
              Book gigs, manage events, and experience live music like never before.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button 
                onClick={() => handleRoleLogin('venue')} 
                disabled={isLoggingIn} 
                size="lg" 
                className="bg-chart-1 hover:bg-chart-1/90 text-lg h-14 px-8 gap-2"
              >
                <Building2 className="h-5 w-5" />
                {isLoggingIn ? 'Connecting...' : 'Join as Venue'}
              </Button>
              <Button 
                onClick={() => handleRoleLogin('musician')} 
                disabled={isLoggingIn} 
                size="lg" 
                variant="outline" 
                className="border-chart-4 text-chart-4 hover:bg-chart-4/10 text-lg h-14 px-8 gap-2"
              >
                <Music className="h-5 w-5" />
                {isLoggingIn ? 'Connecting...' : 'Join as Musician'}
              </Button>
              <Button 
                onClick={() => handleRoleLogin('customer')} 
                disabled={isLoggingIn} 
                size="lg" 
                variant="outline" 
                className="border-chart-2 text-chart-2 hover:bg-chart-2/10 text-lg h-14 px-8 gap-2"
              >
                <Users className="h-5 w-5" />
                {isLoggingIn ? 'Connecting...' : 'Join as Customer'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search events by name, city, or genre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 pl-12 text-lg bg-background/50 backdrop-blur-sm border-border/50"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold">Upcoming Events</h2>
            <p className="text-xl text-muted-foreground">Discover amazing live music experiences near you</p>
          </div>

          {upcomingGigs.length === 0 ? (
            <div className="text-center py-12">
              <Music className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-xl text-muted-foreground">No upcoming events yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcomingGigs.map((gig) => (
                <Card key={Number(gig.id)} className="group overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-chart-1/50 transition-all duration-300">
                  <div className="aspect-video w-full overflow-hidden bg-gradient-to-br from-chart-1/20 to-chart-4/20">
                    <img
                      src="/assets/generated/venue-hero.dim_1200x800.jpg"
                      alt={gig.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <CardHeader>
                    <div className="mb-2 flex items-center justify-between">
                      <Badge variant="outline" className="border-chart-1 text-chart-1">
                        Live Music
                      </Badge>
                      <span className="text-sm font-semibold text-chart-2">₹{Number(gig.price)}</span>
                    </div>
                    <CardTitle className="text-xl">{gig.name}</CardTitle>
                    <CardDescription className="flex flex-col gap-2 text-base">
                      <span className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(Number(gig.date) / 1000000).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Venue Location
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={() => handleRoleLogin('customer')} className="w-full bg-chart-1 hover:bg-chart-1/90" disabled={isLoggingIn}>
                      {isLoggingIn ? 'Connecting...' : 'Reserve Table'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold">Why Choose Encoreats?</h2>
            <p className="text-xl text-muted-foreground">Everything you need for live music success</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-border/50 bg-background/50 backdrop-blur-sm">
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-chart-1/20">
                  <Building2 className="h-6 w-6 text-chart-1" />
                </div>
                <CardTitle>For Venues</CardTitle>
                <CardDescription className="text-base">
                  Book talented musicians, generate marketing assets, track ROI, and manage events seamlessly.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 bg-background/50 backdrop-blur-sm">
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-chart-4/20">
                  <Music className="h-6 w-6 text-chart-4" />
                </div>
                <CardTitle>For Musicians</CardTitle>
                <CardDescription className="text-base">
                  Manage your calendar, track payments with our wallet system, and get booked for more gigs.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 bg-background/50 backdrop-blur-sm">
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-chart-2/20">
                  <Users className="h-6 w-6 text-chart-2" />
                </div>
                <CardTitle>For Music Lovers</CardTitle>
                <CardDescription className="text-base">
                  Discover live music events, reserve tables, and experience unforgettable performances.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/30 backdrop-blur-sm py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <Music className="h-6 w-6 text-chart-1" />
              <span className="text-xl font-bold">Encoreats</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="text-muted-foreground hover:text-chart-1 transition-colors">
                <SiFacebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-chart-1 transition-colors">
                <SiX className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-chart-1 transition-colors">
                <SiInstagram className="h-5 w-5" />
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026. Built with ❤️ using{' '}
              <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="text-chart-1 hover:underline">
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
