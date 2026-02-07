import { useFetchAllGigs } from '../hooks/useQueries';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import Header from '../components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Music, Search } from 'lucide-react';
import { Variant_pending_completed_confirmed } from '../backend';
import { useState } from 'react';

export default function CustomerDashboard() {
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: gigs = [] } = useFetchAllGigs();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGigs = gigs.filter((gig) =>
    gig.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const upcomingGigs = filteredGigs
    .filter((gig) => Number(gig.date) > Date.now() * 1000000)
    .sort((a, b) => Number(a.date) - Number(b.date));

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome, <span className="bg-gradient-to-r from-chart-1 to-chart-4 bg-clip-text text-transparent">{userProfile?.name}</span>
          </h1>
          <p className="text-xl text-muted-foreground">Discover amazing live music events</p>
        </div>

        {/* Search Bar */}
        <Card className="mb-8 border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6">
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
          </CardContent>
        </Card>

        {/* Events Grid */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
        </div>

        {upcomingGigs.length === 0 ? (
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="py-12 text-center">
              <Music className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-xl text-muted-foreground">No upcoming events found</p>
              <p className="text-muted-foreground mt-2">Try adjusting your search or check back later</p>
            </CardContent>
          </Card>
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
                      {gig.status === Variant_pending_completed_confirmed.confirmed ? 'Confirmed' : 'Pending'}
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
                  <Button className="w-full bg-chart-1 hover:bg-chart-1/90">
                    Reserve Table
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
