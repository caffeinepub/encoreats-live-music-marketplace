import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useFetchVenueGigs, useFetchAllMusicians, useBookGig, useVerifyGig } from '../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import Header from '../components/Header';
import MusicianSearch from '../components/MusicianSearch';
import BookingDialog from '../components/BookingDialog';
import QRScannerDialog from '../components/QRScannerDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Music, QrCode, TrendingUp, Users } from 'lucide-react';
import type { UserProfile, Gig } from '../backend';
import { Variant_pending_completed_confirmed } from '../backend';

export default function VenueDashboard() {
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: venueGigs = [] } = useFetchVenueGigs(identity?.getPrincipal().toString() || null);
  const { data: musicians = [] } = useFetchAllMusicians();
  const [selectedMusician, setSelectedMusician] = useState<UserProfile | null>(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [selectedGigForScan, setSelectedGigForScan] = useState<Gig | null>(null);

  const upcomingGigs = venueGigs.filter((gig) => Number(gig.date) > Date.now() * 1000000);
  const completedGigs = venueGigs.filter((gig) => gig.status === Variant_pending_completed_confirmed.completed);

  const handleBookMusician = (musician: UserProfile) => {
    setSelectedMusician(musician);
    setShowBookingDialog(true);
  };

  const handleScanQR = (gig: Gig) => {
    setSelectedGigForScan(gig);
    setShowQRScanner(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, <span className="bg-gradient-to-r from-chart-1 to-chart-4 bg-clip-text text-transparent">{userProfile?.name}</span>
          </h1>
          <p className="text-xl text-muted-foreground">Manage your venue and book amazing musicians</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Gigs</CardTitle>
              <Calendar className="h-4 w-4 text-chart-1" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-chart-1">{upcomingGigs.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Events scheduled</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Music className="h-4 w-4 text-chart-4" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-chart-4">{venueGigs.length}</div>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <TrendingUp className="h-4 w-4 text-chart-2" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-chart-2">{completedGigs.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Successful events</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="musicians" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-card/50 backdrop-blur-sm">
            <TabsTrigger value="musicians">Find Musicians</TabsTrigger>
            <TabsTrigger value="gigs">My Events</TabsTrigger>
          </TabsList>

          <TabsContent value="musicians" className="space-y-6">
            <MusicianSearch musicians={musicians} onBookMusician={handleBookMusician} />
          </TabsContent>

          <TabsContent value="gigs" className="space-y-6">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl">Your Events</CardTitle>
                <CardDescription>Manage and track your booked events</CardDescription>
              </CardHeader>
              <CardContent>
                {venueGigs.length === 0 ? (
                  <div className="text-center py-12">
                    <Music className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-xl text-muted-foreground mb-4">No events booked yet</p>
                    <Button onClick={() => document.querySelector('[value="musicians"]')?.dispatchEvent(new Event('click', { bubbles: true }))} className="bg-chart-1 hover:bg-chart-1/90">
                      Book Your First Musician
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {venueGigs.map((gig) => (
                      <Card key={Number(gig.id)} className="border-border/50 bg-background/50">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-xl mb-2">{gig.name}</CardTitle>
                              <CardDescription className="flex flex-col gap-2">
                                <span className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  {new Date(Number(gig.date) / 1000000).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })}
                                </span>
                                <span className="text-lg font-semibold text-chart-2">₹{Number(gig.price)}</span>
                              </CardDescription>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <Badge
                                variant="outline"
                                className={
                                  gig.status === Variant_pending_completed_confirmed.completed
                                    ? 'border-chart-2 text-chart-2'
                                    : gig.status === Variant_pending_completed_confirmed.confirmed
                                    ? 'border-chart-1 text-chart-1'
                                    : 'border-muted-foreground text-muted-foreground'
                                }
                              >
                                {gig.status === Variant_pending_completed_confirmed.confirmed ? 'confirmed' : 
                                 gig.status === Variant_pending_completed_confirmed.completed ? 'completed' : 'pending'}
                              </Badge>
                              {gig.status === Variant_pending_completed_confirmed.confirmed && Number(gig.date) < Date.now() * 1000000 && (
                                <Button
                                  size="sm"
                                  onClick={() => handleScanQR(gig)}
                                  className="bg-chart-1 hover:bg-chart-1/90"
                                >
                                  <QrCode className="h-4 w-4 mr-2" />
                                  Verify Attendance
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {selectedMusician && (
        <BookingDialog
          open={showBookingDialog}
          onOpenChange={setShowBookingDialog}
          musician={selectedMusician}
        />
      )}

      {selectedGigForScan && (
        <QRScannerDialog
          open={showQRScanner}
          onOpenChange={setShowQRScanner}
          gig={selectedGigForScan}
        />
      )}
    </div>
  );
}
