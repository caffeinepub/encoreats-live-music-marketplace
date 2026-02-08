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
      <header className="sticky top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <img 
              src="/assets/generated/logo_full_dark_mode.png.dim_1024x1024.png" 
              alt="Encoreats Logo" 
              className="h-10 w-10"
            />
            <span className="text-2xl font-bold font-heading bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Encoreats
            </span>
          </div>
          <Button 
            onClick={() => handleRoleLogin('venue')} 
            disabled={isLoggingIn} 
            size="lg" 
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-glow transition-all duration-300"
          >
            {isLoggingIn ? 'Connecting...' : 'Get Started'}
          </Button>
        </div>
      </header>

      {/* Hero Section - Cyber-Noir with Jazz Band Background */}
      <section className="relative overflow-hidden min-h-[600px] md:min-h-[700px] flex items-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img 
            src="/assets/generated/hero_jazz_band_bg.dim_2400x1350.jpg" 
            alt="Live Jazz Band Performance" 
            className="w-full h-full object-cover"
          />
          {/* 60% Black Overlay */}
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        {/* Content */}
        <div className="container relative mx-auto px-4 py-20 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-300">Live Music Marketplace</span>
            </div>
            
            {/* Hero Headline - White Text */}
            <h1 className="mb-6 text-5xl font-bold font-heading leading-tight tracking-tight text-white md:text-7xl">
              Where Live Music
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent">
                Finds a Home
              </span>
            </h1>
            
            {/* Body Text - Slate-400 */}
            <p className="mb-10 text-xl text-slate-400 md:text-2xl">
              Connect venues, musicians, and music lovers in one seamless platform.
              <br />
              Book gigs, manage events, and experience live music like never before.
            </p>
            
            {/* CTA Button - Neon Purple Gradient with Glow */}
            <div className="flex justify-center">
              <Button 
                onClick={() => handleRoleLogin('venue')} 
                disabled={isLoggingIn} 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg h-16 px-10 gap-2 shadow-glow-lg transition-all duration-300 hover:shadow-glow-lg hover:scale-105"
              >
                {isLoggingIn ? 'Connecting...' : 'Book Now'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Role Selection Section - Glassmorphism Cards */}
      <section className="py-16 bg-background/50">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold font-heading text-white">Join the Movement</h2>
            <p className="text-xl text-slate-400">Choose your role and start your journey</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            <Card className="backdrop-blur-xl bg-white/5 border-white/10 hover:border-purple-500/50 transition-all duration-300 group cursor-pointer" onClick={() => !isLoggingIn && handleRoleLogin('venue')}>
              <CardHeader className="text-center">
                <div className="mb-4 mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors">
                  <Building2 className="h-8 w-8 text-purple-400" />
                </div>
                <CardTitle className="text-white text-2xl">For Venues</CardTitle>
                <CardDescription className="text-slate-400 text-base">
                  Book talented musicians, generate marketing assets, track ROI, and manage events seamlessly.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={(e) => { e.stopPropagation(); handleRoleLogin('venue'); }} 
                  disabled={isLoggingIn} 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  {isLoggingIn ? 'Connecting...' : 'Join as Venue'}
                </Button>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-white/5 border-white/10 hover:border-pink-500/50 transition-all duration-300 group cursor-pointer" onClick={() => !isLoggingIn && handleRoleLogin('musician')}>
              <CardHeader className="text-center">
                <div className="mb-4 mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-pink-500/20 group-hover:bg-pink-500/30 transition-colors">
                  <Music className="h-8 w-8 text-pink-400" />
                </div>
                <CardTitle className="text-white text-2xl">For Musicians</CardTitle>
                <CardDescription className="text-slate-400 text-base">
                  Manage your calendar, track payments with our wallet system, and get booked for more gigs.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={(e) => { e.stopPropagation(); handleRoleLogin('musician'); }} 
                  disabled={isLoggingIn} 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  {isLoggingIn ? 'Connecting...' : 'Join as Musician'}
                </Button>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-white/5 border-white/10 hover:border-teal-500/50 transition-all duration-300 group cursor-pointer" onClick={() => !isLoggingIn && handleRoleLogin('customer')}>
              <CardHeader className="text-center">
                <div className="mb-4 mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-teal-500/20 group-hover:bg-teal-500/30 transition-colors">
                  <Users className="h-8 w-8 text-teal-400" />
                </div>
                <CardTitle className="text-white text-2xl">For Music Lovers</CardTitle>
                <CardDescription className="text-slate-400 text-base">
                  Discover live music events, reserve tables, and experience unforgettable performances.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={(e) => { e.stopPropagation(); handleRoleLogin('customer'); }} 
                  disabled={isLoggingIn} 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  {isLoggingIn ? 'Connecting...' : 'Join as Customer'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 backdrop-blur-xl bg-white/5">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder="Search events by name, city, or genre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 pl-12 text-lg bg-white/5 backdrop-blur-sm border-white/10 text-white placeholder:text-slate-500 focus:border-purple-500/50"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold font-heading text-white">Upcoming Events</h2>
            <p className="text-xl text-slate-400">Discover amazing live music experiences near you</p>
          </div>

          {upcomingGigs.length === 0 ? (
            <div className="text-center py-12">
              <Music className="h-16 w-16 mx-auto mb-4 text-slate-600" />
              <p className="text-xl text-slate-400">No upcoming events yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcomingGigs.map((gig) => (
                <Card key={Number(gig.id)} className="group overflow-hidden backdrop-blur-xl bg-white/5 border-white/10 hover:border-purple-500/50 transition-all duration-300">
                  <div className="aspect-video w-full overflow-hidden bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                    <img
                      src="/assets/generated/placeholder_venue_cover.dim_1600x900.jpg"
                      alt={gig.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <CardHeader>
                    <div className="mb-2 flex items-center justify-between">
                      <Badge variant="outline" className="border-purple-500 text-purple-400 bg-purple-500/10">
                        Live Music
                      </Badge>
                      <span className="text-sm font-semibold text-teal-400">₹{Number(gig.price)}</span>
                    </div>
                    <CardTitle className="text-xl text-white">{gig.name}</CardTitle>
                    <CardDescription className="flex flex-col gap-2 text-base text-slate-400">
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
                    <Button 
                      onClick={() => handleRoleLogin('customer')} 
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-glow transition-all duration-300" 
                      disabled={isLoggingIn}
                    >
                      {isLoggingIn ? 'Connecting...' : 'Reserve Table'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 backdrop-blur-xl bg-white/5 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-3">
              <img 
                src="/assets/generated/logo_full_dark_mode.png.dim_1024x1024.png" 
                alt="Encoreats Logo" 
                className="h-8 w-8"
              />
              <span className="text-xl font-bold font-heading text-white">Encoreats</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="text-slate-400 hover:text-purple-400 transition-colors">
                <SiFacebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-purple-400 transition-colors">
                <SiX className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-purple-400 transition-colors">
                <SiInstagram className="h-5 w-5" />
              </a>
            </div>
            <p className="text-sm text-slate-400">
              © 2026. Built with ❤️ using{' '}
              <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 transition-colors hover:underline">
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
